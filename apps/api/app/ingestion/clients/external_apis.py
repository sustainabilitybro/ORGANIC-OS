
import aiohttp
import asyncio
from typing import List, Dict, Optional, Any
import logging
from xml.etree import ElementTree as ET
import json
import urllib.parse
from datetime import datetime

logger = logging.getLogger(__name__)

class PubMedClient:
    """Client for NCBI E-utilities (PubMed)."""
    BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        # NCBI limits: 3 rq/s with key, 1/3 rq/s without.
        self.rate_limit = 3 if api_key else 0.3
        self.last_request = 0

    async def search(self, query: str, max_results: int = 20) -> List[str]:
        """Search PubMed and return list of PMIDs."""
        params = {
            "db": "pubmed",
            "term": query,
            "retmode": "json",
            "retmax": max_results,
            "sort": "relevance"
        }
        if self.api_key:
            params["api_key"] = self.api_key

        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/esearch.fcgi", params=params) as resp:
                if resp.status != 200:
                    logger.error(f"PubMed Search Error: {resp.status}")
                    return []
                data = await resp.json()
                return data.get("esearchresult", {}).get("idlist", [])

    async def fetch_details(self, pmids: List[str]) -> List[Dict]:
        """Fetch details for a list of PMIDs."""
        if not pmids:
            return []
        
        pmids_str = ",".join(pmids)
        params = {
            "db": "pubmed",
            "id": pmids_str,
            "retmode": "xml"
        }
        if self.api_key:
            params["api_key"] = self.api_key
            
        async with aiohttp.ClientSession() as session:
            async with session.get(f"{self.BASE_URL}/efetch.fcgi", params=params) as resp:
                if resp.status != 200:
                    return []
                xml_content = await resp.text()
                # Parse XML here (simplified)
                # In a real app, use biopython or xmltodict robustly
                return [{"pmid": pmid, "raw_xml": "..."} for pmid in pmids] # Placeholder

class ClinicalTrialsClient:
    """Client for ClinicalTrials.gov API (v2)."""
    BASE_URL = "https://clinicaltrials.gov/api/v2/studies"
    
    async def search_trials(self, term: str, max_results: int = 10):
        params = {
            "query.term": term,
            "pageSize": max_results,
            "format": "json"
        }
        async with aiohttp.ClientSession() as session:
             async with session.get(self.BASE_URL, params=params) as resp:
                 if resp.status == 200:
                     return await resp.json()
                 return {}

class OpenSourcePharmaClient:
    """Consolidated client for open botanical/chem APIs."""
    
    # 1. Perenual (Plant Data)
    PERENUAL_BASE = "https://perenual.com/api"
    
    # 2. COCONUT (Natural Products)
    COCONUT_BASE = "https://coconut.naturalproducts.net/api"
    
    # 3. ChEMBL 
    CHEMBL_BASE = "https://www.ebi.ac.uk/chembl/api/data"

    def __init__(self, perenual_key: Optional[str] = None):
        self.perenual_key = perenual_key

    async def search_plant_perenual(self, query: str):
        if not self.perenual_key:
            logger.warning("No Perenual API Key provided")
            return {}
        
        url = f"{self.PERENUAL_BASE}/species-list?key={self.perenual_key}&q={query}"
        async with aiohttp.ClientSession() as session:
             async with session.get(url) as resp:
                 return await resp.json() if resp.status == 200 else {}
    
    async def search_coconut_compound(self, name: str):
        """Search compound in COCONUT DB."""
        # COCONUT search often works better by InChI or SMILES, but simple text search exists
        url = f"{self.COCONUT_BASE}/search/simple?query={name}"
        async with aiohttp.ClientSession() as session:
             async with session.get(url) as resp:
                 return await resp.json() if resp.status == 200 else {}

    async def get_herb_interactions_chembl(self, molecule_name: str):
        """Rough check for molecule targets in ChEMBL."""
        url = f"{self.CHEMBL_BASE}/molecule/search?q={molecule_name}&format=json"
        async with aiohttp.ClientSession() as session:
             async with session.get(url) as resp:
                 return await resp.json() if resp.status == 200 else {}

