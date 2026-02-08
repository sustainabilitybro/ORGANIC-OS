
import asyncio
import sys
import os

# Add the backend directory to the sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.database.connection import engine, Base
from app.models.remedy_indications import RemedyIndication

async def reset_table():
    async with engine.begin() as conn:
        print("Dropping remedy_indications table...")
        await conn.run_sync(Base.metadata.drop_all, tables=[RemedyIndication.__table__])
        print("Recreating remedy_indications table...")
        await conn.run_sync(Base.metadata.create_all, tables=[RemedyIndication.__table__])
    print("Done.")

if __name__ == "__main__":
    asyncio.run(reset_table())
