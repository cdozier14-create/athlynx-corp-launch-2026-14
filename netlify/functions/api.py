"""
ATHLYNX AI Platform - Netlify Python Serverless Function
Wrapper for FastAPI backend
"""

import sys
import os

# Add parent directory to path to import api module
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))

from api.main import app
from mangum import Mangum

# Create Mangum handler for Netlify Functions
handler = Mangum(app, lifespan="off")
