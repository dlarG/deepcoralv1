# Script to replace all hardcoded localhost:5000 URLs with API_BASE_URL
$files = Get-ChildItem -Path ".\frontend\src" -Recurse -Filter "*.jsx" -File

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $updated = $false
    
    # Replace template literal URLs
    if ($content -match '`http://localhost:5000/') {
        $content = $content -replace '`http://localhost:5000/', '`${API_BASE_URL}/'
        $updated = $true
    }
    
    # Replace string URLs  
    if ($content -match '"http://localhost:5000/') {
        $content = $content -replace '"http://localhost:5000/', '`${API_BASE_URL}/'
        $updated = $true
    }
    
    # Replace baseURL definitions
    if ($content -match 'baseURL:\s*"http://localhost:5000"') {
        $content = $content -replace 'baseURL:\s*"http://localhost:5000"', 'baseURL: API_BASE_URL'
        $updated = $true
    }
    
    # Replace API_BASE_URL constant definitions
    if ($content -match 'API_BASE_URL\s*=\s*"http://localhost:5000"') {
        $content = $content -replace 'const\s+API_BASE_URL\s*=\s*"http://localhost:5000";?', ''
        # Add import if not present
        if ($content -notmatch 'import.*API_BASE_URL.*from.*config/api') {
            $content = $content -replace '(import\s+React[^\n]+)', "`$1`nimport { API_BASE_URL } from '../config/api';"
        }
        $updated = $true
    }
    
    if ($updated) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)"
    }
}

Write-Host "`nDone! Now checking remaining occurrences..."
Select-String -Path ".\frontend\src\**\*.jsx" -Pattern "http://localhost:5000" | Select-Object Path, LineNumber
