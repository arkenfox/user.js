@ECHO OFF
TITLE ghacks user.js updater

REM ### ghacks-user.js updater for Windows
REM ## author: @claustromaniac
REM ## version: 1.0

SETLOCAL EnableDelayedExpansion
SET "_name="
SET "_date="
SET "_version="
SET /A "_line=0"
IF EXIST user.js (
	FOR /F "delims=" %%i IN (user.js) DO (
		IF !_line! EQU 1 SET "_name=%%i"
		IF !_line! EQU 2 SET "_date=%%i"
		IF !_line! EQU 3 SET "_version=%%i"
		SET /A "_line+=1"
		IF !_line! GEQ 4 GOTO break
	)
	:break:
	IF !_line! GEQ 4 (
		IF "ghacks"=="!_name:~8,6!" (
			FOR /F "delims=:" %%G IN ("!_version!") DO SET "_version=%%G"
			SET "_version=!_version:~2!"
			SET "_date=!_date:~8!"
			ECHO ghacks user.js !_version!, !_date!
		) ELSE ( ECHO Current user.js version not recognised. )
	)
) ELSE ( ECHO user.js not found. )
ECHO.
ECHO This batch should be run from your Firefox profile directory. It will download the latest version of ghacks user.js from github and then append any of your own changes from user-override.js to it.
ECHO.
CHOICE /M "Continue"
IF ERRORLEVEL 2 GOTO end
CLS
ECHO.
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
		COPY /b user.js+"user-overrides.js" "temp.js"
		DEL user.js
		REN temp.js user.js
	)
	FC user.js.bak user.js >nul && DEL user.js.bak || IF EXIST user.js.old.bak DEL user.js.old.bak
	IF EXIST user.js.old.bak REN user.js.old.bak user.js.bak
	CLS
	ECHO.
	ECHO Successfully updated!
	ECHO.
	TIMEOUT 10
) ELSE (
	IF EXIST user.js.bak REN user.js.bak user.js
	IF EXIST user.js.old.bak REN user.js.old.bak user.js.bak
	ECHO.
	ECHO Update failed. Make sure PowerShell is allowed internet access.
	ECHO.
	PAUSE
)
:end:
