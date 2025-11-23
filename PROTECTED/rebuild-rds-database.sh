#!/bin/bash
# rebuild-rds-database.sh
# Script to rebuild the RDS database with corrected schema

set -e  # Exit on error

RDS_HOST="deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com"
RDS_USER="postgres"
RDS_PASSWORD="deepcoralDB2024"
DB_NAME="deep_coral_ai"

echo "========================================="
echo "RDS Database Rebuild Script"
echo "========================================="
echo ""

# Step 1: Backup current database
echo "Step 1: Creating backup..."
PGPASSWORD="$RDS_PASSWORD" pg_dump -h "$RDS_HOST" -U "$RDS_USER" -d "$DB_NAME" -F c -f /tmp/backup_before_rebuild.dump
echo "✓ Backup created: /tmp/backup_before_rebuild.dump"
echo ""

# Step 2: Drop and recreate database
echo "Step 2: Dropping and recreating database..."
PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_HOST" -U "$RDS_USER" -d postgres << EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF
echo "✓ Database recreated"
echo ""

# Step 3: Import schema
echo "Step 3: Importing schema..."
if [ -f /tmp/schema.sql ]; then
    PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_HOST" -U "$RDS_USER" -d "$DB_NAME" -f /tmp/schema.sql
    echo "✓ Schema imported"
else
    echo "✗ ERROR: /tmp/schema.sql not found!"
    echo "Please upload it first: scp backend/schema.sql ec2-user@54.206.75.196:/tmp/"
    exit 1
fi
echo ""

# Step 4: Verify tables
echo "Step 4: Verifying tables..."
PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_HOST" -U "$RDS_USER" -d "$DB_NAME" -c "\dt"
echo ""

echo "========================================="
echo "Database rebuild complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Create admin user via registration endpoint"
echo "2. Or insert admin user manually via psql"
echo ""
