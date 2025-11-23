# Script to export database from RDS via EC2

# Step 1: SSH into EC2 and export database
Write-Host "Connecting to EC2 to export database..." -ForegroundColor Green

$sshCommand = @"
ssh -i "PROTECTED/aws-ec2.pem" ec2-user@54.206.75.196 "PGPASSWORD='deepcoralDB2024' pg_dump -h deepcoral-db.czg86ycw4hsj.ap-southeast-2.rds.amazonaws.com -U postgres -d deep_coral_ai -F c -f /tmp/deep_coral_export.dump"
"@

Write-Host "Running: $sshCommand" -ForegroundColor Yellow
Invoke-Expression $sshCommand

# Step 2: Copy the dump file from EC2 to local machine
Write-Host "`nDownloading database dump from EC2..." -ForegroundColor Green
scp -i "PROTECTED/aws-ec2.pem" ec2-user@54.206.75.196:/tmp/deep_coral_export.dump ./PROTECTED/deep_coral_export.dump

Write-Host "`nDatabase export complete! File saved to: PROTECTED/deep_coral_export.dump" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Create local database: createdb -U postgres deep_coral_dev" -ForegroundColor White
Write-Host "2. Import the dump: pg_restore -U postgres -d deep_coral_dev PROTECTED/deep_coral_export.dump" -ForegroundColor White
