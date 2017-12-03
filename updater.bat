@ECHO OFF
TITLE ghacks user.js updater

REM ### ghacks-user.js updater for Windows
REM ## author: @claustromaniac
REM ## version: 3.1

SET _myname=%~n0
SET _myparams=%*
SETLOCAL EnableDelayedExpansion
:parse
IF "%~1"=="" (
	GOTO endparse
)
IF /I "%~1"=="-unattended" (
	SET _ua=1
)
IF /I "%~1"=="-log" (
	SET _log=1
)
IF /I "%~1"=="-logp" (
	SET _log=1
	SET _logp=1
)
IF /I "%~1"=="-multioverrides" (
	SET _multi=1
)
IF /I "%~1"=="-merge" (
	SET _merge=1
)
IF /I "%~1"=="-updatebatch" (
	SET _updateb=1
)
SHIFT
GOTO parse
:endparse
ECHO.
IF DEFINED _updateb (
	REM THe normal flow here goes from phase 1 to phase 2 and then phase 3.
	IF NOT "!_myname:~0,9!"=="[updated]" (
		REM Phase 3
		REM The new script, with the original name, should:
		REM 	Delete the [updated]*.bat script
		REM 	Begin the normal script routine.
		IF EXIST "[updated]!_myname!.bat" (
			REN [updated]!_myname!.bat [updated]!_myname!.bat.old
			DEL /F "[updated]!_myname!.bat.old"
			ECHO Script updated^^!
			ECHO.
			TIMEOUT 3 >nul
			CLS
			ECHO.
			GOTO begin
		)
		REM Phase 1
		REM -updatebatch will:
		REM 	Download new batch and name it [updated]*.bat
		REM 	Open that script in a new CMD window.
		REM 	Exit
		ECHO Updating script...
		ECHO.
		REM Uncomment the next line and comment the powershell call for testing.
		REM COPY /B /V /Y "!_myname!.bat" "[updated]!_myname!.bat"
		(
			powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/updater.bat', '[updated]!_myname!.bat')"
		) >nul 2>&1
		IF EXIST "[updated]!_myname!.bat" (
			START /min CMD /C "[updated]!_myname!.bat" !_myparams!
			EXIT /B
		) ELSE (
			ECHO Failed. Make sure PowerShell is allowed internet access.
			ECHO.
			TIMEOUT 120 >nul
			EXIT /B
		)
	) ELSE (
		REM Phase 2
		REM The [updated]*.bat script will:
		REM 	Copy itself overwriting the original batch.
		REM 	Start that script in a new CMD instance.
		REM 	Exit.
		IF "!_myname!"=="[updated]" (
			ECHO The [updated] label is reserved. Rename this script and try again.
			ECHO.
			TIMEOUT 300 >nul
		) ELSE (
			IF EXIST !_myname:~9!.bat (
				REN !_myname:~9!.bat !_myname:~9!.bat.old
				DEL /F !_myname:~9!.bat.old
			)
			COPY /B /V /Y "!_myname!.bat" "!_myname:~9!.bat"
			START CMD /C "!_myname:~9!.bat" !_myparams!
		)
		EXIT /B
	)
)
:begin
SET /A "_line=0"
IF NOT EXIST user.js (
	ECHO user.js not detected in the current directory.
) ELSE (
	FOR /F "skip=1 tokens=1,2 delims=:" %%G IN (user.js) DO (
		SET /A "_line+=1"
		IF !_line! GEQ 4 (
			GOTO exitloop
		)
		IF !_line! EQU 1 (
			SET _name=%%H
		)
		IF !_line! EQU 2 (
			SET _date=%%H
		)
		IF !_line! EQU 3 (
			SET _version=%%G
		)
	)
	:exitloop
	IF !_line! GEQ 4 (
		IF /I NOT "!_name!"=="!_name:ghacks=X!" (
			ECHO ghacks user.js !_version:~2!,!_date!
		) ELSE (
			ECHO Current user.js version not recognised.
		)
	) ELSE (
		ECHO Current user.js version not recognised.
	)
)
ECHO.
IF NOT DEFINED _ua (
	ECHO.
	ECHO This batch should be run from your Firefox profile directory. It will download the latest version of ghacks user.js from github and then append any of your own changes from user-overrides.js to it.
	ECHO.
	ECHO Visit the wiki for more detailed information.
	ECHO.
	CHOICE /M "Continue"
	IF ERRORLEVEL 2 ( EXIT /B )
)
CLS
ECHO.
IF DEFINED _log (
	CALL :log >>user.js-update-log.txt 2>&1
	IF DEFINED _logp (
		START user.js-update-log.txt
	)
	EXIT /B
	:log
	ECHO ##################################################################
	ECHO.
	ECHO %date%, %time%
	ECHO.
)
IF EXIST user.js.old.bak ( DEL /F user.js.old.bak )
IF EXIST user.js (
	IF EXIST user.js.bak ( REN user.js.bak user.js.old.bak )
	REN user.js user.js.bak
	ECHO Current user.js file backed up.
	ECHO.
)
ECHO Retrieving latest user.js file from github repository...
(
	powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/user.js', 'user.js')"
) >nul 2>&1
ECHO.
IF EXIST user.js (
	IF DEFINED _multi (
		ECHO Multiple overrides enabled. List of files found:
		FORFILES /P user.js-overrides /M *.js
		IF %ERRORLEVEL% EQU 0 (
			IF DEFINED _merge (
				ECHO.
				ECHO Merging...
				ECHO.
				COPY /B /V /Y user.js-overrides\*.js user-overrides
				CALL :merge user-overrides user-overrides-merged.js
				COPY /B /V /Y user.js+user-overrides-merged.js updatertempfile
				CALL :merge updatertempfile user.js
			) ELSE (
				ECHO.
				ECHO Appending...
				ECHO.
				COPY /B /V /Y user.js+"user.js-overrides\*.js" user.js
			)
		)
		ECHO.
	) ELSE (
		IF EXIST "user-overrides.js" (
			IF DEFINED _merge (
				ECHO Merging user-overrides.js...
				COPY /B /V /Y user.js+user-overrides.js updatertempfile
				CALL :merge updatertempfile user.js
			) ELSE (
				ECHO Appending user-overrides.js...
				ECHO.
				COPY /B /V /Y user.js+"user-overrides.js" "user.js"
			)
		) ELSE (
			ECHO user-overrides.js not found.
		)
		ECHO.
	)
	ECHO Handling backups...
	SET "changed="
	IF EXIST user.js.bak (
		FC user.js.bak user.js >nul && SET "changed=false" || SET "changed=true"
	)
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
		) ELSE (
			ECHO Update complete.
		)
	)
	ECHO.
) ELSE (
	IF EXIST user.js.bak ( REN user.js.bak user.js )
	IF EXIST user.js.old.bak ( REN user.js.old.bak user.js.bak )
	ECHO.
	ECHO Update failed. Make sure PowerShell is allowed internet access.
	ECHO.
	ECHO No changes were made.
	ECHO.
)
IF NOT DEFINED _log (
	IF NOT DEFINED _ua PAUSE
)
EXIT /B

REM ###### Merge function ######
:merge
IF EXIST updatertempfile1 ( DEL /F updatertempfile1 )
SETLOCAL disabledelayedexpansion
(
	FOR /F "tokens=1,* delims=]" %%G IN ('FIND /n /v "" ^< "%~1"') DO (
		SET "_pref=%%H"
		SETLOCAL enabledelayedexpansion
		SET "_temp=!_pref: =!"
		IF /I "user_pref"=="!_temp:~0,9!" (
			IF /I NOT "user.js.parrot"=="!_temp:~12,14!" (
				FOR /F "delims=," %%S IN ("!_pref!") DO (
					SET "_pref=%%S"
				)
				SET _pref=!_pref:"=""!
				FIND /I "!_pref!" updatertempfile1 >nul 2>&1
				IF ERRORLEVEL 1 (
					FOR /F "tokens=* delims=" %%X IN ('FIND /I "!_pref!" %~1') DO (
						SET "_temp=%%X"
						SET "_temp=!_temp: =!"
						IF /I "user_pref"=="!_temp:~0,9!" (
							SET "_pref=%%X"
						)
					)
					ECHO(!_pref!
					ECHO(!_pref!>>updatertempfile1
				)
			) ELSE (
				ECHO(!_pref!
			)
		) ELSE (
			ECHO(!_pref!
		)
		ENDLOCAL
	)
)>%~2
ENDLOCAL
DEL /F %1 updatertempfile1 >nul
GOTO :EOF
REM ############################
