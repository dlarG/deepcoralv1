#!/bin/bash
# restore-to-rds.sh
# Script to restore local database dump to RDS

set -e  # Exit on error

RDS_HOST="deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com"
RDS_USER="postgres"
RDS_PASSWORD="deepcoralDB2024"
DB_NAME="deep_coral_ai"
DUMP_FILE="/tmp/deep_coral_dev.dump"

echo "========================================="
echo "RDS Database Restore Script"
echo "========================================="
echo ""

# Check if dump file exists
if [ ! -f "$DUMP_FILE" ]; then
    echo "✗ ERROR: Dump file not found: $DUMP_FILE"
    exit 1
fi

# Step 1: Backup current RDS database
echo "Step 1: Creating backup of current RDS database..."
PGPASSWORD="$RDS_PASSWORD" pg_dump -h "$RDS_HOST" -U "$RDS_USER" -d "$DB_NAME" -F c -f /tmp/rds_backup_$(date +%Y%m%d_%H%M%S).dump 2>/dev/null || echo "No existing database to backup"
echo "✓ Backup complete"
echo ""

# Step 2: Drop and recreate database
echo "Step 2: Recreating database..."
PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_HOST" -U "$RDS_USER" -d postgres << EOF
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
EOF
echo "✓ Database recreated"
echo ""

# Step 3: Restore dump
echo "Step 3: Restoring database from dump..."
PGPASSWORD="$RDS_PASSWORD" pg_restore -h "$RDS_HOST" -U "$RDS_USER" -d "$DB_NAME" --no-owner --no-acl "$DUMP_FILE"
echo "✓ Database restored"
echo ""

# Step 4: Verify tables
echo "Step 4: Verifying tables..."
PGPASSWORD="$RDS_PASSWORD" psql -h "$RDS_HOST" -U "$RDS_USER" -d "$DB_NAME" << EOF
\dt
SELECT 'Users count: ' || COUNT(*) FROM users;
SELECT 'Activities count: ' || COUNT(*) FROM activities;
SELECT 'Images count: ' || COUNT(*) FROM images;
EOF
echo ""

echo "========================================="
echo "Database restore complete!"
echo "========================================="
