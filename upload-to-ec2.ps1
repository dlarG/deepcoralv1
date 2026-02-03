# DeepCoral AWS Deployment Helper
# Run this script from your local Windows machine to upload deployment scripts to EC2
#
# Usage: 
#   .\upload-to-ec2.ps1

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "DeepCoral - Upload to EC2" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
$currentPath = Get-Location
if (-not (Test-Path "backend\app.py")) {
    Write-Host "Error: Please run this script from the project root directory" -ForegroundColor Red
    Write-Host "Current directory: $currentPath" -ForegroundColor Yellow
    exit 1
}

# Get EC2 connection details
Write-Host "Enter EC2 connection details:" -ForegroundColor Yellow
$keyFile = Read-Host "SSH key file path (e.g., PROTECTED\aws-ec2.pem)"
$ec2Ip = Read-Host "EC2 Public IP address"
$ec2User = Read-Host "EC2 username (ec2-user for Amazon Linux, ubuntu for Ubuntu) [ec2-user]"

if ([string]::IsNullOrWhiteSpace($ec2User)) {
    $ec2User = "ec2-user"
}

# Verify key file exists
if (-not (Test-Path $keyFile)) {
    Write-Host "Error: Key file not found: $keyFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Connection Details:" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Key file: $keyFile" -ForegroundColor White
Write-Host "EC2 IP: $ec2Ip" -ForegroundColor White
Write-Host "EC2 User: $ec2User" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "Proceed with upload? (y/n)"
if ($confirm -ne "y") {
    Write-Host "Upload cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Uploading deployment scripts..." -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Create connection string
$sshConnection = "${ec2User}@${ec2Ip}"

# Upload setup scripts
$filesToUpload = @(
    "PROTECTED\setup-ec2-complete.sh",
    "PROTECTED\setup-rds-database.sh",
    "PROTECTED\redeploy-backend.sh"
)

$uploadSuccess = $true

foreach ($file in $filesToUpload) {
    if (Test-Path $file) {
        Write-Host "Uploading $(Split-Path $file -Leaf)..." -ForegroundColor Yellow
        
        # Use scp to upload
        $scpCommand = "scp -i `"$keyFile`" `"$file`" ${sshConnection}:~/"
        Invoke-Expression $scpCommand
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] $(Split-Path $file -Leaf)" -ForegroundColor Green
        } else {
            Write-Host "  [FAILED] $(Split-Path $file -Leaf)" -ForegroundColor Red
            $uploadSuccess = $false
        }
    } else {
        Write-Host "  [SKIP] $(Split-Path $file -Leaf) - File not found" -ForegroundColor Yellow
    }
}

Write-Host ""

if ($uploadSuccess) {
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "Upload Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Connect to EC2:" -ForegroundColor White
    Write-Host "   ssh -i `"$keyFile`" $sshConnection" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "2. Setup database:" -ForegroundColor White
    Write-Host "   chmod +x setup-rds-database.sh" -ForegroundColor Yellow
    Write-Host "   ./setup-rds-database.sh" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "3. Setup EC2:" -ForegroundColor White
    Write-Host "   chmod +x setup-ec2-complete.sh" -ForegroundColor Yellow
    Write-Host "   ./setup-ec2-complete.sh" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "4. For updates:" -ForegroundColor White
    Write-Host "   chmod +x redeploy-backend.sh" -ForegroundColor Yellow
    Write-Host "   ./redeploy-backend.sh" -ForegroundColor Yellow
    Write-Host ""
    
    # Ask if user wants to connect now
    $connectNow = Read-Host "Connect to EC2 now? (y/n)"
    if ($connectNow -eq "y") {
        Write-Host ""
        Write-Host "Connecting to EC2..." -ForegroundColor Cyan
        ssh -i $keyFile $sshConnection
    }
} else {
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host "Upload Failed!" -ForegroundColor Red
    Write-Host "=====================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Some files failed to upload. Please check:" -ForegroundColor Yellow
    Write-Host "1. EC2 IP address is correct" -ForegroundColor White
    Write-Host "2. SSH key file path is correct" -ForegroundColor White
    Write-Host "3. EC2 security group allows SSH from your IP" -ForegroundColor White
    Write-Host "4. EC2 instance is running" -ForegroundColor White
    Write-Host ""
    Write-Host "Try connecting manually:" -ForegroundColor Yellow
    Write-Host "ssh -i `"$keyFile`" $sshConnection" -ForegroundColor Cyan
    Write-Host ""
}
