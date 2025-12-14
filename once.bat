@echo off
REM Version simplifiee

if "%~1"=="" (
    echo Usage: %~nx0 URL_GITHUB
    echo Exemple: %~nx0 https://github.com/Harvey13/QrGenerator.git
    pause
    exit /b 1
)

REM Sequence complete
git init
git add .
git commit -m "Initial commit"
git remote add origin %1
git branch -M main
git push -u origin main

echo Depot initialise et pousse vers %1
pause