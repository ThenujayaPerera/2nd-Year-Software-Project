@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "FRONTEND_PORT=5173"

if exist "%ROOT%.env" (
  for /f "usebackq eol=# tokens=1,* delims==" %%A in ("%ROOT%.env") do (
    if not "%%A"=="" set "%%A=%%B"
  )
)

if not defined SERVER_PORT set "SERVER_PORT=8080"
if not defined VITE_API_URL set "VITE_API_URL=http://localhost:%SERVER_PORT%/api"

if /I "%~1"=="--check" goto check_only

call :check_tools
if errorlevel 1 exit /b 1

if not exist "%FRONTEND_DIR%\node_modules" (
  echo Installing frontend dependencies...
  pushd "%FRONTEND_DIR%" || exit /b 1
  call npm install
  if errorlevel 1 (
    popd
    exit /b 1
  )
  popd
)

echo Starting NVSHOP backend on http://localhost:%SERVER_PORT%
start "NVSHOP Backend" cmd /k "cd /d ""%BACKEND_DIR%"" && gradlew.bat bootRun"

echo Starting NVSHOP frontend on http://localhost:%FRONTEND_PORT%
start "NVSHOP Frontend" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm run dev -- --host 127.0.0.1 --port %FRONTEND_PORT%"

echo.
echo Project is starting in two terminal windows.
echo Backend:  http://localhost:%SERVER_PORT%
echo Frontend: http://localhost:%FRONTEND_PORT%
echo.
echo Make sure MySQL is running and the gpsd_project database is available.
exit /b 0

:check_only
call :check_tools
if errorlevel 1 exit /b 1
echo Project launcher check passed.
exit /b 0

:check_tools
if not exist "%BACKEND_DIR%\gradlew.bat" (
  echo Missing backend Gradle wrapper: %BACKEND_DIR%\gradlew.bat
  exit /b 1
)

if not exist "%FRONTEND_DIR%\package.json" (
  echo Missing frontend package.json: %FRONTEND_DIR%\package.json
  exit /b 1
)

if defined JAVA_HOME if exist "%JAVA_HOME%\bin\java.exe" goto java_ok

where java >nul 2>nul
if errorlevel 1 (
  echo Java is required. Install Java 17 or newer, or set JAVA_HOME, then try again.
  exit /b 1
)
:java_ok

where npm >nul 2>nul
if errorlevel 1 (
  echo npm is required. Install Node.js/npm and try again.
  exit /b 1
)

exit /b 0
