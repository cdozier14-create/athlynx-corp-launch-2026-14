"""
ATHLYNX Verification Router - AWS SNS + SES
SMS and Email verification endpoints

@author ATHLYNX AI Corporation
@date January 8, 2026
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
import sys
import os

# Add parent directory and SDK to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
try:
    from sdk.python.athlynx.verification import send_verification_code as send_code_aws, send_sms, send_email
except ImportError:
    # Fallback if SDK not available
    print("⚠️  SDK verification module not found, using stubs")
    def send_sms(phone: str, code: str):
        print(f"SMS: {phone} - Code: {code}")
        return {"success": True, "message": "SMS sent (stub)"}
    def send_email(email: str, code: str):
        print(f"Email: {email} - Code: {code}")
        return {"success": True, "message": "Email sent (stub)"}
    def send_code_aws(email: str, phone: str, code: str):
        return send_email(email, code)

from database import save_verification_code, get_verification_code, mark_code_verified

router = APIRouter()

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
    
    - **email**: User's email address (required)
    - **phone**: User's phone number (optional, for SMS backup)
    - **type**: Verification type (signup, login, password_reset)
    """
    try:
        # Generate and send code via AWS
        result = send_code_aws(request.email, request.phone)
        
        # Save to database
        save_verification_code(
            email=request.email,
            phone=request.phone,
            code=result['code'],
            code_type=request.type
        )
        
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
    Same as send-code but with different endpoint for clarity
    """
    return await send_verification_code(request)

@router.get("/test-sms/{phone}/{code}")
async def test_sms(phone: str, code: str):
    """Test SMS sending (development only)"""
    result = send_sms(phone, code)
    return result

@router.get("/test-email/{email}/{code}")
async def test_email(email: str, code: str):
    """Test email sending (development only)"""
    result = send_email(email, code)
    return result
