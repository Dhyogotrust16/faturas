@echo off
echo ========================================
echo   DEPLOY VISAO FATURAS
echo ========================================
echo.
echo Este script vai:
echo   1. Instalar Fly CLI (se necessario)
echo   2. Fazer login no Fly.io
echo   3. Fazer deploy para producao
echo.
echo IMPORTANTE: Execute como Administrador!
echo.
pause

powershell -ExecutionPolicy Bypass -File "%~dp0instalar-fly-e-deploy.ps1"

pause
