@echo off
setlocal
cd /d "%~dp0"

set "NODE_EXE=C:\Users\12485\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
set "VITE_JS=%CD%\node_modules\vite\bin\vite.js"
set "PORT=5173"

if not exist "%NODE_EXE%" (
  echo Cannot find bundled Node.js:
  echo %NODE_EXE%
  pause
  exit /b 1
)

if not exist "%VITE_JS%" (
  echo Cannot find Vite. Please run dependency install first.
  pause
  exit /b 1
)

echo Starting LinM Portfolio...
echo URL: http://127.0.0.1:%PORT%/
start "" "http://127.0.0.1:%PORT%/"
"%NODE_EXE%" "%VITE_JS%" --host 127.0.0.1 --port %PORT% --strictPort

pause
