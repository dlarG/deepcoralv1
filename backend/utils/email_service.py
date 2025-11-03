import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from datetime import datetime
import json
from flask import current_app

class EmailService:
    def __init__(self):
        self.api_key = os.getenv('SENDGRID_API_KEY')
        self.from_email = os.getenv('SENDGRID_FROM_EMAIL', 'noreply@deepcoral.com')
        self.from_name = os.getenv('SENDGRID_FROM_NAME', 'DeepCoral AI System')
        self.company_name = os.getenv('COMPANY_NAME', 'DeepCoral AI')
        self.company_website = os.getenv('COMPANY_WEBSITE', 'https://deepcoral.com')
        self.support_email = os.getenv('SUPPORT_EMAIL', 'support@deepcoral.com')
        
        if not self.api_key:
            current_app.logger.warning("SendGrid API key not configured")
            self.sg = None
        else:
            self.sg = SendGridAPIClient(api_key=self.api_key)
    
    def send_email(self, to_emails, subject, html_content, plain_content=None):
        """Send email using SendGrid"""
        if not self.sg:
            current_app.logger.error("SendGrid not configured, email not sent")
            return False
        
        try:
            # Ensure to_emails is a list
            if isinstance(to_emails, str):
                to_emails = [to_emails]
            
            from_email = Email(self.from_email, self.from_name)
            
            # Create the mail object
            mail = Mail(
                from_email=from_email,
                to_emails=to_emails,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content or self._html_to_text(html_content)
            )
            
            # Send the email
            response = self.sg.send(mail)
            current_app.logger.info(f"Email sent successfully. Status: {response.status_code}")
            return True
            
        except Exception as e:
            current_app.logger.error(f"Error sending email: {str(e)}")
            return False
    
    def _html_to_text(self, html_content):
        """Convert HTML to plain text (simple version)"""
        import re
        # Remove HTML tags
        text = re.sub('<[^<]+?>', '', html_content)
        # Replace HTML entities
        text = text.replace('&nbsp;', ' ')
        text = text.replace('&amp;', '&')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        return text.strip()
    
    def send_new_user_registration_notification(self, user_data, admin_emails):
        """Send notification to admins about new user registration"""
        subject = os.getenv('ADMIN_NOTIFICATION_SUBJECT', 'New User Registration - DeepCoral AI')
        
        # Create HTML email template
        html_content = self._get_new_user_template(user_data)
        
        return self.send_email(admin_emails, subject, html_content)
    def check_sendgrid_status(self):
        if not self.sg:
            return "SendGrid not initialized"
        
        try:
            # Test API key validity
            response = self.sg.client.api_keys._(self.api_key).get()
            return f"API Key valid: {response.status_code}"
        except Exception as e:
            return f"API Key invalid: {str(e)}"
        

    def _get_new_user_template(self, user_data):
        """Generate HTML template for new user registration"""
        registration_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New User Registration</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }}
                .email-container {{
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }}
                .header {{
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }}
                .content {{
                    padding: 30px;
                }}
                .user-info {{
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #0ea5e9;
                }}
                .info-row {{
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }}
                .info-row:last-child {{
                    border-bottom: none;
                }}
                .label {{
                    font-weight: 600;
                    color: #374151;
                }}
                .value {{
                    color: #6b7280;
                }}
                .action-buttons {{
                    text-align: center;
                    margin: 30px 0;
                }}
                .btn {{
                    display: inline-block;
                    padding: 12px 24px;
                    margin: 0 10px;
                    border-radius: 6px;
                    text-decoration: none;
                    font-weight: 600;
                    text-align: center;
                    transition: all 0.3s ease;
                }}
                .btn-approve {{
                    background: #10b981;
                    color: white;
                }}
                .btn-review {{
                    background: #0ea5e9;
                    color: white;
                }}
                .btn:hover {{
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }}
                .footer {{
                    background: #f3f4f6;
                    padding: 20px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .alert {{
                    background: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 6px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #92400e;
                }}
                .coral-icon {{
                    font-size: 32px;
                    margin-bottom: 10px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>{self.company_name}</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">New User Registration Notification</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #0ea5e9; margin-top: 0;">New User Wants to Join!</h2>
                    
                    <p>A new user has registered and is waiting for approval to access the {self.company_name} system.</p>
                    
                    <div class="alert">
                        <strong>⚠️ Action Required:</strong> This user account is pending approval and requires admin review.
                    </div>
                    
                    <div class="user-info">
                        <h3 style="margin-top: 0; color: #374151;">👤 User Information</h3>
                        <div class="info-row">
                            <span class="label">Full Name:</span>
                            <span class="value">{user_data.get('firstname', 'N/A')} {user_data.get('lastname', 'N/A')}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Username:</span>
                            <span class="value">@{user_data.get('username', 'N/A')}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Email Address:</span>
                            <span class="value">{user_data.get('email', 'N/A')}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Role Requested:</span>
                            <span class="value">{user_data.get('roletype', 'guest').title()}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Registration Date:</span>
                            <span class="value">{registration_time}</span>
                        </div>
                        <div class="info-row">
                            <span class="label">Status:</span>
                            <span class="value" style="color: #f59e0b; font-weight: 600;">⏳ Pending Approval</span>
                        </div>
                        <div class="info-row">
                            <span class="label">IP Address:</span>
                            <span class="value">{user_data.get('ip_address', 'N/A')}</span>
                        </div>
                    </div>
                    
                    <div class="action-buttons">
                        <a href="localhost/admin-dashboard" class="btn btn-review">
                            📋 Review in Admin Panel
                        </a>
                        <a href="localhost/admin-dashboard" class="btn btn-approve">
                            ✅ Manage Users
                        </a>
                    </div>
                    
                    <div style="background: #f0f9ff; border-radius: 6px; padding: 15px; margin: 20px 0;">
                        <h4 style="margin-top: 0; color: #0284c7;">📊 What's Next?</h4>
                        <ul style="margin: 10px 0; padding-left: 20px; color: #374151;">
                            <li>Review the user's information carefully</li>
                            <li>Verify their email address and credentials</li>
                            <li>Approve or reject their access request</li>
                            <li>The user will be notified of your decision</li>
                        </ul>
                    </div>
                    
                    <p style="color: #6b7280; font-size: 14px; margin-bottom: 0;">
                        This is an automated notification from {self.company_name}. 
                        Please log in to your admin dashboard to take action on this registration request.
                    </p>
                </div>
                
                <div class="footer">
                    <p><strong>{self.company_name}</strong> - Marine Conservation Technology</p>
                    <p>
                        Need help? Contact us at <a href="mailto:{self.support_email}" style="color: #0ea5e9;">{self.support_email}</a>
                        <br>
                        Visit: <a href="{self.company_website}" style="color: #0ea5e9;">{self.company_website}</a>
                    </p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                        © {datetime.now().year} {self.company_name}. All rights reserved.
                        <br>
                        This email was sent to notify you of a new user registration.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return html_template

# Create a global instance
email_service = EmailService()