"""
ATHLYNX Verification Service - Twilio SMS + AWS SES
Python Implementation for SMS and Email Verification

@author ATHLYNX AI Corporation
@date January 22, 2026
"""

import boto3
import os
import random
from typing import Dict, Optional
from datetime import datetime, timedelta

# AWS SES Configuration
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_SES_FROM_EMAIL = os.getenv('AWS_SES_FROM_EMAIL', 'noreply@dozierholdingsgroup.com')

# Twilio Configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_FROM_NUMBER = os.getenv('TWILIO_FROM_NUMBER', '+18774618601')

# Initialize AWS SES client
ses_client = boto3.client(
    'ses',
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY
)

# Initialize Twilio client
try:
    from twilio.rest import Client as TwilioClient
    twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN) if TWILIO_AUTH_TOKEN else None
except ImportError:
    print("[Warning] Twilio not installed. SMS functionality disabled.")
    twilio_client = None


def generate_code() -> str:
    """Generate 6-digit verification code"""
    return str(random.randint(100000, 999999))


def send_sms(phone: str, code: str) -> Dict[str, any]:
    """
    Send SMS verification code via Twilio
    
    Args:
        phone: Phone number (with or without +1)
        code: 6-digit verification code
        
    Returns:
        Dict with success status and optional error message
    """
    if not twilio_client:
        print("[Twilio Error] Twilio client not initialized")
        return {'success': False, 'error': 'SMS service not configured'}
    
    try:
        # Format phone number
        formatted_phone = phone if phone.startswith('+') else f"+1{phone.replace('-', '').replace(' ', '').replace('(', '').replace(')', '')}"
        
        message = f"Your ATHLYNX verification code is: {code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this message."
        
        result = twilio_client.messages.create(
            from_=TWILIO_FROM_NUMBER,
            to=formatted_phone,
            body=message
        )
        
        print(f"[Twilio] SMS sent to {formatted_phone} - SID: {result.sid}")
        return {'success': True, 'message_id': result.sid}
        
    except Exception as e:
        print(f"[Twilio Error] {str(e)}")
        return {'success': False, 'error': str(e)}


def send_email(email: str, code: str) -> Dict[str, any]:
    """
    Send email verification code via AWS SES
    
    Args:
        email: Email address
        code: 6-digit verification code
        
    Returns:
        Dict with success status and optional error message
    """
    try:
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">ATHLYNX</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">The Perfect Storm</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1e3a8a; margin: 0 0 20px 0; font-size: 24px;">Verification Code</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Your ATHLYNX verification code is:
              </p>
              <div style="background-color: #f3f4f6; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 30px 0;">
                <span style="font-size: 36px; font-weight: bold; color: #1e3a8a; letter-spacing: 8px;">{code}</span>
              </div>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                This code expires in <strong>10 minutes</strong>.
              </p>
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
                If you didn't request this code, please ignore this email.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0 0 10px 0;">
                © 2026 ATHLYNX AI Corporation. All rights reserved.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                A Dozier Holdings Group Company
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        """
        
        text_body = f"Your ATHLYNX verification code is: {code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, please ignore this email.\n\n© 2026 ATHLYNX AI Corporation. All rights reserved.\nA Dozier Holdings Group Company"
        
        response = ses_client.send_email(
            Source=AWS_SES_FROM_EMAIL,
            Destination={'ToAddresses': [email]},
            Message={
                'Subject': {'Data': 'ATHLYNX Verification Code', 'Charset': 'UTF-8'},
                'Body': {
                    'Html': {'Data': html_body, 'Charset': 'UTF-8'},
                    'Text': {'Data': text_body, 'Charset': 'UTF-8'}
                }
            }
        )
        
        print(f"[AWS SES] Email sent to {email} - MessageId: {response['MessageId']}")
        return {'success': True, 'message_id': response['MessageId']}
        
    except Exception as e:
        print(f"[AWS SES Error] {str(e)}")
        return {'success': False, 'error': str(e)}


def send_verification_code(email: str, phone: Optional[str] = None) -> Dict[str, any]:
    """
    Send verification code via both SMS and Email
    
    Args:
        email: Email address
        phone: Optional phone number
        
    Returns:
        Dict with success status and delivery details
    """
    code = generate_code()
    
    # Send email (PRIMARY)
    email_result = send_email(email, code)
    
    # Send SMS (BACKUP) if phone provided
    sms_result = {'success': False}
    if phone:
        sms_result = send_sms(phone, code)
    
    return {
        'success': True,
        'code': code,  # In production, don't return this - store in database
        'email_sent': email_result['success'],
        'sms_sent': sms_result['success'],
        'expires_at': (datetime.now() + timedelta(minutes=10)).isoformat()
    }


# Test function
if __name__ == '__main__':
    # Test SMS
    print("Testing AWS SNS SMS...")
    sms_result = send_sms('+16014985282', '123456')
    print(f"SMS Result: {sms_result}")
    
    # Test Email
    print("\nTesting AWS SES Email...")
    email_result = send_email('cdozier14@dozierholdingsgroup.com.mx', '123456')
    print(f"Email Result: {email_result}")
    
    # Test full verification
    print("\nTesting Full Verification...")
    full_result = send_verification_code('cdozier14@dozierholdingsgroup.com.mx', '+16014985282')
    print(f"Full Result: {full_result}")
