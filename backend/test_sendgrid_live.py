#!/usr/bin/env python3
"""
Test SendGrid API key retrieval and email sending
Run this on EC2 to verify SendGrid integration
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, '/home/ec2-user/deepcoralv1/backend')

print("=" * 60)
print("SendGrid API Key Test")
print("=" * 60)

# Test 1: Import and get API key
print("\n1. Testing AWS Secrets Manager retrieval...")
try:
    from aws_secrets import get_sendgrid_api_key
    api_key = get_sendgrid_api_key()
    
    if api_key:
        print(f"   ✅ API Key retrieved: {api_key[:10]}...{api_key[-10:]}")
        print(f"   ✅ Key length: {len(api_key)} characters")
    else:
        print("   ❌ API Key is None or empty")
        sys.exit(1)
except Exception as e:
    print(f"   ❌ Error retrieving API key: {e}")
    sys.exit(1)

# Test 2: Initialize SendGrid client
print("\n2. Testing SendGrid client initialization...")
try:
    from sendgrid import SendGridAPIClient
    sg = SendGridAPIClient(api_key=api_key)
    print("   ✅ SendGrid client initialized successfully")
except Exception as e:
    print(f"   ❌ Error initializing SendGrid: {e}")
    sys.exit(1)

# Test 3: Try to send a test email
print("\n3. Testing email send (to test address)...")
print("   Enter test email address (or press Enter to skip): ", end='')
test_email = input().strip()

if test_email:
    try:
        from sendgrid.helpers.mail import Mail
        
        message = Mail(
            from_email='noreply@em2602.deepcoral.site',
            to_emails=test_email,
            subject='DeepCoral SendGrid Test',
            html_content='<strong>This is a test email from DeepCoral backend.</strong><br>If you received this, SendGrid is working correctly!'
        )
        
        response = sg.send(message)
        print(f"   ✅ Email sent successfully!")
        print(f"   ✅ Status code: {response.status_code}")
        print(f"   ✅ Response body: {response.body}")
        print(f"   ✅ Response headers: {response.headers}")
        
    except Exception as e:
        print(f"   ❌ Error sending email: {e}")
        print(f"   ❌ Error type: {type(e).__name__}")
        if hasattr(e, 'status_code'):
            print(f"   ❌ Status code: {e.status_code}")
        if hasattr(e, 'body'):
            print(f"   ❌ Response body: {e.body}")
else:
    print("   ⏭️  Skipped email send test")

# Test 4: Check environment variables
print("\n4. Checking environment configuration...")
print(f"   FLASK_ENV: {os.getenv('FLASK_ENV', 'not set')}")
print(f"   USE_ENV_SENDGRID: {os.getenv('USE_ENV_SENDGRID', 'not set')}")
print(f"   SENDGRID_FROM_EMAIL: {os.getenv('SENDGRID_FROM_EMAIL', 'not set')}")

print("\n" + "=" * 60)
print("Test Complete!")
print("=" * 60)
