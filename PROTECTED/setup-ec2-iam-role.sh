#!/bin/bash

# Script to attach IAM role to EC2 instance for Secrets Manager access
# Run this from your local machine with AWS CLI configured

echo "Setting up IAM role for EC2 Secrets Manager access..."

# Variables
ROLE_NAME="DeepCoralEC2SecretsManagerRole"
POLICY_NAME="DeepCoralSecretsManagerPolicy"
INSTANCE_PROFILE_NAME="deepcoral-production-xlarge"
INSTANCE_ID="i-07abd87bf54a7350e"  # Replace with your EC2 instance ID
REGION="ap-southeast-2"

# Create trust policy for EC2
cat > /tmp/ec2-trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ec2.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

# Create policy for Secrets Manager access (DB + SendGrid)
cat > /tmp/secrets-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": [
        "arn:aws:secretsmanager:ap-southeast-2:*:secret:prod/mydb/postgres-*",
        "arn:aws:secretsmanager:ap-southeast-2:*:secret:prod/sendgrid/apikey-*"
      ]
    }
  ]
}
EOF

echo "1. Creating IAM role..."
aws iam create-role \
  --role-name $ROLE_NAME \
  --assume-role-policy-document file:///tmp/ec2-trust-policy.json \
  --region $REGION

echo "2. Creating IAM policy..."
POLICY_ARN=$(aws iam create-policy \
  --policy-name $POLICY_NAME \
  --policy-document file:///tmp/secrets-policy.json \
  --region $REGION \
  --query 'Policy.Arn' \
  --output text)

echo "Policy ARN: $POLICY_ARN"

echo "3. Attaching policy to role..."
aws iam attach-role-policy \
  --role-name $ROLE_NAME \
  --policy-arn $POLICY_ARN \
  --region $REGION

echo "4. Creating instance profile..."
aws iam create-instance-profile \
  --instance-profile-name $INSTANCE_PROFILE_NAME \
  --region $REGION

echo "5. Adding role to instance profile..."
aws iam add-role-to-instance-profile \
  --instance-profile-name $INSTANCE_PROFILE_NAME \
  --role-name $ROLE_NAME \
  --region $REGION

echo "Waiting 10 seconds for IAM propagation..."
sleep 10

echo "6. Attaching instance profile to EC2..."
aws ec2 associate-iam-instance-profile \
  --instance-id $INSTANCE_ID \
  --iam-instance-profile Name=$INSTANCE_PROFILE_NAME \
  --region $REGION

echo ""
echo "✅ IAM role setup complete!"
echo ""
echo "Next steps:"
echo "1. SSH to your EC2 instance"
echo "2. Restart the backend service: sudo systemctl restart deepcoral-backend"
echo "3. Check logs: sudo journalctl -u deepcoral-backend -n 50"
echo ""
echo "The 'Unable to locate credentials' error should be gone!"

# Cleanup temp files
rm /tmp/ec2-trust-policy.json
rm /tmp/secrets-policy.json
