# Script para Instalar Fly CLI e Fazer Deploy
# Execute este script como Administrador

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALADOR FLY CLI + DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está rodando como Administrador
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERRO: Este script precisa ser executado como Administrador!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Como executar:" -ForegroundColor Yellow
    Write-Host "1. Clique com botao direito no PowerShell" -ForegroundColor Yellow
    Write-Host "2. Selecione 'Executar como Administrador'" -ForegroundColor Yellow
    Write-Host "3. Execute: .\instalar-fly-e-deploy.ps1" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host "Verificando se Fly CLI ja esta instalado..." -ForegroundColor Yellow

# Verificar se fly já está instalado
try {
    $flyVersion = fly version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Fly CLI ja esta instalado: $flyVersion" -ForegroundColor Green
        $instalar = Read-Host "Deseja reinstalar? (s/n)"
        if ($instalar -ne "s") {
            Write-Host "Pulando instalacao..." -ForegroundColor Yellow
            $flyInstalado = $true
        }
    }
} catch {
    Write-Host "Fly CLI nao encontrado. Instalando..." -ForegroundColor Yellow
}

if (-not $flyInstalado) {
    Write-Host ""
    Write-Host "Instalando Fly CLI..." -ForegroundColor Cyan
    Write-Host ""
    
    try {
        # Baixar e instalar Fly CLI
        iwr https://fly.io/install.ps1 -useb | iex
        
        Write-Host ""
        Write-Host "Fly CLI instalado com sucesso!" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANTE: Feche este PowerShell e abra um novo para continuar!" -ForegroundColor Yellow
        Write-Host ""
        
        $continuar = Read-Host "Deseja continuar com o deploy agora? (s/n)"
        if ($continuar -ne "s") {
            Write-Host ""
            Write-Host "Para fazer deploy depois, execute:" -ForegroundColor Cyan
            Write-Host "  fly auth login" -ForegroundColor White
            Write-Host "  fly deploy" -ForegroundColor White
            Write-Host ""
            Read-Host "Pressione Enter para sair"
            exit 0
        }
    } catch {
        Write-Host ""
        Write-Host "ERRO ao instalar Fly CLI: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Tente instalar manualmente:" -ForegroundColor Yellow
        Write-Host "  iwr https://fly.io/install.ps1 -useb | iex" -ForegroundColor White
        Write-Host ""
        Read-Host "Pressione Enter para sair"
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FAZENDO LOGIN NO FLY.IO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Abrindo navegador para login..." -ForegroundColor Yellow
Write-Host ""

try {
    fly auth login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERRO ao fazer login!" -ForegroundColor Red
        Write-Host "Tente novamente: fly auth login" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    
    Write-Host ""
    Write-Host "Login realizado com sucesso!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "ERRO ao fazer login: $_" -ForegroundColor Red
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FAZENDO DEPLOY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Iniciando deploy para producao..." -ForegroundColor Yellow
Write-Host "Isso pode levar alguns minutos..." -ForegroundColor Yellow
Write-Host ""

try {
    fly deploy
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "ERRO ao fazer deploy!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Verifique os logs: fly logs" -ForegroundColor Yellow
        Write-Host ""
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  DEPLOY CONCLUIDO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "Sua aplicacao esta disponivel em:" -ForegroundColor Cyan
    Write-Host "  https://visao-faturas.fly.dev/" -ForegroundColor White
    Write-Host ""
    
    $abrir = Read-Host "Deseja abrir a aplicacao no navegador? (s/n)"
    if ($abrir -eq "s") {
        fly open
    }
    
    Write-Host ""
    Write-Host "Comandos uteis:" -ForegroundColor Cyan
    Write-Host "  fly logs          - Ver logs em tempo real" -ForegroundColor White
    Write-Host "  fly status        - Ver status da aplicacao" -ForegroundColor White
    Write-Host "  fly open          - Abrir aplicacao no navegador" -ForegroundColor White
    Write-Host "  fly apps restart  - Reiniciar aplicacao" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "ERRO ao fazer deploy: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Tente novamente: fly deploy" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Pressione Enter para sair"
    exit 1
}

Write-Host ""
Write-Host "Teste as novas funcionalidades:" -ForegroundColor Cyan
Write-Host "  1. Acesse: https://visao-faturas.fly.dev/" -ForegroundColor White
Write-Host "  2. Login: daoliveira / 123456" -ForegroundColor White
Write-Host "  3. Va em 'Consultar a Prazo'" -ForegroundColor White
Write-Host "  4. Pressione F5 - deve permanecer na mesma pagina" -ForegroundColor White
Write-Host "  5. Teste os filtros automaticos (sem botao)" -ForegroundColor White
Write-Host ""

Read-Host "Pressione Enter para sair"
