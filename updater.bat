@ECHO OFF & SETLOCAL EnableDelayedExpansion
TITLE arkenfox user.js updater

REM ## arkenfox user.js updater for Windows
REM ## author: @claustromaniac
REM ## version: 4.19
REM ## instructions: https://github.com/arkenfox/user.js/wiki/5.1-Updater-[Options]#-windows

SET v=4.19

VERIFY ON
CD /D "%~dp0"
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
IF /I "%~1"=="-singlebackup" (SET _singlebackup=1)
IF /I "%~1"=="-esr" (SET _esr=1)
SHIFT
GOTO parse
:endparse

FOR /F %%i IN ('PowerShell -Command "[Enum]::GetNames([Net.SecurityProtocolType]) -contains 'Tls12'"') DO (
	IF "%%i" == "False" (
		CALL :message "Your PowerShell version doesn't support TLS1.2 ^!"
		ECHO:  Instructions to update PowerShell are on the arkenfox wiki
		PAUSE
		EXIT
	)
)

IF DEFINED _updateb (
	REM The normal flow here goes from phase 1 to phase 2 and then phase 3.
	IF NOT "!_myname:~0,9!"=="[updated]" (
		IF EXIST "[updated]!_myname!.bat" (
			REM ## Phase 3 ##: The new script, with the original name, will:
			REM 	* Delete the [updated]*.bat and *.bat.old scripts
			REM 	* Begin the normal routine
			FC "[updated]!_myname!.bat" "!_myname!.bat.old" >nul
			IF NOT "!errorlevel!"=="0" (
				CALL :message "Script updated to version !v!"
				TIMEOUT 3 >nul
			)
			REN "[updated]!_myname!.bat" "[updated]!_myname!.bat.old"
			DEL /F "!_myname!.bat.old" "[updated]!_myname!.bat.old"
			GOTO begin
		)
		REM ## Phase 1 ##
		REM 	* Download new batch and name it [updated]*.bat
		REM 	* Start that script in a new CMD window
		REM 	* Exit
		CALL :message "Updating script..."
		REM Uncomment the next line and comment out the PowerShell call for testing.
		REM COPY /B /Y "!_myname!.bat" "[updated]!_myname!.bat" >nul
		CALL :psdownload https://raw.githubusercontent.com/arkenfox/user.js/master/updater.bat "[updated]!_myname!.bat"
		IF EXIST "[updated]!_myname!.bat" (
			START /min CMD /C "[updated]!_myname!.bat" !_myparams!
		) ELSE (
			CALL :message "Failed. Make sure PowerShell is allowed internet access."
			TIMEOUT 120 >nul
		)
	) ELSE (
		IF "!_myname!"=="[updated]" (
			CALL :message "The [updated] label is reserved. Rename this script and try again."
			TIMEOUT 300 >nul
		) ELSE (
			REM ## Phase 2 ##: The [updated]*.bat script will:
			REM 	* Rename the old script and make a copy of itself with the original name.
			REM 	* Run that copy in a new CMD instance
			REM 	* Exit
			IF EXIST "!_myname:~9!.bat" ( REN "!_myname:~9!.bat" "!_myname:~9!.bat.old" )
			COPY /B /Y "!_myname!.bat" "!_myname:~9!.bat"
			START CMD /C "!_myname:~9!.bat" !_myparams!
		)
	)
	EXIT /B
)

:begin
CLS
ECHO:
ECHO:
ECHO:                ########################################
ECHO:                ####  user.js Updater for Windows   ####
ECHO:                ####       by claustromaniac        ####
ECHO:                ####             v!v!              ####
ECHO:                ########################################
ECHO:
SET /A "_line=0"
IF NOT EXIST user.js (
	CALL :message "user.js not detected in the current directory."
) ELSE (
	FOR /F "skip=1 tokens=1,* delims=:" %%G IN (user.js) DO (
		SET /A "_line+=1"
		IF !_line! GEQ 4 (GOTO exitloop)
		IF !_line! EQU 1 (SET _name=%%H)
		IF !_line! EQU 2 (SET _date=%%H)
		IF !_line! EQU 3 (SET _version=%%G)
	)
	:exitloop
	IF NOT "!_name!"=="" (
		SET "_tempvar="
		IF /I NOT "!_name!"=="!_name:ghacks=!" SET _tempvar=1
		IF /I NOT "!_name!"=="!_name:arkenfox=!" SET _tempvar=1
		IF !_tempvar! EQU 1 (
			CALL :message "!_name! !_version:~2!,!_date!"
		) ELSE (CALL :message "Current user.js version not recognised.")
	) ELSE (CALL :message "Current user.js version not recognised.")
)
ECHO:
IF NOT DEFINED _ua (
	CALL :message "This batch should be run from your Firefox profile directory."
	ECHO:  It will download the latest version of arkenfox user.js from github and then
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
	ECHO:  %date%, %time%
)
IF EXIST user.js.new (DEL /F "user.js.new")
CALL :message "Retrieving latest user.js file from github repository..."
CALL :psdownload https://raw.githubusercontent.com/arkenfox/user.js/master/user.js "user.js.new"
IF EXIST user.js.new (
	IF DEFINED _esr (
		CALL :message "Activating ESR section..."
		CALL :activate user.js.new ".x still uses all the following prefs"
	)
	IF DEFINED _multi (
		FORFILES /P user.js-overrides /M *.js >nul 2>&1
		IF NOT ERRORLEVEL 1 (
			IF DEFINED _merge (
				CALL :message "Merging..."
				COPY /B /Y user.js-overrides\*.js user-overrides-merged.js
				CALL :merge user-overrides-merged.js
				COPY /B /Y user.js.new+user-overrides-merged.js user.js.new
				CALL :merge user.js.new
			) ELSE (
				CALL :message "Appending..."
				COPY /B /Y user.js.new+"user.js-overrides\*.js" user.js.new
			)
		) ELSE (CALL :message "No override files found.")
	) ELSE (
		IF EXIST "user-overrides.js" (
			COPY /B /Y user.js.new+"user-overrides.js" "user.js.new"
			IF DEFINED _merge (
				CALL :message "Merging user-overrides.js..."
				CALL :merge user.js.new
			) ELSE (
				CALL :message "user-overrides.js appended."
			)
		) ELSE (CALL :message "user-overrides.js not found.")
	)
	IF EXIST user.js (
		FC user.js.new user.js >nul && SET "_changed=false" || SET "_changed=true"
	)
	IF "!_changed!"=="true" (
		CALL :message "Backing up..."
		IF DEFINED _singlebackup (
			MOVE /Y user.js user.js.bak >nul
		) ELSE (
			FOR /F "delims=" %%# IN ('powershell get-date -format "{yyyyMMdd_HHmmss}"') DO @SET ldt=%%#
			MOVE /Y user.js "user-backup-!ldt!.js" >nul
		)
		REN user.js.new user.js
		CALL :message "Update complete."
	) ELSE (
		IF "!_changed!"=="false" (
			DEL /F user.js.new >nul
			CALL :message "Update completed without changes."
		) ELSE (
			REN user.js.new user.js
			CALL :message "Update complete."
			SET "_changed=true"
		)
	)
) ELSE (
	CALL :message "Update failed. Make sure PowerShell is allowed internet access."
	ECHO:  No changes were made.
)
IF NOT DEFINED _log (
	IF NOT DEFINED _ua (
		IF EXIST prefsCleaner.bat (
			IF "!_changed!"=="true" (
				CALL :message "Would you like to run the prefsCleaner now?"
				CHOICE /C YN /N /M "(Y/N) "
				IF "1"=="!errorlevel!" ( START "" cmd.exe /C "prefsCleaner.bat" )
			) ELSE (PAUSE)
		) ELSE (PAUSE)
	)
)
EXIT /B

::::::::::::::: Message :::::::::::::::
:message
SETLOCAL DisableDelayedExpansion
IF NOT "2"=="%_log%" (ECHO:)
ECHO:  %~1
IF NOT "2"=="%_log%" (ECHO:)
ENDLOCAL
GOTO :EOF

::::::::::::::: Download :::::::::::::::
:psdownload
(
	PowerShell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('%~1', '%~2')"
) >nul 2>&1
GOTO :EOF

::::::::::::::: Activate Section :::::::::::::::
:activate
:: arg1 = file
:: arg2 = line substring
SETLOCAL DisableDelayedExpansion
(
	FOR /F "tokens=1,* delims=:" %%G IN ('FINDSTR /N "^" "%~1"') DO (
		SET "_temp=%%H"
		SETLOCAL EnableDelayedExpansion
		IF "!_temp:%~2=!"=="!_temp!" (
			ENDLOCAL & ECHO:%%H
		) ELSE (
			ECHO://!_temp:~2!
			ENDLOCAL
		)
	)
)>updatertempfile
MOVE /Y updatertempfile "%~1" >nul
ENDLOCAL
GOTO :EOF

::::::::::::::: Merge :::::::::::::::
:merge
SETLOCAL DisableDelayedExpansion
FOR /F tokens^=2^,^*^ delims^=^'^" %%G IN ('FINDSTR /R /C:"^user_pref[ 	]*\([ 	]*[\"'].*[\"'][ 	]*,.*\)[ 	]*;" "%~1"') DO (SET "[%%G]=%%H")
FOR /F tokens^=2^,^*^ delims^=^' %%G IN ('FINDSTR /R /C:"^//// --- comment-out --- '[^'][^']*'.*" "%~1"') DO (SET "__unset__%%G=1")
(
	FOR /F "tokens=1,* delims=:" %%I IN ('FINDSTR /N "^" "%~1"') DO (
		SET "_temp=%%J"
		SETLOCAL EnableDelayedExpansion
		IF NOT "!_temp:~0,9!"=="user_pref" (
			ENDLOCAL & ECHO:%%J
		) ELSE (
			IF "!_temp:;=!"=="!_temp!" (
				ENDLOCAL & ECHO:%%J
			) ELSE (
				ENDLOCAL
				FOR /F tokens^=2^ delims^=^'^" %%K IN ("%%J") DO (
					IF NOT "_user.js.parrot"=="%%K" (
						IF DEFINED __unset__%%K (
							ECHO://%%J
						) ELSE (
							IF DEFINED [%%K] (
								SETLOCAL EnableDelayedExpansion
								FOR /F "delims=" %%L IN ("![%%K]!") DO (
									ENDLOCAL & ECHO:user_pref("%%K"%%L
									SET "[%%K]="
								)
							)
						)
					) ELSE (ECHO:%%J)
				)
			)
		)
	)
)>updatertempfile
MOVE /Y updatertempfile "%~1" >nul
ENDLOCAL
GOTO :EOF

::::::::::::::: Help :::::::::::::::
:showhelp
MODE 80,54
CLS
CALL :message "Available arguments (case-insensitive):"
CALL :message "  -esr"
ECHO:     Activate ESR related preferences
CALL :message "  -log"
ECHO:     Write the console output to a logfile (user.js-update-log.txt)
CALL :message "  -logP"
ECHO:     Like -log, but also open the logfile after updating.
CALL :message "  -merge"
ECHO:     Merge overrides instead of appending them. Single-line comments and
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
CALL :message "  -singleBackup"
ECHO:     Use a single backup file and overwrite it on new updates, instead of
ECHO:     cumulative backups. This was the default behaviour before v4.3.
CALL :message "  -updateBatch"
ECHO:     Update the script itself on execution, before the normal routine.
CALL :message ""
PAUSE
MODE 80,25
GOTO :begin
