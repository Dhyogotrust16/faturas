# Script para restaurar banco de dados no Fly.io

Write-Host "📦 Restaurando banco de dados no Fly.io..." -ForegroundColor Green
Write-Host ""

# 1. Fazer backup do banco atual no Fly.io
Write-Host "1. Fazendo backup do banco atual..." -ForegroundColor Yellow
flyctl ssh console -C "cp /app/data/faturas.db /app/data/faturas-backup-$(date +%Y%m%d-%H%M%S).db"

# 2. Copiar banco local para o Fly.io usando SFTP
Write-Host "2. Copiando banco local para o Fly.io..." -ForegroundColor Yellow
Write-Host "   Conectando via SFTP..." -ForegroundColor Gray

# Criar arquivo de comandos SFTP
@"
cd /app/data
put database/faturas.db faturas.db
bye
"@ | Out-File -FilePath sftp-commands.txt -Encoding ASCII

# Executar SFTP
flyctl ssh sftp shell < sftp-commands.txt

# Limpar arquivo temporário
Remove-Item sftp-commands.txt -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "✅ Banco de dados restaurado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Estatísticas do banco local:" -ForegroundColor Cyan
node -e "const sqlite3 = require('sqlite3').verbose(); const db = new sqlite3.Database('database/faturas.db'); db.get('SELECT COUNT(*) as c FROM usuarios', (e,r) => console.log('   Usuários:', r.c)); db.get('SELECT COUNT(*) as c FROM clientes', (e,r) => console.log('   Clientes:', r.c)); db.get('SELECT COUNT(*) as c FROM faturas', (e,r) => console.log('   Faturas:', r.c)); db.close();"

Write-Host ""
Write-Host "🔄 Reiniciando aplicação..." -ForegroundColor Yellow
flyctl apps restart visao-faturas

Write-Host ""
Write-Host "✅ Processo concluído!" -ForegroundColor Green
Write-Host "🌐 Acesse: https://visao-faturas.fly.dev/" -ForegroundColor Cyan
