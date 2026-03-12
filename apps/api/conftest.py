# API tests - pytest configuration
import pytest
import sys
from pathlib import Path

# Add the ORGANIC-OS root to the path so apps.api imports work
root_dir = Path(__file__).parent.parent.parent
sys.path.insert(0, str(root_dir))

# Pytest configuration
pytest_plugins = ['pytest_asyncio']
