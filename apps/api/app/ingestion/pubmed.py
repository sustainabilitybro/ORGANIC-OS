"""
PubMed Literature Ingestion Pipeline.
Fetches and parses research articles from PubMed/NCBI.
"""

import re
import asyncio
from typing import List, Dict, Optional, Any
from datetime import datetime
import httpx
from bs4 import BeautifulSoup
import xml.etree.ElementTree as ET

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.evidence import EvidenceItem


class PubMedIngester:
    """
    Automated PubMed literature mining.
    Uses NCBI E-utilities API to fetch and parse research articles.
    """
    
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    SEARCH_URL = f"{BASE_URL}/esearch.fcgi"
    FETCH_URL = f"{BASE_URL}/efetch.fcgi"
    
    # NCBI rate limit: 3 requests/second without API key, 10 with API key
    REQUEST_DELAY = 0.35  # seconds between requests
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize with optional NCBI API key for higher rate limits.
        Get free key at: https://www.ncbi.nlm.nih.gov/account/
        """
        self.api_key = api_key
        self.client: Optional[httpx.AsyncClient] = None
    
    async def __aenter__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.client:
            await self.client.aclose()
    
    async def search(
        self,
        query: str,
        max_results: int = 20,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> List[int]:
        """
        Search PubMed for articles matching query.
        Returns list of PMIDs.
        
        Example queries:
        - "turmeric AND inflammation"
        - "(curcumin OR turmeric) AND rheumatoid arthritis"
        - "ashwagandha AND (anxiety OR stress)"
        """
        params = {
            "db": "pubmed",
            "term": query,
            "retmax": max_results,
            "retmode": "json",
            "sort": "relevance"
        }
        
        if date_from:
            params["mindate"] = date_from
        if date_to:
            params["maxdate"] = date_to
        if date_from or date_to:
            params["datetype"] = "pdat"  # Publication date
        
        if self.api_key:
            params["api_key"] = self.api_key
        
        if not self.client:
            self.client = httpx.AsyncClient(timeout=30.0)
        
        resp = await self.client.get(self.SEARCH_URL, params=params)
        data = resp.json()
        
        pmids = data.get("esearchresult", {}).get("idlist", [])
        return [int(pmid) for pmid in pmids]
    
    async def fetch_articles(self, pmids: List[int]) -> List[Dict[str, Any]]:
        """
        Fetch full article metadata for given PMIDs.
        Returns parsed article data.
        """
        if not pmids:
            return []
        
        params = {
            "db": "pubmed",
            "id": ",".join(str(p) for p in pmids),
            "retmode": "xml",
            "rettype": "abstract"
        }
        
        if self.api_key:
            params["api_key"] = self.api_key
        
        if not self.client:
            self.client = httpx.AsyncClient(timeout=30.0)
        
        resp = await self.client.get(self.FETCH_URL, params=params)
        xml_text = resp.text
        
        return self._parse_pubmed_xml(xml_text)
    
    def _parse_pubmed_xml(self, xml_text: str) -> List[Dict[str, Any]]:
        """Parse PubMed XML response into structured data."""
        articles = []
        
        try:
            root = ET.fromstring(xml_text)
        except ET.ParseError:
            return []
        
        for article in root.findall(".//PubmedArticle"):
            try:
                parsed = self._parse_single_article(article)
                if parsed:
                    articles.append(parsed)
            except Exception as e:
                print(f"Error parsing article: {e}")
                continue
        
        return articles
    
    def _parse_single_article(self, article: ET.Element) -> Optional[Dict[str, Any]]:
        """Parse a single PubmedArticle XML element."""
        
        medline = article.find(".//MedlineCitation")
        if medline is None:
            return None
        
        pmid_elem = medline.find(".//PMID")
        pmid = int(pmid_elem.text) if pmid_elem is not None and pmid_elem.text else None
        
        if not pmid:
            return None
        
        article_data = medline.find(".//Article")
        if article_data is None:
            return None
        
        # Title
        title_elem = article_data.find(".//ArticleTitle")
        title = (title_elem.text if title_elem is not None and title_elem.text else "") or ""
        
        # Abstract
        abstract_parts = []
        for abstract_text in article_data.findall(".//Abstract/AbstractText"):
            label = abstract_text.get("Label", "")
            text = abstract_text.text or ""
            if label:
                abstract_parts.append(f"{label}: {text}")
            else:
                abstract_parts.append(text)
        abstract = " ".join(abstract_parts)
        
        # Authors
        authors = []
        for author in article_data.findall(".//AuthorList/Author"):
            last_name = author.findtext("LastName", "")
            first_name = author.findtext("ForeName", "")
            affiliation = author.findtext(".//Affiliation", "")
            authors.append({
                "name": f"{first_name} {last_name}".strip(),
                "affiliation": affiliation
            })
        
        # Journal
        journal = article_data.find(".//Journal")
        journal_name = ""
        volume = ""
        issue = ""
        year = None
        
        if journal is not None:
            journal_title = journal.find(".//Title")
            journal_name = journal_title.text if journal_title is not None else ""
            
            journal_issue = journal.find(".//JournalIssue")
            if journal_issue is not None:
                vol_elem = journal_issue.find("Volume")
                volume = vol_elem.text if vol_elem is not None else ""
                
                issue_elem = journal_issue.find("Issue")
                issue = issue_elem.text if issue_elem is not None else ""
                
                # Year
                year_elem = journal_issue.find(".//Year")
                if year_elem is not None and year_elem.text:
                    year = int(year_elem.text)
        
        # Pagination
        pagination = article_data.find(".//Pagination/MedlinePgn")
        pages = pagination.text if pagination is not None else ""
        
        # DOI
        doi = None
        for article_id in article.findall(".//ArticleIdList/ArticleId"):
            if article_id.get("IdType") == "doi":
                doi = article_id.text
                break
        
        # Publication types (to help identify study design)
        pub_types = []
        for pt in medline.findall(".//PublicationTypeList/PublicationType"):
            if pt.text:
                pub_types.append(pt.text)
        
        # Detect study design from publication types and title/abstract
        study_design = self._detect_study_design(pub_types, title or "", abstract or "")
        
        # MeSH terms
        mesh_terms = []
        for mesh in medline.findall(".//MeshHeadingList/MeshHeading/DescriptorName"):
            if mesh.text:
                mesh_terms.append(mesh.text)
        
        return {
            "pmid": pmid,
            "title": title,
            "abstract": abstract,
            "authors": authors,
            "journal_name": journal_name,
            "volume": volume,
            "issue": issue,
            "pages": pages,
            "publication_year": year,
            "doi": doi,
            "publication_types": pub_types,
            "study_design": study_design,
            "mesh_terms": mesh_terms,
            "source_type": "pubmed_article",
            "source_id": f"PMID:{pmid}",
            "url_primary": f"https://pubmed.ncbi.nlm.nih.gov/{pmid}/"
        }
    
    def _detect_study_design(
        self, 
        pub_types: List[str], 
        title: str, 
        abstract: str
    ) -> str:
        """
        Attempt to detect study design from metadata.
        Returns: 'RCT', 'meta_analysis', 'systematic_review', 'observational', 
                 'case_report', 'review', 'in_vitro', 'animal_study', 'unknown'
        """
        text = f"{title} {abstract}".lower()
        pub_types_lower = [pt.lower() for pt in pub_types]
        
        # Check publication types first
        if "meta-analysis" in pub_types_lower:
            return "meta_analysis"
        if "systematic review" in pub_types_lower:
            return "systematic_review"
        if "randomized controlled trial" in pub_types_lower:
            return "RCT"
        if "clinical trial" in pub_types_lower:
            return "clinical_trial"
        if "case reports" in pub_types_lower:
            return "case_report"
        if "review" in pub_types_lower:
            return "review"
        
        # Check text patterns
        if "randomized" in text and ("controlled" in text or "trial" in text):
            return "RCT"
        if "meta-analysis" in text or "meta analysis" in text:
            return "meta_analysis"
        if "systematic review" in text:
            return "systematic_review"
        if "cohort" in text or "observational" in text or "cross-sectional" in text:
            return "observational"
        if "case report" in text or "case series" in text:
            return "case_report"
        if "in vitro" in text or "cell line" in text or "cell culture" in text:
            return "in_vitro"
        if any(animal in text for animal in ["mice", "rats", "mouse", "rat", "animal model", "rodent"]):
            return "animal_study"
        
        return "unknown"
    
    def assess_quality(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """
        Assess quality of a study based on available metadata.
        Returns quality metrics.
        """
        text = f"{article.get('title', '')} {article.get('abstract', '')}".lower()
        study_design = article.get("study_design", "unknown")
        
        quality = {
            "jadad_score": None,  # Only for RCTs
            "risk_of_bias": "unknown",
            "sample_size": None,
            "blinding": None,
            "randomization": None
        }
        
        # Extract sample size from abstract
        sample_patterns = [
            r"n\s*=\s*(\d+)",
            r"(\d+)\s*participants",
            r"(\d+)\s*patients",
            r"(\d+)\s*subjects",
            r"sample.*?(\d+)"
        ]
        for pattern in sample_patterns:
            match = re.search(pattern, text)
            if match:
                quality["sample_size"] = int(match.group(1))
                break
        
        # For RCTs, try to estimate Jadad score
        if study_design == "RCT":
            jadad = 0
            
            # Randomization mentioned? (0-2 points)
            if "randomized" in text or "randomly" in text:
                jadad += 1
                if any(term in text for term in ["computer-generated", "random number", 
                                                   "randomization sequence", "block randomization"]):
                    jadad += 1
            
            # Blinding mentioned? (0-2 points)
            if "double-blind" in text or "double blind" in text:
                jadad += 2
                quality["blinding"] = "double_blind"
            elif "single-blind" in text or "single blind" in text:
                jadad += 1
                quality["blinding"] = "single_blind"
            elif "open-label" in text or "open label" in text:
                quality["blinding"] = "open_label"
            
            # Withdrawals described? (0-1 point)
            if any(term in text for term in ["withdrawal", "dropout", "lost to follow-up"]):
                jadad += 1
            
            quality["jadad_score"] = jadad
            
            # Risk of bias assessment
            if jadad >= 4:
                quality["risk_of_bias"] = "low"
            elif jadad >= 2:
                quality["risk_of_bias"] = "some_concerns"
            else:
                quality["risk_of_bias"] = "high"
        
        return quality
    
    async def ingest_to_database(
        self,
        db: AsyncSession,
        query: str,
        max_results: int = 20,
        date_from: Optional[str] = None,
        date_to: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Full ingestion pipeline: search, fetch, parse, and store in database.
        Returns summary of ingestion results.
        """
        results = {
            "query": query,
            "articles_found": 0,
            "articles_ingested": 0,
            "duplicates_skipped": 0,
            "errors": []
        }
        
        try:
            # Search PubMed
            pmids = await self.search(query, max_results, date_from, date_to)
            results["articles_found"] = len(pmids)
            
            if not pmids:
                return results
            
            await asyncio.sleep(self.REQUEST_DELAY)
            
            # Fetch article data
            articles = await self.fetch_articles(pmids)
            
            # Process each article
            for article in articles:
                try:
                    # Check if already exists
                    existing = await db.execute(
                        select(EvidenceItem).where(EvidenceItem.pmid == article["pmid"])
                    )
                    if existing.scalar_one_or_none():
                        results["duplicates_skipped"] += 1
                        continue
                    
                    # Assess quality
                    quality = self.assess_quality(article)
                    
                    # Create evidence item
                    evidence = EvidenceItem(
                        source_type=article["source_type"],
                        source_id=article["source_id"],
                        title=article["title"],
                        abstract=article["abstract"],
                        authors=article["authors"],
                        publication_year=article["publication_year"],
                        journal_name=article["journal_name"],
                        volume=article.get("volume"),
                        issue=article.get("issue"),
                        pages=article.get("pages"),
                        doi=article.get("doi"),
                        pmid=article["pmid"],
                        url_primary=article.get("url_primary"),
                        study_design=article["study_design"],
                        sample_size_total=quality.get("sample_size"),
                        quality_score_jadad=quality.get("jadad_score"),
                        risk_of_bias_category=quality.get("risk_of_bias"),
                        blinding_type=quality.get("blinding"),
                        extracted_by_nlp=True,
                        added_to_db_date=datetime.now()
                    )
                    
                    db.add(evidence)
                    results["articles_ingested"] += 1
                    
                except Exception as e:
                    results["errors"].append(f"PMID {article.get('pmid')}: {str(e)}")
            
            await db.commit()
            
        except Exception as e:
            results["errors"].append(f"Pipeline error: {str(e)}")
            await db.rollback()
        
        return results


class EvidenceGrader:
    """
    Calculates evidence level (1-5) and certainty based on available research.
    """
    
    @staticmethod
    def calculate_evidence_level(
        rct_count: int = 0,
        rct_total_participants: int = 0,
        meta_analyses_count: int = 0,
        systematic_reviews_count: int = 0,
        observational_studies_count: int = 0,
        case_reports_count: int = 0,
        animal_studies_count: int = 0,
        in_vitro_studies_count: int = 0,
        heterogeneity_i2: Optional[float] = None,
        average_jadad_score: Optional[float] = None,
        coi_ratio: float = 0.0,
        meta_analysis_quality_score: Optional[float] = None
    ) -> tuple:


        """
        Calculate evidence level and certainty.
        
        Returns: (evidence_level: int 1-5, certainty: str)
        
        Level 1: Multiple large RCTs or meta-analyses with consistent positive findings
        Level 2: Large RCT or multiple moderate RCTs with positive findings
        Level 3: Smaller RCTs, quasi-experimental, or observational studies
        Level 4: Case reports, expert opinion, or limited observational data
        Level 5: Traditional use only, in vitro/animal studies, theoretical basis
        """
        scores = []
        
        # Meta-analyses (strongest if low heterogeneity)
        if meta_analyses_count >= 1:
            if heterogeneity_i2 is not None and heterogeneity_i2 < 50:
                scores.append(1)
            else:
                scores.append(2)
        
        # RCT evidence
        if rct_count >= 3 and rct_total_participants >= 300:
            scores.append(1)  # Multiple large RCTs
        elif rct_count >= 1 and rct_total_participants >= 200:
            scores.append(2)  # Large RCT
        elif rct_count >= 2 and rct_total_participants >= 100:
            scores.append(2)  # Multiple moderate RCTs
        elif rct_count >= 1:
            scores.append(3)  # Small RCT
        
        # Systematic reviews
        if systematic_reviews_count >= 1:
            if not scores:
                scores.append(2)
            else:
                scores.append(min(scores[0], 2))
        
        # Observational studies
        if observational_studies_count >= 5:
            scores.append(3)
        elif observational_studies_count > 0:
            scores.append(4)
        
        # Case reports
        if case_reports_count >= 10:
            scores.append(4)
        elif case_reports_count > 0:
            scores.append(5)
        
        # Animal/in vitro only
        if not scores:
            if animal_studies_count > 0 or in_vitro_studies_count > 0:
                scores.append(5)
        
        # Default
        if not scores:
            scores.append(5)
        
        evidence_level = min(scores)
        
        # Calculate base certainty
        level_certainty = {1: 0.85, 2: 0.70, 3: 0.50, 4: 0.30, 5: 0.15}
        certainty_score = level_certainty[evidence_level]
        
        # --- ROBUSTNESS UPGRADE: Quality Weighting (Jadad) ---
        if average_jadad_score is not None:
            if average_jadad_score >= 4.0:
                certainty_score += 0.10  # High quality boost
            elif average_jadad_score <= 2.0:
                certainty_score -= 0.20  # Low quality penalty
                # If quality is very low, we might even downgrade the level
                if average_jadad_score < 1.5 and evidence_level < 3:
                     evidence_level += 1
        
        # --- ROBUSTNESS UPGRADE: COI Impact ---
        if coi_ratio > 0.5:
            certainty_score -= 0.15  # Heavy commercial bias detected
        elif coi_ratio > 0.3:
            certainty_score -= 0.05
            
        # Adjust for heterogeneity
        if heterogeneity_i2 is not None and heterogeneity_i2 > 75:
            certainty_score -= 0.15
        
        # Ensure bounds
        certainty_score = max(0.05, min(0.95, certainty_score))
        
        # Map to category
        if certainty_score >= 0.75:
            certainty = "high"
        elif certainty_score >= 0.5:
            certainty = "moderate"
        elif certainty_score >= 0.25:
            certainty = "low"
        else:
            certainty = "very_low"
        
        return evidence_level, certainty

