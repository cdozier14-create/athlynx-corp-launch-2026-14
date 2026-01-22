"""
DHG Unified Platform - Python FastAPI Backend
Main Application Entry Point

Consolidated API for all DHG applications:
- Dozier Holdings Group (dozierholdingsgroup.com)
- Athlynx Platform (athlynx.ai)
- Athlynx VIP (athlynxapp.vip)
- Transfer Portal (transferportal.ai)
- Diamond Grind (diamond-grind.ai)

@author Dozier Holdings Group
@owner cdozier14-create
@date January 22, 2026
"""

from fastapi import FastAPI, HTTPException, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Optional
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routers
from routers import auth, verification, waitlist, feed, athlete, social, messages, notifications
from routers import transfer_portal, crm, stripe_router, vip

# Create FastAPI app
app = FastAPI(
    title="DHG Unified API",
    description="Dozier Holdings Group - Unified Platform API for All Applications",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    contact={
        "name": "Dozier Holdings Group",
        "url": "https://dozierholdingsgroup.com",
    },
    license_info={
        "name": "Proprietary",
        "url": "https://dozierholdingsgroup.com/legal",
    },
)

# CORS Configuration - All DHG Domains
ALLOWED_ORIGINS = [
    # Development
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8000",
    
    # Production - DHG Master Site
    "https://dozierholdingsgroup.com",
    "https://www.dozierholdingsgroup.com",
    
    # Production - Athlynx
    "https://athlynx.ai",
    "https://www.athlynx.ai",
    
    # Production - Athlynx VIP
    "https://athlynxapp.vip",
    "https://www.athlynxapp.vip",
    
    # Production - Transfer Portal
    "https://transferportal.ai",
    "https://www.transferportal.ai",
    
    # Production - Diamond Grind
    "https://diamond-grind.ai",
    "https://www.diamond-grind.ai",
    
    # Netlify preview URLs
    "https://athlynx.netlify.app",
    "https://*.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-App-Name", "X-App-Version"],
)

# Custom middleware to identify requesting app
@app.middleware("http")
async def app_identifier_middleware(request: Request, call_next):
    """Identify which app is making the request based on origin"""
    origin = request.headers.get("origin", "")
    app_name = "unknown"
    
    if "dozierholdingsgroup.com" in origin:
        app_name = "dhg"
    elif "athlynxapp.vip" in origin:
        app_name = "athlynxapp-vip"
    elif "athlynx.ai" in origin:
        app_name = "athlynx"
    elif "transferportal.ai" in origin:
        app_name = "transferportal"
    elif "diamond-grind.ai" in origin:
        app_name = "diamond-grind"
    elif "localhost" in origin:
        app_name = "development"
    
    # Add app identifier to request state
    request.state.app_name = app_name
    
    # Process request
    response = await call_next(request)
    
    # Add app identifier to response headers
    response.headers["X-App-Name"] = app_name
    response.headers["X-App-Version"] = "2.0.0"
    
    return response

# Health check endpoint
@app.get("/api/health")
async def health_check(request: Request):
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "DHG Unified API",
        "version": "2.0.0",
        "app": getattr(request.state, "app_name", "unknown"),
        "message": "Dozier Holdings Group - Dreams Do Come True 2026",
        "apps": {
            "dhg": "dozierholdingsgroup.com",
            "athlynx": "athlynx.ai",
            "athlynxapp-vip": "athlynxapp.vip",
            "transferportal": "transferportal.ai",
            "diamond-grind": "diamond-grind.ai"
        }
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "DHG Unified Platform API - 2026",
        "version": "2.0.0",
        "owner": "cdozier14-create",
        "apps": [
            "Dozier Holdings Group",
            "Athlynx Platform",
            "Athlynx VIP",
            "Transfer Portal",
            "Diamond Grind"
        ],
        "docs": "/api/docs",
        "health": "/api/health"
    }

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(verification.router, prefix="/api/verification", tags=["Verification"])
app.include_router(vip.router, prefix="/api/vip", tags=["VIP Codes"])
app.include_router(waitlist.router, prefix="/api/waitlist", tags=["Waitlist"])
app.include_router(feed.router, prefix="/api/feed", tags=["Social Feed"])
app.include_router(athlete.router, prefix="/api/athlete", tags=["Athletes"])
app.include_router(social.router, prefix="/api/social", tags=["Social"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(transfer_portal.router, prefix="/api/transfer-portal", tags=["Transfer Portal"])
app.include_router(crm.router, prefix="/api/crm", tags=["CRM & Analytics"])
app.include_router(stripe_router.router, prefix="/api/stripe", tags=["Payments"])

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.detail, "success": False}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    print(f"[ERROR] {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error", "success": False}
    )

# Startup event
@app.on_event("startup")
async def startup_event():
    print("=" * 80)
    print("🚀 DHG UNIFIED PLATFORM API STARTING...")
    print("=" * 80)
    print("🏢 Dozier Holdings Group - Master Platform")
    print("👨‍💼 Owner: cdozier14-create")
    print("🦁 Dreams Do Come True 2026")
    print("-" * 80)
    print(f"📍 Environment: {os.getenv('ENVIRONMENT', 'development')}")
    print(f"🗄️  Database: {os.getenv('DATABASE_URL', 'Not configured')[:60]}...")
    print(f"💳 Stripe: {'Configured' if os.getenv('STRIPE_SECRET_KEY') else 'Not configured'}")
    print(f"📧 Email (SES): {'Configured' if os.getenv('AWS_ACCESS_KEY_ID') else 'Not configured'}")
    print("-" * 80)
    print("🌐 Supported Applications:")
    print("   - DHG Master Site (dozierholdingsgroup.com)")
    print("   - Athlynx Platform (athlynx.ai)")
    print("   - Athlynx VIP (athlynxapp.vip)")
    print("   - Transfer Portal (transferportal.ai)")
    print("   - Diamond Grind (diamond-grind.ai)")
    print("=" * 80)

# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    print("=" * 80)
    print("👋 DHG UNIFIED PLATFORM API SHUTTING DOWN...")
    print("=" * 80)

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )
