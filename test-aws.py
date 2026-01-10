#!/usr/bin/env python3
"""Test AWS SES email and SNS SMS"""

import boto3
import os
from datetime import datetime

# AWS Credentials
AWS_ACCESS_KEY_ID = "AKIAWLLNO5ITXIAJKYVP"
AWS_SECRET_ACCESS_KEY = "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"
AWS_REGION = "us-east-1"

# Test data
EMAIL = "cdozier14@dozierholdingsgroup.com.mx"
PHONE = "+16014985282"

def send_test_email():
    """Send test email via AWS SES"""
    print("📧 Sending test email via AWS SES...")
    
    ses = boto3.client(
        'ses',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    
    try:
        response = ses.send_email(
            Source='noreply@athlynx.ai',
            Destination={'ToAddresses': [EMAIL]},
            Message={
                'Subject': {
                    'Data': '🦁 ATHLYNX Test Email - System Working!',
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Html': {
                        'Data': f"""
                        <html>
                        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h1 style="color: #8B5CF6;">🦁 ATHLYNX AI Corporation</h1>
                            <h2>Test Email Successful!</h2>
                            <p>This is a test email from your ATHLYNX platform.</p>
                            <p><strong>Sent:</strong> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</p>
                            <p><strong>System Status:</strong> ✅ All systems operational</p>
                            <hr>
                            <p style="color: #666; font-size: 12px;">
                                ATHLYNX AI Corporation<br>
                                A Dozier Holdings Group Company<br>
                                Dreams Do Come True 2026! 🔥
                            </p>
                        </body>
                        </html>
                        """,
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        print(f"✅ Email sent! Message ID: {response['MessageId']}")
        return True
    except Exception as e:
        print(f"❌ Email failed: {e}")
        return False

def send_test_sms():
    """Send test SMS via AWS SNS"""
    print("\n📱 Sending test SMS via AWS SNS...")
    
    sns = boto3.client(
        'sns',
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION
    )
    
    try:
        response = sns.publish(
            PhoneNumber=PHONE,
            Message=f"🦁 ATHLYNX Test SMS - System Working! Sent at {datetime.now().strftime('%I:%M %p')}. Dreams Do Come True 2026!",
            MessageAttributes={
                'AWS.SNS.SMS.SMSType': {
                    'DataType': 'String',
                    'StringValue': 'Transactional'
                }
            }
        )
        print(f"✅ SMS sent! Message ID: {response['MessageId']}")
        return True
    except Exception as e:
        print(f"❌ SMS failed: {e}")
        return False

if __name__ == "__main__":
    print("🦁 ATHLYNX AWS TEST")
    print("=" * 50)
    print(f"Email: {EMAIL}")
    print(f"Phone: {PHONE}")
    print("=" * 50)
    
    email_success = send_test_email()
    sms_success = send_test_sms()
    
    print("\n" + "=" * 50)
    print("RESULTS:")
    print(f"📧 Email: {'✅ SUCCESS' if email_success else '❌ FAILED'}")
    print(f"📱 SMS: {'✅ SUCCESS' if sms_success else '❌ FAILED'}")
    print("=" * 50)
