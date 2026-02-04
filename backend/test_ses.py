#!/usr/bin/env python3
"""
Test AWS SES email functionality
Run this to verify SES integration
"""

import sys
import os
from dotenv import load_dotenv
import boto3
from botocore.exceptions import ClientError

# Load environment variables
load_dotenv('.env.production')

def test_ses():
    """Test AWS SES configuration and send a test email"""
    
    print("=" * 60)
    print("AWS SES Test")
    print("=" * 60)
    
    # Get configuration
    region = os.getenv('AWS_REGION', 'ap-southeast-2')
    from_email = os.getenv('SES_FROM_EMAIL', 'noreply@deepcoral.site')
    
    print(f"\n📧 SES Configuration:")
    print(f"   Region: {region}")
    print(f"   From Email: {from_email}")
    
    # Test 1: Initialize SES client
    print("\n1. Testing SES client initialization...")
    try:
        ses_client = boto3.client('ses', region_name=region)
        print("   ✅ SES client initialized successfully")
    except Exception as e:
        print(f"   ❌ Error initializing SES: {e}")
        return False
    
    # Test 2: Check verified email addresses
    print("\n2. Checking verified email addresses...")
    try:
        response = ses_client.list_verified_email_addresses()
        verified_emails = response.get('VerifiedEmailAddresses', [])
        
        if verified_emails:
            print(f"   ✅ Found {len(verified_emails)} verified email(s):")
            for email in verified_emails:
                print(f"      - {email}")
        else:
            print("   ⚠️  No verified email addresses found!")
            print("   📝 To verify an email, run:")
            print(f"      aws ses verify-email-identity --email-address your@email.com --region {region}")
            return False
            
    except Exception as e:
        print(f"   ❌ Error checking verified emails: {e}")
        return False
    
    # Test 3: Send test email
    print("\n3. Testing email send...")
    print("   💡 In sandbox mode, you can only send to verified email addresses")
    print(f"   💡 Verified emails: {', '.join(verified_emails)}")
    print("\n   Enter recipient email (must be verified, or press Enter to skip): ", end='')
    to_email = input().strip()
    
    if not to_email:
        print("   ⏭️  Skipped email send test")
        return True
    
    if to_email not in verified_emails:
        print(f"   ⚠️  WARNING: {to_email} is not verified!")
        print("   ⚠️  This will fail in sandbox mode.")
        print("   Continue anyway? (y/n): ", end='')
        if input().strip().lower() != 'y':
            return True
    
    try:
        response = ses_client.send_email(
            Source=from_email,
            Destination={'ToAddresses': [to_email]},
            Message={
                'Subject': {
                    'Data': 'DeepCoral AWS SES Test',
                    'Charset': 'UTF-8'
                },
                'Body': {
                    'Html': {
                        'Data': '''
                            <html>
                                <body style="font-family: Arial, sans-serif; padding: 20px;">
                                    <h2>🧪 AWS SES Test Email</h2>
                                    <p>This is a test email from your DeepCoral AI application.</p>
                                    <p><strong>From:</strong> {}</p>
                                    <p><strong>To:</strong> {}</p>
                                    <p><strong>Status:</strong> ✅ AWS SES is working correctly!</p>
                                    <hr>
                                    <p style="color: #666; font-size: 12px;">
                                        Sent from DeepCoral AI System<br>
                                        https://deepcoral.site
                                    </p>
                                </body>
                            </html>
                        '''.format(from_email, to_email),
                        'Charset': 'UTF-8'
                    }
                }
            }
        )
        
        message_id = response.get('MessageId')
        print(f"   ✅ Email sent successfully!")
        print(f"   ✅ Message ID: {message_id}")
        print(f"\n   📬 Check your inbox at: {to_email}")
        print("   💡 Email may take a few minutes to arrive")
        print("   💡 Check spam folder if you don't see it")
        return True
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        error_msg = e.response['Error']['Message']
        print(f"   ❌ Error sending email: {error_code}")
        print(f"   ❌ Message: {error_msg}")
        
        if 'not verified' in error_msg.lower():
            print(f"\n   📝 To verify {to_email}, run:")
            print(f"      aws ses verify-email-identity --email-address {to_email} --region {region}")
        
        return False
    except Exception as e:
        print(f"   ❌ Unexpected error: {e}")
        return False

if __name__ == "__main__":
    print("\n💡 AWS SES Sandbox Mode Info:")
    print("   - Can only send to verified email addresses")
    print("   - Can only send from verified email addresses")
    print("   - Limited to 200 emails per day")
    print("   - Request production access to remove these limits\n")
    
    success = test_ses()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ SES Test Complete!")
    else:
        print("❌ SES Test Failed")
    print("=" * 60)
    
    sys.exit(0 if success else 1)
