#!/bin/bash

# Script to create SendGrid API key secret in AWS Secrets Manager
# Run this from your local machine with AWS CLI configured

echo "=== Setting up SendGrid API Key in AWS Secrets Manager ==="
echo ""
echo "⚠️  IMPORTANT: You need to create a NEW SendGrid API key first!"
echo "   1. Go to: https://app.sendgrid.com/settings/api_keys"
echo "   2. Click 'Create API Key'"
echo "   3. Name it: 'DeepCoral-Production-API'"
echo "   4. Select 'Full Access' permissions"
echo "   5. Copy the API key (you won't see it again!)"
echo ""
read -p "Press Enter after you've created your new API key..."
echo ""
read -sp "Paste your NEW SendGrid API key: " SENDGRID_API_KEY
echo ""

if [ -z "$SENDGRID_API_KEY" ]; then
    echo "❌ Error: No API key provided"
    exit 1
fi

# Validate format (SendGrid keys start with "SG.")
if [[ ! "$SENDGRID_API_KEY" =~ ^SG\. ]]; then
    echo "⚠️  Warning: API key doesn't start with 'SG.' - are you sure this is correct?"
    read -p "Continue anyway? (y/n): " confirm
    if [[ "$confirm" != "y" ]]; then
        echo "Aborted."
        exit 1
    fi
fi

SECRET_NAME="prod/sendgrid/apikey"
REGION="ap-southeast-2"

echo ""
echo "Creating secret in AWS Secrets Manager..."

# Create the secret with JSON format
aws secretsmanager create-secret \
    --name "$SECRET_NAME" \
    --description "SendGrid API key for DeepCoral production email service" \
    --secret-string "{\"api_key\":\"$SENDGRID_API_KEY\"}" \
    --region "$REGION"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ SendGrid API key stored successfully in AWS Secrets Manager!"
    echo ""
    echo "Secret Details:"
    echo "  Name: $SECRET_NAME"
    echo "  Region: $REGION"
    echo ""
    echo "Next steps:"
    echo "  1. Update IAM role to allow Secrets Manager access"
    echo "  2. Deploy updated backend code to EC2"
    echo "  3. Test email functionality"
    echo ""
    echo "To update the secret later, use:"
    echo "  aws secretsmanager update-secret --secret-id $SECRET_NAME --secret-string '{\"api_key\":\"NEW_KEY\"}' --region $REGION"
else
    echo ""
    echo "❌ Failed to create secret. Check your AWS credentials and permissions."
    exit 1
fi

# Clear the variable from memory
unset SENDGRID_API_KEY
