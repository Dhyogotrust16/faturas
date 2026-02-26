# Script SIMPLES para converter Excel/CSV para formato correto
# Lê arquivo com colunas A, B, C, D e converte para CSV com vírgulas

param(
    [Parameter(Mandatory=$false)]
    [string]$InputFile
)

Write-Host ""
Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   CONVERSOR DE CSV PARA SISTEMA FATURAS   ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Se não especificou arquivo, pedir
if ([string]::IsNullOrWhiteSpace($InputFile)) {
    Write-Host "Arraste o arquivo CSV aqui e pressione ENTER:" -ForegroundColor Yellow
    Write-Host "(ou digite o caminho do arquivo)" -ForegroundColor Gray
    Write-Host ""
    $InputFile = Read-Host "Arquivo"
    $InputFile = $InputFile.Trim('"').Trim("'")
}

# Verificar se existe
if (-not (Test-Path $InputFile)) {
    Write-Host ""
    Write-Host "❌ Arquivo não encontrado!" -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

# Nome do arquivo de saída
$fileName = [System.IO.Path]::GetFileNameWithoutExtension($InputFile)
$directory = [System.IO.Path]::GetDirectoryName($InputFile)
if ([string]::IsNullOrWhiteSpace($directory)) {
    $directory = "."
}
$OutputFile = Join-Path $directory "$fileName-pronto.csv"

Write-Host ""
Write-Host "📂 Processando: $InputFile" -ForegroundColor Green
Write-Host ""

try {
    # Ler todas as linhas
    $lines = Get-Content $InputFile -Encoding UTF8
    
    # Array para resultado
    $result = @()
    
    # Cabeçalho
    $result += "CLIENTE,N° FATURA,DATA VECTO,VALOR"
    
    $count = 0
    $linha = 0
    $ultimoCliente = ""
    $clientesRepetidos = 0
    
    foreach ($line in $lines) {
        $linha++
        
        # Pular primeira linha (cabeçalho)
        if ($linha -eq 1) { continue }
        
        # Pular vazias
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        
        # Limpar caracteres estranhos
        $line = $line -replace '[^\x20-\x7E\u00C0-\u00FF]', ''
        
        # Separar por ; ou tab
        $allParts = $line -split '[;\t]'
        
        # Remover vazios mas manter estrutura
        $parts = @()
        foreach ($p in $allParts) {
            $trimmed = $p.Trim()
            if ($trimmed -ne '') {
                $parts += $trimmed
            }
        }
        
        # Precisa ter pelo menos 3 partes
        if ($parts.Count -lt 3) { continue }
        
        # Detectar se primeira coluna é número (sem cliente)
        $primeiraColuna = $parts[0]
        $ehNumero = $primeiraColuna -match '^\d'
        
        if ($ehNumero) {
            # Sem cliente, usar o anterior
            if ([string]::IsNullOrWhiteSpace($ultimoCliente)) {
                continue
            }
            
            $col1 = $ultimoCliente
            $col2 = $parts[0]
            $col3 = $parts[1]
            $col4 = if ($parts.Count -ge 3) { $parts[2] } else { "" }
            
            $clientesRepetidos++
            Write-Host "  [+] Linha $linha - cliente repetido: '$col1'" -ForegroundColor Cyan
        } else {
            # Com cliente
            $col1 = $parts[0]
            $col2 = if ($parts.Count -ge 2) { $parts[1] } else { "" }
            $col3 = if ($parts.Count -ge 3) { $parts[2] } else { "" }
            $col4 = if ($parts.Count -ge 4) { $parts[3] } else { "" }
            
            # Atualizar último cliente
            $ultimoCliente = $col1
        }
        
        # Escapar vírgulas no nome do cliente (colocar entre aspas)
        if ($col1 -match ',') {
            $col1 = "`"$col1`""
        }
        
        # Montar linha CSV
        $csvLine = "$col1,$col2,$col3,$col4"
        $result += $csvLine
        
        $count++
    }
    
    # Salvar arquivo
    $result | Out-File -FilePath $OutputFile -Encoding UTF8 -NoNewline:$false
    
    Write-Host "✅ Conversão concluída!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Total de registros: $count" -ForegroundColor Cyan
    if ($clientesRepetidos -gt 0) {
        Write-Host "📊 Clientes repetidos (linhas sem cliente): $clientesRepetidos" -ForegroundColor Cyan
    }
    Write-Host ""
    Write-Host "💾 Arquivo salvo em:" -ForegroundColor Yellow
    Write-Host "   $OutputFile" -ForegroundColor White
    Write-Host ""
    Write-Host "🚀 Agora faça upload deste arquivo no sistema!" -ForegroundColor Green
    Write-Host ""
    
    # Perguntar se quer abrir a pasta
    $open = Read-Host "Deseja abrir a pasta do arquivo? (S/N)"
    if ($open -eq 'S' -or $open -eq 's') {
        explorer.exe (Split-Path $OutputFile -Parent)
    }
    
} catch {
    Write-Host ""
    Write-Host "❌ Erro: $_" -ForegroundColor Red
    Write-Host ""
    pause
    exit 1
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
pause
