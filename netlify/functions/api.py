"""
ATHLYNX Netlify Function - Python Backend API
Wraps FastAPI app with Mangum for serverless deployment
"""
import sys
import os

# Add python-backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', 'python-backend'))

from main import app
from mangum import Mangum

# Create handler for Netlify Functions
handler = Mangum(app, lifespan="off")

