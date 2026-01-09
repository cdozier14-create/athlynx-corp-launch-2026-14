"""
ATHLYNX AI Platform - Python FastAPI Backend
Full-stack Python + Julia implementation
Deployed via Netlify → athlynx.ai → NEON PostgreSQL

@author ATHLYNX AI Corporation
@date January 9, 2026
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os
from datetime import datetime
import boto3
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Initialize FastAPI
app = FastAPI(
    title="ATHLYNX AI Platform",
    description="The Complete Athlete Ecosystem - Dreams Do Come True 2026",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://athlynx.ai", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Configuration - NEON PostgreSQL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://neondb_owner:npg_u3rLRXtnoc0J@ep-silent-bonus-ahftzrvu-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# AWS Configuration
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
aws_region = os.getenv("AWS_REGION", "us-east-1")

ses_client = boto3.client(
    'ses',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=aws_region
)

sns_client = boto3.client(
    'sns',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=aws_region
)

# Database Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(50))
    role = Column(String(50))  # athlete, parent, coach, brand
    sport = Column(String(100))
    vip_status = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class VIPCode(Base):
    __tablename__ = "vip_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text)
    max_uses = Column(Integer, default=1)
    current_uses = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VerificationCode(Base):
    __tablename__ = "verification_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    phone = Column(String(50))
    code = Column(String(6), nullable=False)
    is_verified = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    role: str
    sport: str
    vip_code: Optional[str] = None

class VerificationRequest(BaseModel):
    email: EmailStr
    phone: str

class VerificationCheckRequest(BaseModel):
    email: EmailStr
    code: str

# API Routes
@app.get("/")
def read_root():
    return {
        "message": "ATHLYNX AI Platform API",
        "version": "1.0.0",
        "status": "LIVE",
        "deployment": "Netlify → athlynx.ai → NEON PostgreSQL"
    }

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring"""
    try:
        # Test database connection
        db = SessionLocal()
        db.execute("SELECT 1")
        db.close()
        return {
            "status": "healthy",
            "database": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")

@app.post("/api/verification/send-code")
def send_verification_code(request: VerificationRequest, db: Session = Depends(get_db)):
    """Send verification code via email and SMS"""
    import random
    
    # Generate 6-digit code
    code = str(random.randint(100000, 999999))
    
    # Set expiration (10 minutes)
    from datetime import timedelta
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Save to database
    verification = VerificationCode(
        email=request.email,
        phone=request.phone,
        code=code,
        expires_at=expires_at
    )
    db.add(verification)
    db.commit()
    
    # Send via AWS SES (Email)
    try:
        ses_client.send_email(
            Source="noreply@athlynx.ai",
            Destination={"ToAddresses": [request.email]},
            Message={
                "Subject": {"Data": "Your ATHLYNX Verification Code"},
                "Body": {
                    "Html": {
                        "Data": f"""
                        <h2>Welcome to ATHLYNX!</h2>
                        <p>Your verification code is: <strong>{code}</strong></p>
                        <p>This code expires in 10 minutes.</p>
                        <p>Dreams Do Come True 2026!</p>
                        """
                    }
                }
            }
        )
    except Exception as e:
        print(f"Email send failed: {e}")
    
    # Send via AWS SNS (SMS)
    try:
        sns_client.publish(
            PhoneNumber=request.phone,
            Message=f"Your ATHLYNX verification code is: {code}. Expires in 10 minutes."
        )
    except Exception as e:
        print(f"SMS send failed: {e}")
    
    return {"success": True, "message": "Verification code sent"}

@app.post("/api/verification/verify-code")
def verify_code(request: VerificationCheckRequest, db: Session = Depends(get_db)):
    """Verify the code"""
    verification = db.query(VerificationCode).filter(
        VerificationCode.email == request.email,
        VerificationCode.code == request.code,
        VerificationCode.is_verified == False,
        VerificationCode.expires_at > datetime.utcnow()
    ).first()
    
    if not verification:
        raise HTTPException(status_code=400, detail="Invalid or expired code")
    
    # Mark as verified
    verification.is_verified = True
    db.commit()
    
    return {"success": True, "message": "Verification successful"}

@app.post("/api/signup")
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """Create new user account"""
    
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Validate VIP code if provided
    vip_status = False
    if request.vip_code:
        vip_code = db.query(VIPCode).filter(
            VIPCode.code == request.vip_code.upper(),
            VIPCode.is_active == True
        ).first()
        
        if vip_code and vip_code.current_uses < vip_code.max_uses:
            vip_status = True
            vip_code.current_uses += 1
            db.commit()
    
    # Create user
    user = User(
        name=request.name,
        email=request.email,
        phone=request.phone,
        role=request.role,
        sport=request.sport,
        vip_status=vip_status
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "success": True,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "vip_status": user.vip_status
        }
    }

@app.get("/api/users/count")
def get_user_count(db: Session = Depends(get_db)):
    """Get total user count"""
    count = db.query(User).count()
    return {"count": count}

@app.get("/api/vip-codes/{code}")
def validate_vip_code(code: str, db: Session = Depends(get_db)):
    """Validate VIP code"""
    vip_code = db.query(VIPCode).filter(
        VIPCode.code == code.upper(),
        VIPCode.is_active == True
    ).first()
    
    if not vip_code:
        raise HTTPException(status_code=404, detail="Invalid VIP code")
    
    if vip_code.current_uses >= vip_code.max_uses:
        raise HTTPException(status_code=400, detail="VIP code has reached maximum uses")
    
    return {
        "valid": True,
        "code": vip_code.code,
        "description": vip_code.description,
        "remaining_uses": vip_code.max_uses - vip_code.current_uses
    }

# CRM Dashboard Routes
@app.get("/api/crm/signups")
def get_crm_signups(db: Session = Depends(get_db)):
    """Get all signups for CRM dashboard"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return {
        "total": len(users),
        "users": [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
                "sport": user.sport,
                "vip_status": user.vip_status,
                "created_at": user.created_at.isoformat()
            }
            for user in users
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
