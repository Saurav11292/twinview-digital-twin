@echo off
cd /d "%~dp0"
echo Installing dependencies (first run only)...
call npm install
if errorlevel 1 goto error
echo Starting TwinView dev server...
call npm run dev
pause
goto end
:error
echo Install failed. Check that Node.js 20+ and internet access are available.
pause
:end
