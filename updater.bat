@ECHO OFF
TITLE ghacks user.js updater

REM ### ghacks-user.js updater for Windows
REM ## author: @claustromaniac
REM ## version: 3.0

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
	ECHO Checking updater version...
	ECHO.
	IF EXIST "!_myname!-updated.bat" (
		DEL /F "!_myname!-updated.bat"
	)
	powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/updater.bat', '!_myname!-updated.bat')" >nul
	IF EXIST "!_myname!-updated.bat" (
		CLS
		SET "_myparams=!_myparams:-updatebatch=!"
		SET "_myparams=!_myparams:-Updatebatch=!"
		SET "_myparams=!_myparams:-UpdateBatch=!"
		SET "_myparams=!_myparams:-UPDATEBATCH=!"
		START CMD /C "!_myname!-updated.bat" !_myparams!
		DEL /F "!_myname!.bat" >nul 2>&1
		EXIT /B
	) ELSE (
		ECHO Failed. Make sure PowerShell is allowed internet access.
		ECHO.
		PAUSE
		GOTO end
	)
)
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
			SET _version=!_version:*version=version!
			ECHO ghacks user.js !_version!,!_date!
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
	REM ECHO Visit the wiki for more detailed information.
	REM ECHO.
	CHOICE /M "Continue"
	IF ERRORLEVEL 2 (
		GOTO end
	)
)
CLS
ECHO.
IF DEFINED _log (
	CALL :log >>user.js-update-log.txt 2>&1
	EXIT /B
	:log
	ECHO ##################################################################
	ECHO.
	ECHO %date%, %time%
	ECHO.
)
IF EXIST user.js (
	IF EXIST user.js.bak (
		REN user.js.bak user.js.old.bak
	)
	REN user.js user.js.bak
	ECHO Current user.js file backed up.
	ECHO.
)
ECHO Retrieving latest user.js file from github repository...
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://github.com/ghacksuserjs/ghacks-user.js/raw/master/user.js', 'user.js')" >nul
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
				IF EXIST user-overrides-merged.js (
					DEL /F user-overrides-merged.js
				)
				IF EXIST temp2 (
					DEL /F temp2
				)
				IF EXIST temp3 (
					DEL /F temp3
				)
				COPY /B /V /Y user.js-overrides\*.js user-overrides
				FOR /F "tokens=* delims=" %%G IN (user-overrides) DO (
					SET _pref=%%G
					SET "_temp=!_pref: =!"
					IF /I "user"=="!_temp:~0,4!" (
						FOR /F "delims=," %%S IN ("!_pref!") DO (
							SET _pref=%%S
						)
						SET _pref=!_pref:"=""!
						FIND /I "!_pref!" user-overrides-merged.js >nul 2>&1
						IF ERRORLEVEL 1 (
							FIND /I "!_pref!" user-overrides >temp1
							FOR /F "tokens=* delims=" %%X IN (temp1) DO (
								SET _temp=%%X
								SET "_temp=!_temp: =!"
								IF /I "user"=="!_temp:~0,4!" (
									SET _pref=%%X
								)
							)
							ECHO !_pref!>>user-overrides-merged.js
						)
					) ELSE (
						ECHO !_pref!>>user-overrides-merged.js
					)
				)
				COPY /B /V /Y user.js+user-overrides-merged.js temp2
				FOR /F "tokens=* delims=" %%G IN (temp2) DO (
					SET _pref=%%G
					SET "_temp=!_pref: =!"
					IF /I "user"=="!_temp:~0,4!" (
						FOR /F "delims=," %%S IN ("!_pref!") DO (
							SET _pref=%%S
						)
						SET _pref=!_pref:"=""!
						FIND /I "!_pref!" temp3 >nul 2>&1
						IF ERRORLEVEL 1 (
							FIND /I "!_pref!" temp2 >temp1
							FOR /F "tokens=* delims=" %%X IN (temp1) DO (
								SET _temp=%%X
								SET "_temp=!_temp: =!"
								IF /I "user"=="!_temp:~0,4!" (
									SET _pref=%%X
								)
							)
							ECHO !_pref!>>temp3
						)
					) ELSE (
						ECHO !_pref!>>temp3
					)
				)
				IF EXIST user.js (
					DEL /F user.js
				)
				IF EXIST temp2 (
					DEL /F temp2
				)
				REN temp3 user.js
				IF EXIST temp1 (
					DEL /F temp1
				)
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
				IF EXIST temp2 (
					DEL /F temp2
				)
				IF EXIST temp3 (
					DEL /F temp3
				)
				COPY /B /V /Y user.js+user-overrides.js temp2
				FOR /F "tokens=* delims=" %%G IN (temp2) DO (
					SET _pref=%%G
					SET "_temp=!_pref: =!"
					IF /I "user"=="!_temp:~0,4!" (
						FOR /F "delims=," %%S IN ("!_pref!") DO (
							SET _pref=%%S
						)
						SET _pref=!_pref:"=""!
						FIND /I "!_pref!" temp3 >nul 2>&1
						IF ERRORLEVEL 1 (
							FIND /I "!_pref!" temp2 >temp1
							FOR /F "tokens=* delims=" %%X IN (temp1) DO (
								SET _temp=%%X
								SET "_temp=!_temp: =!"
								IF /I "user"=="!_temp:~0,4!" (
									SET _pref=%%X
								)
							)
							ECHO !_pref!>>temp3
						)
					) ELSE (
						ECHO !_pref!>>temp3
					)
				)
				IF EXIST user.js (
					DEL /F user.js
				)
				REN temp3 user.js
				IF EXIST temp1 (
					DEL /F temp1
				)
				IF EXIST temp2 (
					DEL /F temp2
				)
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
		IF EXIST user.js.old.bak (
			DEL /F user.js.old.bak
		)
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
	IF EXIST user.js.bak (
		REN user.js.bak user.js
	)
	IF EXIST user.js.old.bak (
		REN user.js.old.bak user.js.bak
	)
	ECHO.
	ECHO Update failed. Make sure PowerShell is allowed internet access.
	ECHO.
	ECHO No changes were made.
	ECHO.
)
IF NOT DEFINED _log (
	IF NOT DEFINED _ua PAUSE
)
:end
IF DEFINED _logp (
	START user.js-update-log.txt
)
IF NOT "!_myname!"=="!_myname:-updated=X!" (
	REN "!_myname!.bat" "!_myname:-updated=!.bat"
	EXIT /B
)
