@echo off
setlocal EnableExtensions
set "JAVA_HOME=C:\Program Files\Java\jdk-21.0.10"

set "ROOT=%~dp0"
set "BACKEND_DIR=%ROOT%backend"
set "FRONTEND_DIR=%ROOT%frontend"
set "ADMIN_DIR=%ROOT%admin_frontend"
set "FRONTEND_PORT=5173"
set "ADMIN_PORT=5174"

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
  echo Installing customer frontend dependencies...
  pushd "%FRONTEND_DIR%" || exit /b 1
  call npm install
  if errorlevel 1 (
    popd
    exit /b 1
  )
  popd
)

if exist "%ADMIN_DIR%" if not exist "%ADMIN_DIR%\node_modules" (
  echo Installing admin frontend dependencies...
  pushd "%ADMIN_DIR%" || exit /b 1
  call npm install
  if errorlevel 1 (
    popd
    exit /b 1
  )
  popd
)

if exist "C:\Program Files\Cloudflare\Cloudflare WARP\warp-cli.exe" (
  echo Ensuring Cloudflare WARP secure tunnel is active...
  "C:\Program Files\Cloudflare\Cloudflare WARP\warp-cli.exe" connect >nul 2>nul
)

echo Starting NVSHOP backend on http://127.0.0.1:%SERVER_PORT% (Supabase PostgreSQL)...
start "NVSHOP Backend" cmd /k "cd /d ""%BACKEND_DIR%"" && set ""JAVA_HOME=%JAVA_HOME%"" && set ""JAVA_OPTS=-Djava.net.preferIPv4Stack=true"" && gradlew.bat bootRun"

echo Starting NVSHOP customer store on http://127.0.0.1:%FRONTEND_PORT%...
start "NVSHOP Customer Store" cmd /k "cd /d ""%FRONTEND_DIR%"" && npm run dev -- --host 127.0.0.1 --port %FRONTEND_PORT%"

if exist "%ADMIN_DIR%" (
  echo Starting NVSHOP admin portal on http://127.0.0.1:%ADMIN_PORT%...
  start "NVSHOP Admin Portal" cmd /k "cd /d ""%ADMIN_DIR%"" && npm run dev -- --host 127.0.0.1 --port %ADMIN_PORT%"
)

echo.
echo ========================================================
echo NVSHOP System Started Successfully!
echo ========================================================
echo Backend:        http://127.0.0.1:%SERVER_PORT%
echo Database:       Supabase Cloud PostgreSQL (sechgzxyxslvcmcrpaxk)
echo Customer Store: http://127.0.0.1:%FRONTEND_PORT%
echo Admin Portal:   http://127.0.0.1:%ADMIN_PORT%
echo Admin Login:    superadmin@example.com / admin123
echo ========================================================
echo.
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
