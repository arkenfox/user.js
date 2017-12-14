@ECHO OFF
TITLE prefs.js cleaner

REM ### prefs.js cleaner for Windows
REM ## author: @claustromaniac
REM ## version: 1.0b3

SETLOCAL EnableDelayedExpansion
:begin
CLS
CALL :message "This batch should be run from your Firefox profile directory."
CALL :message "It will remove from prefs.js any entries that also exist in user.js."
CALL :message "This will allow inactive preferences to reset to default value."
ECHO:
CHOICE /C SHE /N /M "Start [S] Help [H] Exit [E]"
CLS
IF ERRORLEVEL 3 ( EXIT /B )
IF ERRORLEVEL 2 (
	CALL :showhelp
	GOTO :begin
)
IF NOT EXIST "user.js" ( CALL :abort "user.js not found in the current directory." 30 )
IF NOT EXIST "prefs.js" ( CALL :abort "prefs.js not found in the current directory." 30 )
CALL :FFcheck
CALL :message "Backing up prefs.js..."
COPY /B /V /Y prefs.js "prefs-backup-!date:/=-!_!time::=.!.js"
CALL :message "Cleaning prefs.js... (this can take a while)"
CALL :cleanup
CLS
CALL :message "All done."
TIMEOUT 5 >nul
EXIT /B

REM ########## Abort Function ###########
:abort
CALL :message %1
TIMEOUT %~2 >nul
EXIT
REM ########## Message Function #########
:message
ECHO:
ECHO:%~1
ECHO:
GOTO :EOF
REM ####### Firefox Check Function ######
:FFcheck
TASKLIST /FI "IMAGENAME eq firefox.exe" 2>NUL | FIND /I /N "firefox.exe">NUL
IF NOT ERRORLEVEL 1 ( 
	CLS
	CALL :message "Please, close Firefox to continue."
	TIMEOUT 3 >nul
	GOTO :FFcheck
)
GOTO :EOF
REM ######### Cleanup Function ##########
:cleanup
SETLOCAL DisableDelayedExpansion
(
	FOR /F "tokens=1,* delims=:" %%G IN ( 'FINDSTR /N "^" prefs.js' ) DO (
		SET "_line=%%H"
		SETLOCAL EnableDelayedExpansion
		SET "_pref=!_line: =!"
		IF /I "user_pref"=="!_pref:~0,9!" (
			FOR /F "delims=," %%X IN ("!_pref!") DO ( SET "_pref=%%X" )
			SET _pref=!_pref:"=""!
			FIND /I "!_pref!" user.js >nul
			IF ERRORLEVEL 1 (
				ECHO:!_line!
			)
		) ELSE (
			ECHO:!_line!
		)
		ENDLOCAL
	)
)>newprefs.js
ENDLOCAL
MOVE /Y newprefs.js prefs.js
GOTO :EOF
REM ########### Help Function ###########
:showhelp
CLS
CALL :message "This script creates a backup of your prefs.js file before doing anything." 
CALL :message "It should be safe, but you can follow these steps if something goes wrong:"
ECHO   1. Make sure Firefox is closed.
ECHO:
ECHO   2. Delete prefs.js in your profile folder.
ECHO:
ECHO   3. Delete Invalidprefs.js if you have one in the same folder.
ECHO:
ECHO   4. Rename or copy your latest backup to prefs.js.
ECHO:
ECHO   5. Run Firefox and see if you notice anything wrong with it.
ECHO:
ECHO   6. If you do, restart it again, and check back.
ECHO:
ECHO   7. If you still notice something wrong, especially with your extensions,
ECHO:
ECHO      and/or with the UI, go to about:support, and restart Firefox with
ECHO:
ECHO      add-ons disabled. Then, restart it again normally, and see if the problems
ECHO:
ECHO      were solved.
ECHO:
ECHO If you are able to identify the cause of your issues, please bring it up on
ECHO:
ECHO ghacks-user.js GitHub repository.
ECHO:
ECHO:
PAUSE
CLS
GOTO :EOF
REM #####################################
