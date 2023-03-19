@ECHO OFF & SETLOCAL DisableDelayedExpansion
TITLE prefs.js cleaner

REM ### prefs.js cleaner for Windows
REM ## author: @claustromaniac
REM ## version: 2.7

CD /D "%~dp0"

IF /I "%~1"=="-unattended" (SET _ua=1)

:begin
ECHO:
ECHO:
ECHO                 ########################################
ECHO                 ####  prefs.js cleaner for Windows  ####
ECHO                 ####        by claustromaniac       ####
ECHO                 ####              v2.7              ####
ECHO                 ########################################
ECHO:
CALL :message "This script should be run from your Firefox profile directory."
ECHO   It will remove any entries from prefs.js that also exist in user.js.
CALL :message "This will allow inactive preferences to be reset to their default values."
ECHO   This Firefox profile shouldn't be in use during the process.
CALL :message ""
TIMEOUT 1 /nobreak >nul

IF NOT DEFINED _ua (
	CHOICE /C SHE /N /M "Start [S] Help [H] Exit [E]"
	CLS
	IF ERRORLEVEL 3 (EXIT /B)
	IF ERRORLEVEL 2 (GOTO :showhelp)
)
IF NOT EXIST "user.js" (CALL :abort "user.js not found in the current directory." 30)
IF NOT EXIST "prefs.js" (CALL :abort "prefs.js not found in the current directory." 30)
CALL :strlenCheck
CALL :FFcheck

CALL :message "Backing up prefs.js..."
FOR /F "delims=" %%# IN ('powershell get-date -format "{yyyyMMdd_HHmmss}"') DO @SET ldt=%%#
COPY /B /V /Y prefs.js "prefs-backup-%ldt%.js"

CALL :message "Cleaning prefs.js..."
CALL :cleanup
CALL :message "All done!"
TIMEOUT 5 >nul
ENDLOCAL
EXIT /B

REM ########## Abort Function ###########
:abort
CALL :message %1
TIMEOUT %~2 >nul
EXIT
REM ########## Message Function #########
:message
ECHO:
ECHO:  %~1
ECHO:
GOTO :EOF
REM ### string length Check Function ####
:strlenCheck
SET /a cnt=0
setlocal ENABLEDELAYEDEXPANSION
FOR /F "tokens=1,* delims=:" %%G IN ('FINDSTR /N "^" prefs.js') DO (
	ECHO:%%H >nul
	SET /a cnt += 1
	IF /I "%%G" NEQ "!cnt!" (
		ECHO:
		CALL :message "ERROR: line !cnt! in prefs.js is too long."
		(CALL :abort "Aborting ..." 30)
	)
)
endlocal
GOTO :EOF
REM ####### Firefox Check Function ######
:FFcheck
TASKLIST /FI "IMAGENAME eq firefox.exe" 2>NUL | FIND /I /N "firefox.exe">NUL
IF NOT ERRORLEVEL 1 (
	CLS
	CALL :message "Firefox is still running."
	ECHO   If you're not currently using this profile you can continue, otherwise
	CALL :message "close Firefox first!"
	ECHO:
	PAUSE
	CLS
	CALL :message "Resuming..."
	TIMEOUT 5 /nobreak >nul
)
GOTO :EOF
REM ######### Cleanup Function ##########
:cleanup
FOR /F tokens^=2^ delims^=^'^" %%G IN ('FINDSTR /R /C:"^[^\"']*user_pref[ 	]*\([ 	]*[\"'][^\"']*[\"'][ 	]*," user.js') DO (
	IF NOT ""=="%%G" (SET "[%%G]=1")
)
(
	FOR /F "tokens=1,* delims=:" %%G IN ('FINDSTR /N "^" prefs.js') DO (
		IF ""=="%%H" (
			ECHO:
		) ELSE (
			FOR /F tokens^=1^,2^ delims^=^"^' %%I IN ("%%H") DO (
				IF NOT DEFINED [%%J] (ECHO:%%H)
			)
		)
	)
)>tempcleanedprefs
MOVE /Y tempcleanedprefs prefs.js
GOTO :EOF
REM ############### Help ##################
:showhelp
MODE 80,34
CLS
CALL :message "This script creates a backup of your prefs.js file before doing anything."
ECHO   It should be safe, but you can follow these steps if something goes wrong:
ECHO:
CALL :message "  1. Make sure Firefox is closed."
ECHO     2. Delete prefs.js in your profile folder.
CALL :message "  3. Delete Invalidprefs.js if you have one in the same folder."
ECHO     4. Rename or copy your latest backup to prefs.js.
CALL :message "  5. Run Firefox and see if you notice anything wrong with it."
ECHO     6. If you do notice something wrong, especially with your extensions,
CALL :message "     and/or with the UI, go to about:support, and restart Firefox with"
ECHO        add-ons disabled. Then, restart it again normally, and see if the
CALL :message "     problems were solved."
ECHO:
CALL :message "If you are able to identify the cause of your issues, please bring it up"
ECHO   on arkenfox user.js GitHub repository.
ECHO:
ECHO:
PAUSE
CLS
GOTO :begin
REM #####################################
