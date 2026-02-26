@echo off
echo Parando processos Node...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Iniciando servidor...
start "Backend Server" cmd /k "npm start"
echo Servidor reiniciado!
