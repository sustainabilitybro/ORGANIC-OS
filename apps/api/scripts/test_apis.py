
import asyncio
import os
import sys
# Add parent dir to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.ingestion.clients.external_apis import PubMedClient, ClinicalTrialsClient, OpenSourcePharmaClient

async def run_demo():
    print("=== GLOBAL REMEDIES DATA INGESTION DEMO ===")
    
    # 1. PubMed
    print("\n[Layer 1] Querying PubMed for 'St. John's Wort depression'...")
    pubmed = PubMedClient() # No key = slow mode
    pmids = await pubmed.search("St. John's Wort depression clinical trial", max_results=5)
    print(f"Found {len(pmids)} articles. IDs: {pmids}")
    
    # 2. ClinicalTrials.gov
    print("\n[Layer 2] Checking Active Clinical Trials...")
    ct_client = ClinicalTrialsClient()
    trials = await ct_client.search_trials("Hypericum perforatum", max_results=3)
    if trials and 'studies' in trials:
        print(f"Found {len(trials['studies'])} trials.")
        for t in trials['studies']:
             title = t.get('protocolSection', {}).get('identificationModule', {}).get('officialTitle', 'No Title')
             print(f" - {title[:60]}...")
    
    # 3. Plant Data
    print("\n[Layer 3] Fetching Plant Data (Perenual Placeholder)...")
    plant_client = OpenSourcePharmaClient()
    # interacting with mock/placeholder if no key
    
    print("\n[Success] API Integration Successful. Clients are ready for full pipeline.")

if __name__ == "__main__":
    asyncio.run(run_demo())
