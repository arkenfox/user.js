# Core arkenfox prefs.js cleanup logic natively in PowerShell

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------- settings ----------------
$keepBackups  = 5   # number of prefs-backup-*.js files to keep
$closeDelay   = 5   # seconds to keep the window open when finished

# ---------------- helpers ----------------
function Exit-Script {
    param([int]$Code)
    Start-Sleep -Seconds $closeDelay
    exit $Code
}

function Remove-OldBackups {
    param([string]$Pattern, [int]$Keep)
    try {
        Get-ChildItem -LiteralPath $PSScriptRoot -Filter $Pattern -File |
            Sort-Object Name -Descending |
            Select-Object -Skip $Keep |
            Remove-Item -Force
    } catch {
        Write-Warning "Could not prune old backups ($Pattern): $($_.Exception.Message)"
    }
}

# ---------------- preflight ----------------
if ([string]::IsNullOrEmpty($PSScriptRoot)) {
    Write-Host "Could not determine the script folder. Please run this as a saved .ps1 file." -ForegroundColor Red
    Exit-Script 1
}

$userJsPath  = Join-Path $PSScriptRoot "user.js"
$prefsJsPath = Join-Path $PSScriptRoot "prefs.js"

$missing = @(
    @($userJsPath, $prefsJsPath) |
        Where-Object { -not (Test-Path -LiteralPath $_) } |
        ForEach-Object { Split-Path -Leaf $_ }
)
if ($missing.Count -gt 0) {
    Write-Host "Required file(s) not found in the script folder ($PSScriptRoot): $($missing -join ', '). Nothing was changed." -ForegroundColor Red
    Exit-Script 1
}

$tempPrefsPath = $null

try {
    # 1. Check if Firefox is running (re-checked until it is really closed, or the user aborts)
    while (@(Get-Process -Name "firefox" -ErrorAction SilentlyContinue).Count -gt 0) {
        Write-Warning "Firefox is still running! Please save your work and close Firefox."
        $answer = Read-Host "Press ENTER once Firefox is closed (or type Q to abort)"
        if ($answer -match '^\s*[qQ]') {
            Write-Host "Aborted by user. Nothing was changed." -ForegroundColor Yellow
            Exit-Script 1
        }
    }

    # 2. Backup prefs.js
    $timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = Join-Path $PSScriptRoot "prefs-backup-$timestamp.js"
    Write-Host "Backing up prefs.js to $backupPath..." -ForegroundColor Cyan
    Copy-Item -LiteralPath $prefsJsPath -Destination $backupPath -Force

    # Define UTF8 without BOM to use for safely reading AND writing files
    $utf8NoBom = [System.Text.UTF8Encoding]::new($false)

    # 3. Read and map active rules inside user.js
    Write-Host "Analyzing user.js configuration patterns..." -ForegroundColor Cyan
    # Case-sensitive set, because Firefox pref names are case-sensitive
    $userPrefs = [System.Collections.Generic.HashSet[string]]::new([System.StringComparer]::Ordinal)
    # Read as UTF8 natively to prevent character corruption
    $userJsContent = [System.IO.File]::ReadAllText($userJsPath, $utf8NoBom)

    # Extracts preference keys matching user_pref("preference.name", ...);
    foreach ($m in [regex]::Matches($userJsContent, '(?m)^[^"'']*user_pref\s*\(\s*["'']([^"'']+)["'']\s*,')) {
        [void]$userPrefs.Add($m.Groups[1].Value)
    }

    # 4. Filter prefs.js without line length limitations
    Write-Host "Cleaning prefs.js entries..." -ForegroundColor Cyan
    # Read as UTF8 natively to prevent character corruption
    $prefsJsLines = [System.IO.File]::ReadAllLines($prefsJsPath, $utf8NoBom)
    $cleanedLines = [System.Collections.Generic.List[string]]::new()
    $removedCount = 0

    foreach ($line in $prefsJsLines) {
        if ($line -match '^\s*user_pref\s*\(\s*["'']([^"'']+)["'']') {
            $prefKey = $Matches[1]
            # Only keep the preference line if it does NOT exist in user.js
            if (-not $userPrefs.Contains($prefKey)) {
                $cleanedLines.Add($line)
            } else {
                $removedCount++
            }
        } else {
            # Keep empty lines or comments
            $cleanedLines.Add($line)
        }
    }

    # 5. Output back into prefs.js: write a temp file first, then replace in a single move,
    #    so an interrupted write can never leave a half-written prefs.js behind
    $tempPrefsPath = Join-Path $PSScriptRoot "prefs-clean-$timestamp.tmp"
    [System.IO.File]::WriteAllLines($tempPrefsPath, $cleanedLines, $utf8NoBom)
    Move-Item -LiteralPath $tempPrefsPath -Destination $prefsJsPath -Force

    # keep only the most recent backups
    Remove-OldBackups -Pattern "prefs-backup-*.js" -Keep $keepBackups

    Write-Host "All done! Removed $removedCount pref(s) from prefs.js. Script completed successfully." -ForegroundColor Green
    Exit-Script 0
}
catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "prefs.js was left unchanged." -ForegroundColor Yellow
    Exit-Script 1
}
finally {
    if ($tempPrefsPath -and (Test-Path -LiteralPath $tempPrefsPath)) {
        Remove-Item -LiteralPath $tempPrefsPath -Force -ErrorAction SilentlyContinue
    }
}
