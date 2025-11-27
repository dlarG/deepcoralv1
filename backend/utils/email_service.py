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
    
    def send_user_approval_notification(self, user_data):
        """Send notification to user about account approval"""
        subject = f"Welcome to {self.company_name} - Your Account Has Been Approved! 🎉"
        html_content = self._get_user_approval_template(user_data)
        return self.send_email([user_data['email']], subject, html_content)

    def send_user_rejection_notification(self, user_data, rejection_reason=None):
        """Send notification to user about account rejection"""
        subject = f"Update on Your {self.company_name} Application"
        html_content = self._get_user_rejection_template(user_data, rejection_reason)
        return self.send_email([user_data['email']], subject, html_content)

    def _get_user_approval_template(self, user_data):
        """Generate HTML template for user approval notification"""
        approval_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Account Approved - Welcome to {self.company_name}</title>
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
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }}
                .success-icon {{
                    font-size: 48px;
                    margin-bottom: 15px;
                    display: block;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .welcome-message {{
                    background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    border-left: 5px solid #10b981;
                    text-align: center;
                }}
                .user-details {{
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }}
                .detail-row {{
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }}
                .detail-row:last-child {{
                    border-bottom: none;
                }}
                .label {{
                    font-weight: 600;
                    color: #374151;
                }}
                .value {{
                    color: #6b7280;
                    font-weight: 500;
                }}
                .action-button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    text-decoration: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    text-align: center;
                    margin: 20px auto;
                    display: block;
                    max-width: 250px;
                    transition: all 0.3s ease;
                }}
                .action-button:hover {{
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
                }}
                .feature-list {{
                    background: #f0f9ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                }}
                .feature-item {{
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                    color: #374151;
                }}
                .feature-icon {{
                    color: #10b981;
                    margin-right: 12px;
                    font-weight: bold;
                }}
                .footer {{
                    background: #f3f4f6;
                    padding: 25px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .social-links {{
                    margin: 15px 0;
                }}
                .social-link {{
                    display: inline-block;
                    margin: 0 10px;
                    color: #059669;
                    text-decoration: none;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <span class="success-icon">🎉</span>
                    <h1>Welcome to {self.company_name}!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Your account has been approved!</p>
                </div>
                
                <div class="content">
                    <div class="welcome-message">
                        <h2 style="color: #059669; margin-top: 0;">🌊 Congratulations, {user_data.get('firstname', '')}!</h2>
                        <p style="font-size: 16px; margin-bottom: 0;">
                            Your application to join {self.company_name} has been <strong>approved</strong>! 
                            You now have access to our coral reef conservation platform.
                        </p>
                    </div>
                    
                    <h3 style="color: #374151;">📋 Your Account Details</h3>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="label">Full Name:</span>
                            <span class="value">{user_data.get('firstname', '')} {user_data.get('lastname', '')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Username:</span>
                            <span class="value">@{user_data.get('username', '')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Email:</span>
                            <span class="value">{user_data.get('email', '')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Approved On:</span>
                            <span class="value">{approval_time}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Status:</span>
                            <span class="value" style="color: #10b981; font-weight: 700;">✅ Active</span>
                        </div>
                    </div>
                    
                    <a href="{self.company_website}/login" class="action-button">
                        🚀 Login to Your Account
                    </a>
                    
                    <div class="feature-list">
                        <h3 style="color: #0369a1; margin-top: 0;">🐠 What You Can Do Now:</h3>
                        <div class="feature-item">
                            <span class="feature-icon">📸</span>
                            Upload and analyze coral reef images
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🌐</span>
                            Collaborate with marine conservation community
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">📚</span>
                            Access comprehensive coral database
                        </div>
                        <div class="feature-item">
                            <span class="feature-icon">🗺️</span>
                            Map and track coral reef locations
                        </div>
                    </div>
                    
                    <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #92400e; margin-top: 0;">🔐 Getting Started</h4>
                        <p style="color: #92400e; margin-bottom: 0;">
                            You can now log in using your username (<strong>@{user_data.get('username', '')}</strong>) 
                            and the password you created during registration.
                        </p>
                    </div>
                    
                    <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                        Thank you for joining our mission to protect and preserve coral reefs worldwide! 🪸
                    </p>
                </div>
                
                <div class="footer">
                    <p><strong>{self.company_name}</strong> - Marine Conservation Technology</p>
                    <div class="social-links">
                        <a href="{self.company_website}" class="social-link">🌐 Website</a>
                        <a href="mailto:{self.support_email}" class="social-link">📧 Support</a>
                    </div>
                    <p>
                        Need help getting started? Contact us at 
                        <a href="mailto:{self.support_email}" style="color: #059669;">{self.support_email}</a>
                    </p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                        © {datetime.now().year} {self.company_name}. All rights reserved.
                        <br>
                        This email confirms your account approval.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_template

    def _get_user_rejection_template(self, user_data, rejection_reason=None):
        """Generate HTML template for user rejection notification"""
        rejection_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Application Update - {self.company_name}</title>
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
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .message-box {{
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                    border-left: 4px solid #ef4444;
                }}
                .user-details {{
                    background: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 20px 0;
                }}
                .detail-row {{
                    display: flex;
                    justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid #e5e7eb;
                }}
                .detail-row:last-child {{
                    border-bottom: none;
                }}
                .label {{
                    font-weight: 600;
                    color: #374151;
                }}
                .value {{
                    color: #6b7280;
                }}
                .reapply-section {{
                    background: #f0f9ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                    text-align: center;
                }}
                .reapply-button {{
                    display: inline-block;
                    background: linear-gradient(135deg, #0ea5e9, #0284c7);
                    color: white;
                    text-decoration: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    font-weight: 600;
                    margin-top: 15px;
                }}
                .footer {{
                    background: #f3f4f6;
                    padding: 25px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Application Status Update</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9;">Regarding your {self.company_name} application</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #374151;">Hello {user_data.get('firstname', '')},</h2>
                    
                    <p>Thank you for your interest in joining {self.company_name}, our coral reef conservation platform.</p>
                    
                    <div class="message-box">
                        <h3 style="color: #dc2626; margin-top: 0;">Application Status: Not Approved</h3>
                        <p style="margin-bottom: 0;">
                            After careful review, we are unable to approve your application at this time.
                            {f"<br><br><strong>Reason:</strong> {rejection_reason}" if rejection_reason else ""}
                        </p>
                    </div>
                    
                    <h3>📋 Application Details</h3>
                    <div class="user-details">
                        <div class="detail-row">
                            <span class="label">Full Name:</span>
                            <span class="value">{user_data.get('firstname', '')} {user_data.get('lastname', '')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Username:</span>
                            <span class="value">@{user_data.get('username', '')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Email:</span>
                            <span class="value">{user_data.get('email', '')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Applied Role:</span>
                            <span class="value">{user_data.get('roletype', 'guest').title()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Reviewed On:</span>
                            <span class="value">{rejection_time}</span>
                        </div>
                    </div>
                    
                    <div class="reapply-section">
                        <h3 style="color: #0284c7; margin-top: 0;">🔄 Future Applications</h3>
                        <p>
                            You're welcome to reapply in the future. Please ensure that you meet all 
                            requirements and provide accurate information.
                        </p>
                        <a href="{self.company_website}/register" class="reapply-button">
                            Apply Again
                        </a>
                    </div>
                    
                    <div style="background: #fffbeb; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px; margin: 20px 0;">
                        <h4 style="color: #92400e; margin-top: 0;">📞 Questions?</h4>
                        <p style="color: #92400e; margin-bottom: 0;">
                            If you have questions about this decision or need clarification, 
                            please contact our support team at 
                            <a href="mailto:{self.support_email}" style="color: #92400e;">
                                {self.support_email}
                            </a>
                        </p>
                    </div>
                    
                    <p style="color: #6b7280;">
                        Thank you for your understanding and continued interest in marine conservation.
                    </p>
                </div>
                
                <div class="footer">
                    <p><strong>{self.company_name}</strong> - Marine Conservation Technology</p>
                    <p>
                        For questions, contact us at 
                        <a href="mailto:{self.support_email}" style="color: #0ea5e9;">{self.support_email}</a>
                        <br>
                        Visit: <a href="{self.company_website}" style="color: #0ea5e9;">{self.company_website}</a>
                    </p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                        © {datetime.now().year} {self.company_name}. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_template
    def send_password_reset_otp(self, user_data, otp_code, reset_token):
        """Send OTP for password reset"""
        subject = f"Password Reset Code - {self.company_name}"
        html_content = self._get_password_reset_template(user_data, otp_code, reset_token)
        return self.send_email([user_data['email']], subject, html_content)

    def send_password_reset_success(self, user_data):
        """Send confirmation that password was reset successfully"""
        subject = f"Password Reset Successful - {self.company_name}"
        html_content = self._get_password_reset_success_template(user_data)
        return self.send_email([user_data['email']], subject, html_content)

    def _get_password_reset_template(self, user_data, otp_code, reset_token):
        """Generate HTML template for password reset OTP"""
        reset_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - {self.company_name}</title>
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
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }}
                .lock-icon {{
                    font-size: 48px;
                    margin-bottom: 15px;
                    display: block;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .otp-container {{
                    background: linear-gradient(135deg, #fef3c7, #fde68a);
                    border-radius: 12px;
                    padding: 30px;
                    margin: 25px 0;
                    text-align: center;
                    border: 2px solid #f59e0b;
                }}
                .otp-code {{
                    font-size: 32px;
                    font-weight: 900;
                    letter-spacing: 8px;
                    color: #92400e;
                    background: white;
                    padding: 15px 30px;
                    border-radius: 8px;
                    display: inline-block;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    font-family: 'Courier New', monospace;
                    border: 2px dashed #f59e0b;
                    margin: 10px 0;
                }}
                .security-info {{
                    background: #fee2e2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                    border-left: 4px solid #ef4444;
                }}
                .instructions {{
                    background: #f0f9ff;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 25px 0;
                }}
                .step {{
                    display: flex;
                    align-items: flex-start;
                    margin: 15px 0;
                    padding: 10px 0;
                    border-bottom: 1px solid #e5e7eb;
                }}
                .step:last-child {{
                    border-bottom: none;
                }}
                .step-number {{
                    background: #0ea5e9;
                    color: white;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    margin-right: 15px;
                    flex-shrink: 0;
                }}
                .step-text {{
                    color: #374151;
                    flex-grow: 1;
                }}
                .footer {{
                    background: #f3f4f6;
                    padding: 25px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
                .expiry-warning {{
                    color: #dc2626;
                    font-weight: 600;
                    text-align: center;
                    margin: 15px 0;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <span class="lock-icon">🔐</span>
                    <h1>Password Reset Request</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Your verification code is ready</p>
                </div>
                
                <div class="content">
                    <h2 style="color: #374151;">Hello {user_data.get('firstname', 'User')},</h2>
                    
                    <p>We received a request to reset your password for your {self.company_name} account. Use the verification code below to proceed with your password reset.</p>
                    
                    <div class="otp-container">
                        <h3 style="color: #92400e; margin-top: 0;">🔢 Your Verification Code</h3>
                        <div class="otp-code">{otp_code}</div>
                        <p style="margin-bottom: 0; color: #92400e; font-size: 14px;">
                            Enter this 6-digit code on the password reset page
                        </p>
                    </div>
                    
                    <div class="expiry-warning">
                        ⏰ This code expires in 15 minutes for security purposes
                    </div>
                    
                    <div class="instructions">
                        <h3 style="color: #0369a1; margin-top: 0;">📋 How to Reset Your Password:</h3>
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-text">Return to the password reset page</div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-text">Enter the 6-digit verification code above</div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-text">Create your new secure password</div>
                        </div>
                        <div class="step">
                            <div class="step-number">4</div>
                            <div class="step-text">Log in with your new password</div>
                        </div>
                    </div>
                    
                    <div class="security-info">
                        <h4 style="color: #dc2626; margin-top: 0;">🚨 Security Notice</h4>
                        <ul style="color: #991b1b; margin-bottom: 0; padding-left: 20px;">
                            <li><strong>Didn't request this?</strong> Your account may be at risk. Change your password immediately.</li>
                            <li><strong>Keep this code private</strong> - Never share your verification code with anyone.</li>
                            <li><strong>Time-sensitive</strong> - This code expires in 15 minutes.</li>
                            <li><strong>One-time use</strong> - This code can only be used once.</li>
                        </ul>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <p style="color: #6b7280; font-size: 14px;">
                            <strong>Request Details:</strong><br>
                            Time: {reset_time}<br>
                            IP Address: {user_data.get('ip_address', 'Unknown')}<br>
                            If this wasn't you, please contact support immediately.
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>{self.company_name}</strong> - Marine Conservation Technology</p>
                    <p>
                        For security questions, contact us at 
                        <a href="mailto:{self.support_email}" style="color: #f59e0b;">{self.support_email}</a>
                    </p>
                    <p style="margin-top: 15px; font-size: 12px; opacity: 0.7;">
                        © {datetime.now().year} {self.company_name}. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_template

    def _get_password_reset_success_template(self, user_data):
        """Generate HTML template for successful password reset"""
        reset_time = datetime.now().strftime("%B %d, %Y at %I:%M %p")
        
        html_template = f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset Successful - {self.company_name}</title>
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
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                }}
                .success-icon {{
                    font-size: 48px;
                    margin-bottom: 15px;
                    display: block;
                }}
                .content {{
                    padding: 40px 30px;
                }}
                .success-message {{
                    background: linear-gradient(135deg, #ecfdf5, #f0fdf4);
                    border-radius: 12px;
                    padding: 25px;
                    margin: 25px 0;
                    border-left: 5px solid #10b981;
                    text-align: center;
                }}
                .footer {{
                    background: #f3f4f6;
                    padding: 25px;
                    text-align: center;
                    color: #6b7280;
                    font-size: 14px;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <span class="success-icon">✅</span>
                    <h1>Password Reset Successful!</h1>
                    <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">Your account is now secure</p>
                </div>
                
                <div class="content">
                    <div class="success-message">
                        <h2 style="color: #059669; margin-top: 0;">🎉 All Set, {user_data.get('firstname', 'User')}!</h2>
                        <p style="font-size: 16px; margin-bottom: 0;">
                            Your password has been successfully reset. You can now log in to your {self.company_name} account with your new password.
                        </p>
                    </div>
                    
                    <p>Your password was changed on {reset_time}. If you did not make this change, please contact our support team immediately.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{self.company_website}/login" style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; text-decoration: none; padding: 15px 30px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                            🚀 Log In to Your Account
                        </a>
                    </div>
                </div>
                
                <div class="footer">
                    <p><strong>{self.company_name}</strong> - Marine Conservation Technology</p>
                    <p>© {datetime.now().year} {self.company_name}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        """
        return html_template

# Create a global instance
email_service = EmailService()