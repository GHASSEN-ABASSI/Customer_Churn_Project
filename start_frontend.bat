@echo off
set "NODE_PATH=C:\laragon\bin\nodejs\node-v18"
set "NPM=%NODE_PATH%\npm.cmd"

echo.
echo ============================================================
echo   ChurnGuard - Starting Frontend
echo ============================================================
echo.

if not exist "frontend\node_modules" (
    echo [1/2] node_modules not found. Installing dependencies...
    set "PATH=%NODE_PATH%;%PATH%"
    cd frontend
    call "%NPM%" install
    cd ..
) else (
    echo [1/2] Dependencies already installed.
)

echo.
echo [2/2] Starting Vite development server...
echo.
set "PATH=%NODE_PATH%;%PATH%"
cd frontend
call "%NPM%" run dev
pause
