@echo off
echo ========================================
echo   Sistema de Faturas - Iniciando...
echo ========================================
echo.
echo Parando processos Node existentes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Iniciando servidor backend...
echo Servidor rodará em: http://localhost:5000
echo.
npm start
