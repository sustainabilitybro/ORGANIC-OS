# API tests - pytest configuration
import pytest
import sys
from pathlib import Path

# Add the app directory to the path
app_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(app_dir))

# Pytest configuration
pytest_plugins = ['pytest_asyncio']
