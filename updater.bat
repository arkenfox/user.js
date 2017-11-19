@ECHO OFF
TITLE ghacks user.js updater

REM ### ghacks-user.js updater for Windows
REM ## author: @claustromaniac
REM ## version: 2.0

SETLOCAL EnableDelayedExpansion
SET "_ua="
SET "_log="
:parse
IF "%~1"=="" GOTO endparse
IF "%~1"=="-unattended" SET "_ua=true"
IF "%~1"=="-log" SET "_log=true"
SHIFT
GOTO parse
:endparse
SET "_name="
SET "_date="
SET "_version="
SET /A "_line=0"
ECHO.
IF EXIST user.js (
	FOR /F "delims=" %%i IN (user.js) DO (
		IF !_line! EQU 1 SET "_name=%%i"
		IF !_line! EQU 2 SET "_date=%%i"
		IF !_line! EQU 3 SET "_version=%%i"
		SET /A "_line+=1"
		IF !_line! GEQ 4 GOTO break
	)
	:break
	IF !_line! GEQ 4 (
		IF "ghacks"=="!_name:~8,6!" (
			FOR /F "delims=:" %%G IN ("!_version!") DO SET "_version=%%G"
			SET "_version=!_version:~2!"
			SET "_date=!_date:~8!"
			ECHO ghacks user.js !_version!, !_date!
		) ELSE ( ECHO Current user.js version not recognised. )
	) ELSE ( ECHO Current user.js version not recognised. )
) ELSE ( ECHO user.js not detected in the current directory. )
ECHO.
IF NOT "%_ua%"=="true" (
	ECHO This batch should be run from your Firefox profile directory. It will download the latest version of ghacks user.js from github and then append any of your own changes from user-overrides.js to it.
	ECHO.
	REM Visit the wiki for more detailed information.
	REM ECHO.
	CHOICE /M "Continue"
	IF ERRORLEVEL 2 GOTO end
)
CLS
ECHO.
IF "%_log%"=="true" (
	CALL :log >>user.js-update-log.txt
	EXIT /B
)
:log
IF "%_log%"=="true" (
	ECHO ##################################################################
	ECHO.
	ECHO %date%, %time%
	ECHO.
)
IF EXIST user.js (
	IF EXIST user.js.bak REN user.js.bak user.js.old.bak
	REN user.js user.js.bak
	ECHO Current user.js file backed up.
	ECHO.
)
ECHO Retrieving latest user.js file from ghacks github repository...
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/user.js', 'user.js')"
ECHO.
IF EXIST user.js (
	IF EXIST "user-overrides.js" (
		ECHO Appending user-overrides.js...
		ECHO.
		COPY /B /V /Y user.js+"user-overrides.js" "tempuserjs"
		DEL /F user.js
		REN tempuserjs user.js
		ECHO.
	)
	ECHO Handling backups...
	SET "changed="
	IF EXIST user.js.bak ( FC user.js.bak user.js >nul && SET "changed=false" || SET "changed=true" )
	ECHO.
	ECHO.
	IF "!changed!"=="true" (
		IF EXIST user.js.old.bak DEL /F user.js.old.bak
		ECHO Update complete.
	) ELSE (
		IF "!changed!"=="false" (
			DEL /F user.js.bak
			IF EXIST user.js.old.bak REN user.js.old.bak user.js.bak
			ECHO Update completed without changes.
		) ELSE ECHO Update complete.
	)
	ECHO.
) ELSE (
	IF EXIST user.js.bak REN user.js.bak user.js
	IF EXIST user.js.old.bak REN user.js.old.bak user.js.bak
	ECHO.
	ECHO Update failed. Make sure PowerShell is allowed internet access.
	ECHO.
	ECHO No changes were made.
	ECHO.
)
:end
IF NOT "%_log%"=="true" (
	IF NOT "%_ua%"=="true" PAUSE
)
