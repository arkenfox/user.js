@ECHO OFF
TITLE prefs.js cleaner

REM ### prefs.js cleaner for Windows
REM ## author: @claustromaniac
REM ## version: 1.0b

SETLOCAL EnableDelayedExpansion
CALL :message "This batch should be run from your Firefox profile directory. It will remove from prefs.js any entries that exist in user.js, allowing inactive preferences to reset to default value."
CHOICE /M "Continue"
IF ERRORLEVEL 2 ( EXIT /B )
CLS
IF NOT EXIST "user.js" ( CALL :abort "user.js not found in the current directory." 30 )
IF NOT EXIST "prefs.js" ( CALL :abort "prefs.js not found in the current directory." 30 )
IF EXIST "webappsstore.sqlite-shm" ( CALL :abort "Running this script while Firefox is also running is useless. Close Firefox and try again." 60 )
CALL :message "Backing up prefs.js..."
COPY /B /V /Y prefs.js "prefs-backup-!date:/=-!, !time::=.!.js"
CALL :message "Cleaning prefs.js... (this can take a while)"
CALL :cleanup
CLS
CALL :message "All done."
TIMEOUT 5 >nul
EXIT /B

REM ######### Cleanup Function ##########
:cleanup
SETLOCAL DisableDelayedExpansion
(
	FOR /F "tokens=1,* delims=]" %%G IN ('FIND /N /V "" ^< "prefs.js"') DO (
		SET "_line=%%H"
		SETLOCAL EnableDelayedExpansion
		SET "_pref=!_line: =!"
		FOR /F "delims=," %%X IN ("!_pref!") DO ( SET "_pref=%%X" )
		IF /I "user_pref"=="!_pref:~0,9!" (
			SET _pref=!_pref:"=""!
			FIND /I "!_pref!" user.js >nul
			IF ERRORLEVEL 1 (
				ECHO(!_line!
			)
		) ELSE (
			ECHO(!_line!
		)
		ENDLOCAL
	)
)>newprefs.js
ENDLOCAL
MOVE /Y newprefs.js prefs.js
GOTO :EOF
REM ########## Message Function #########
:message
ECHO.
ECHO %~1
ECHO.
GOTO :EOF
REM ########## Abort Function ###########
:abort
CALL :message %1
ECHO.
TIMEOUT %~2 >nul
EXIT
REM #####################################
