# Core arkenfox prefs.js cleanup logic natively in PowerShell
$userJsPath  = Join-Path $PSScriptRoot "user.js"
$prefsJsPath = Join-Path $PSScriptRoot "prefs.js"

if (-not (Test-Path $userJsPath)) {
    Write-Error "user.js not found in the current directory."
    Start-Sleep -Seconds 5; exit
}
if (-not (Test-Path $prefsJsPath)) {
    Write-Error "prefs.js not found in the current directory."
    Start-Sleep -Seconds 5; exit
}

# 1. Check if Firefox is running
$ffProcesses = Get-Process -Name "firefox" -ErrorAction SilentlyContinue
if ($ffProcesses) {
    Write-Warning "Firefox is still running! Please save your work and close Firefox."
    Read-Host "Press ENTER to continue anyway once Firefox is closed"
}

# 2. Backup prefs.js
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$backupPath = Join-Path $PSScriptRoot "prefs-backup-$timestamp.js"
Write-Host "Backing up prefs.js to $backupPath..." -ForegroundColor Cyan
Copy-Item $prefsJsPath $backupPath -Force

# Define UTF8 without BOM to use for safely reading AND writing files
$utf8NoBom = [System.Text.UTF8Encoding]::new($false)

# 3. Read and map active rules inside user.js
Write-Host "Analyzing user.js configuration patterns..." -ForegroundColor Cyan
$userPrefs = @{}
# Fixed: Read as UTF8 natively to prevent character corruption
$userJsContent = [System.IO.File]::ReadAllText($userJsPath, $utf8NoBom)

# Extracts preference keys matching user_pref("preference.name", ...);
[regex]::Matches($userJsContent, '(?m)^[^"'']*user_pref\s*\(\s*["'']([^"'']+)["'']\s*,') | ForEach-Object {
    $userPrefs[$_.Groups[1].Value] = $true
}

# 4. Filter prefs.js without line length limitations
Write-Host "Cleaning prefs.js entries..." -ForegroundColor Cyan
# Fixed: Read as UTF8 natively to prevent character corruption
$prefsJsLines = [System.IO.File]::ReadAllLines($prefsJsPath, $utf8NoBom)
$cleanedLines = [System.Collections.Generic.List[string]]::new()

foreach ($line in $prefsJsLines) {
    if ($line -match '^\s*user_pref\s*\(\s*["'']([^"'']+)["'']') {
        $prefKey = $Matches[1]
        # Only keep the preference line if it does NOT exist in user.js
        if (-not $userPrefs.ContainsKey($prefKey)) {
            $cleanedLines.Add($line)
        }
    } else {
        # Keep empty lines or comments
        $cleanedLines.Add($line)
    }
}

# 5. Output back cleanly into prefs.js
[System.IO.File]::WriteAllLines($prefsJsPath, $cleanedLines, $utf8NoBom)

Write-Host "All done! Script completed successfully." -ForegroundColor Green
Start-Sleep -Seconds 5