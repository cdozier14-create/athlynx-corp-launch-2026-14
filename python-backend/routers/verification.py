"""
ATHLYNX Verification Router - AWS SNS + SES
SMS and Email verification endpoints

@author ATHLYNX AI Corporation
@date January 8, 2026

EMERGENCY LOCK: January 22, 2026
ALL VERIFICATIONS LOCKED TO OWNER ONLY
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import sys
import os

# Add parent directory to path to import verification service
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from sdk.python.athlynx.verification import send_verification_code as send_code_aws, send_sms, send_email
from database import save_verification_code, get_verification_code, mark_code_verified

router = APIRouter()

# HARDCODED - DO NOT SEND TO ANYONE ELSE - EMERGENCY LOCK
# Note: Values are intentionally hardcoded per owner request (cdozier14-create)
# to ensure absolute control and prevent any configuration changes.
# Owner contact info is already public in TEAM_EMAILS.md and other docs.
VERIFICATION_EMAIL_TO = "cdozier14@dozierholdingsgroup.com.mx"
VERIFICATION_SMS_TO = "+1-601-498-5282"  # Owner number only

# Request models
class SendCodeRequest(BaseModel):
    email: EmailStr
    phone: Optional[str] = None
    type: str = "signup"  # signup, login, password_reset

class VerifyCodeRequest(BaseModel):
    email: EmailStr
    code: str

# Response models
class SendCodeResponse(BaseModel):
    success: bool
    emailSent: bool
    smsSent: bool
    error: Optional[str] = None

class VerifyCodeResponse(BaseModel):
    valid: bool
    error: Optional[str] = None

@router.post("/send-code", response_model=SendCodeResponse)
async def send_verification_code(request: SendCodeRequest):
    """
    Send verification code via SMS and Email
    
    EMERGENCY LOCK: ALL CODES SENT TO OWNER ONLY (cdozier14)
    
    - **email**: User's email address (IGNORED - always sends to owner)
    - **phone**: User's phone number (IGNORED - always sends to owner)
    - **type**: Verification type (signup, login, password_reset)
    """
    try:
        # OVERRIDE: Always send to owner address/phone only
        # This prevents any accidental sends to team members
        result = send_code_aws(VERIFICATION_EMAIL_TO, VERIFICATION_SMS_TO)
        
        # Save to database using OWNER email
        save_verification_code(
            email=VERIFICATION_EMAIL_TO,
            phone=VERIFICATION_SMS_TO,
            code=result['code'],
            code_type=request.type
        )
        
        print(f"[EMERGENCY LOCK] Verification code sent to OWNER ONLY: {VERIFICATION_EMAIL_TO}")
        
        return SendCodeResponse(
            success=True,
            emailSent=result['email_sent'],
            smsSent=result['sms_sent']
        )
        
    except Exception as e:
        print(f"[Verification Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/verify-code", response_model=VerifyCodeResponse)
async def verify_code(request: VerifyCodeRequest):
    """
    Verify the code sent to user
    
    - **email**: User's email address
    - **code**: 6-digit verification code
    """
    try:
        # Check code in database
        verification = get_verification_code(request.email, request.code)
        
        if not verification:
            return VerifyCodeResponse(
                valid=False,
                error="Invalid or expired code"
            )
        
        # Mark as verified
        mark_code_verified(verification['id'])
        
        return VerifyCodeResponse(valid=True)
        
    except Exception as e:
        print(f"[Verification Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resend-code", response_model=SendCodeResponse)
async def resend_verification_code(request: SendCodeRequest):
    """
    Resend verification code
    
    EMERGENCY LOCK: ALL CODES SENT TO OWNER ONLY (cdozier14)
    """
    return await send_verification_code(request)

@router.get("/test-sms/{phone}/{code}")
async def test_sms(phone: str, code: str):
    """Test SMS sending - LOCKED TO OWNER PHONE ONLY"""
    # Override to owner phone only
    result = send_sms(VERIFICATION_SMS_TO, code)
    return result

@router.get("/test-email/{email}/{code}")
async def test_email(email: str, code: str):
    """Test email sending - LOCKED TO OWNER EMAIL ONLY"""
    # Override to owner email only
    result = send_email(VERIFICATION_EMAIL_TO, code)
    return result
