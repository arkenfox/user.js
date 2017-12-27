@ECHO OFF & SETLOCAL EnableDelayedExpansion
TITLE ghacks user.js updater

REM ## ghacks-user.js updater for Windows
REM ## author: @claustromaniac
REM ## version: 4.2
REM ## instructions: https://github.com/ghacksuserjs/ghacks-user.js/wiki/3.3-Updater-Scripts

SET _myname=%~n0
SET _myparams=%*
:parse
IF "%~1"=="" (GOTO endparse)
IF /I "%~1"=="-unattended" (SET _ua=1)
IF /I "%~1"=="-log" (SET _log=1)
IF /I "%~1"=="-logp" (SET _log=1 & SET _logp=1)
IF /I "%~1"=="-multioverrides" (SET _multi=1)
IF /I "%~1"=="-merge" (SET _merge=1)
IF /I "%~1"=="-updatebatch" (SET _updateb=1)
SHIFT
GOTO parse
:endparse
IF DEFINED _updateb (
	REM The normal flow here goes from phase 1 to phase 2 and then phase 3.
	IF NOT "!_myname:~0,9!"=="[updated]" (
		IF EXIST "[updated]!_myname!.bat" (
			REM ## Phase 3 ##: The new script, with the original name, will:
			REM 	* Delete the [updated]*.bat script
			REM 	* Begin the normal routine
			REN "[updated]!_myname!.bat" "[updated]!_myname!.bat.old"
			DEL /F "[updated]!_myname!.bat.old"
			CALL :message "Script updated^!"
			TIMEOUT 3 >nul
			CLS
			GOTO begin
		)
		REM ## Phase 1 ##
		REM 	* Download new batch and name it [updated]*.bat
		REM 	* Start that script in a new CMD window
		REM 	* Exit
		CALL :message "Updating script..."
		REM Uncomment the next line and comment the powershell call for testing.
		REM COPY /B /V /Y "!_myname!.bat" "[updated]!_myname!.bat"
		(
			powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/updater.bat', '[updated]!_myname!.bat')"
		) >nul 2>&1
		IF EXIST "[updated]!_myname!.bat" (
			START /min CMD /C "[updated]!_myname!.bat" !_myparams!
			EXIT /B
		) ELSE (
			CALL :message "Failed. Make sure PowerShell is allowed internet access."
			TIMEOUT 120 >nul
			EXIT /B
		)
	) ELSE (
		IF "!_myname!"=="[updated]" (
			CALL :message "The [updated] label is reserved. Rename this script and try again."
			TIMEOUT 300 >nul
		) ELSE (
			REM ## Phase 2 ##: The [updated]*.bat script will:
			REM 	* Copy itself overwriting the original batch
			REM 	* Start that script in a new CMD instance
			REM 	* Exit
			IF EXIST "!_myname:~9!.bat" (
				REN "!_myname:~9!.bat" "!_myname:~9!.bat.old"
				DEL /F "!_myname:~9!.bat.old"
			)
			COPY /B /V /Y "!_myname!.bat" "!_myname:~9!.bat"
			START CMD /C "!_myname:~9!.bat" !_myparams!
		)
		EXIT /B
	)
)
:begin
ECHO:
ECHO:
ECHO:                ########################################
ECHO:                ####  user.js Updater for Windows   ####
ECHO:                ####       by claustromaniac        ####
ECHO:                ####             v4.2               ####
ECHO:                ########################################
ECHO:
SET /A "_line=0"
IF NOT EXIST user.js (
	CALL :message "user.js not detected in the current directory."
) ELSE (
	FOR /F "skip=1 tokens=1,2 delims=:" %%G IN (user.js) DO (
		SET /A "_line+=1"
		IF !_line! GEQ 4 (GOTO exitloop)
		IF !_line! EQU 1 (SET _name=%%H)
		IF !_line! EQU 2 (SET _date=%%H)
		IF !_line! EQU 3 (SET _version=%%G)
	)
	:exitloop
	IF !_line! GEQ 4 (
		IF /I NOT "!_name!"=="!_name:ghacks=!" (
			CALL :message "ghacks user.js !_version:~2!,!_date!"
		) ELSE (
			CALL :message "Current user.js version not recognised."
		)
	) ELSE (
		CALL :message "Current user.js version not recognised."
	)
)
ECHO:
IF NOT DEFINED _ua (
	CALL :message "This batch should be run from your Firefox profile directory."
	ECHO:  It will download the latest version of ghacks user.js from github and then
	CALL :message "append any of your own changes from user-overrides.js to it."
	CALL :message "Visit the wiki for more detailed information."
	ECHO:
	TIMEOUT 1 /nobreak >nul
	CHOICE /C SHE /N /M "Start [S] Help [H] Exit [E]"
	CLS
	IF ERRORLEVEL 3 (EXIT /B)
	IF ERRORLEVEL 2 (GOTO :showhelp)
)
IF DEFINED _log (
	CALL :log >>user.js-update-log.txt 2>&1
	IF DEFINED _logp (START user.js-update-log.txt)
	EXIT /B
	:log
	SET _log=2
	ECHO:##################################################################
	CALL :message "%date%, %time%"
)
IF EXIST user.js.old.bak (DEL /F user.js.old.bak)
IF EXIST user.js (
	IF EXIST user.js.bak (REN user.js.bak user.js.old.bak)
	REN user.js user.js.bak
	CALL :message "Current user.js file backed up."
)
CALL :message "Retrieving latest user.js file from github repository..."
(
	powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/user.js', 'user.js')"
) >nul 2>&1
IF EXIST user.js (
	IF DEFINED _multi (
		FORFILES /P user.js-overrides /M *.js >nul 2>&1
		IF NOT ERRORLEVEL 1 (
			IF DEFINED _merge (
				CALL :message "Merging..."
				COPY /B /V /Y user.js-overrides\*.js user-overrides-merged.js
				CALL :merge user-overrides-merged.js
				COPY /B /V /Y user.js+user-overrides-merged.js user.js
				CALL :merge user.js
			) ELSE (
				CALL :message "Appending..."
				COPY /B /V /Y user.js+"user.js-overrides\*.js" user.js
			)
		) ELSE (CALL :message "No override files found.")
		ECHO:
	) ELSE (
		IF EXIST "user-overrides.js" (
			COPY /B /V /Y user.js+"user-overrides.js" "user.js"
			IF DEFINED _merge (
				CALL :message "Merging user-overrides.js..."
				CALL :merge user.js
			) ELSE (
				CALL :message "user-overrides.js appended."
			)
		) ELSE (CALL :message "user-overrides.js not found.")
		ECHO:
	)
	CALL :message "Handling backups..."
	SET "changed="
	IF EXIST user.js.bak (
		FC user.js.bak user.js >nul && SET "changed=false" || SET "changed=true"
	)
	IF "!changed!"=="true" (
		IF EXIST user.js.old.bak DEL /F user.js.old.bak
		CALL :message "Update complete."
	) ELSE (
		IF "!changed!"=="false" (
			DEL /F user.js.bak
			IF EXIST user.js.old.bak REN user.js.old.bak user.js.bak
			CALL :message "Update completed without changes."
		) ELSE (CALL :message "Update complete.")
	)
	ECHO:
) ELSE (
	IF EXIST user.js.bak (REN user.js.bak user.js)
	IF EXIST user.js.old.bak (REN user.js.old.bak user.js.bak)
	CALL :message "Update failed. Make sure PowerShell is allowed internet access."
	ECHO:   No changes were made.
)
IF NOT DEFINED _log (
	IF NOT DEFINED _ua (PAUSE)
)
EXIT /B

REM ########### Message Function ###########
:message
SETLOCAL DisableDelayedExpansion
IF NOT "2"=="%_log%" (ECHO:)
ECHO:  %~1
IF NOT "2"=="%_log%" (ECHO:)
ENDLOCAL
GOTO :EOF
REM ############ Merge function ############
:merge
SETLOCAL DisableDelayedExpansion
(
	FOR /F "tokens=1,* delims=," %%G IN ('FINDSTR /B /I /C:"user_pref" "%~1"') DO (SET "%%G=%%H")
	FOR /F "tokens=1,* delims=:" %%I IN ('FINDSTR /N "^" "%~1"') DO (
		IF ""=="%%J" (
			ECHO:
		) ELSE (
			FOR /F "delims=," %%K IN ("%%J") DO (
				IF NOT [user_pref("_user.js.parrot"]==[%%K] (
					IF DEFINED %%K (
						SETLOCAL EnableDelayedExpansion
						FOR /F "delims=" %%L IN ("!%%K!") DO (
							ENDLOCAL
							IF NOT "%%L"=="ALREADY MERGED" (
								ECHO:%%K,%%L
								SET "%%K=ALREADY MERGED"
							)
						)
					) ELSE (
						ECHO:%%J
					)
				) ELSE (
					ECHO:%%J
				)
			)
		)
	)
)>updatertempfile
MOVE /Y updatertempfile "%~1" >nul
ENDLOCAL
GOTO :EOF
REM ############### Help ##################
:showhelp
MODE 80,43
CLS
CALL :message "Available arguments (case-insensitive):"
CALL :message "  -log"
ECHO:     Write the console output to a logfile (user.js-update-log.txt)
CALL :message "  -logP"
ECHO:     Like -log, but also open the logfile after updating.
CALL :message "  -merge"
ECHO:     Merge overrides instead of appending them. One-line comments and
ECHO:     _user.js.parrot lines are appended normally. Overrides for inactive
ECHO:     user.js prefs will be appended. When -Merge and -MultiOverrides are used
ECHO:     together, a user-overrides-merged.js file is also generated in the root
ECHO:     directory for quick reference. It contains only the merged data from
ECHO:     override files and can be safely discarded after updating, or used as the
ECHO:     new user-overrides.js. When there are conflicting records for the same
ECHO:     pref, the value of the last one declared will be used. Visit the wiki
ECHO:     for usage examples and more detailed information.
CALL :message "  -multiOverrides"
ECHO:     Use any and all .js files in a user.js-overrides sub-folder as overrides
ECHO:     instead of the default user-overrides.js file. Files are appended in
ECHO:     alphabetical order.
CALL :message "  -unattended"
ECHO:     Run without user input.
CALL :message "  -updatebatch"
ECHO:     Update the script itself on execution, before the normal routine.
CALL :message ""
PAUSE
CLS
MODE 80,25
GOTO :begin
REM #####################################
