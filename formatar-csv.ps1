# Script para formatar CSV - Converte colunas A, B, C, D em formato CSV correto
# Suporta linhas onde o cliente esta vazio (usa o cliente da linha anterior)
# Uso: .\formatar-csv.ps1 arquivo-entrada.csv

param(
    [Parameter(Mandatory=$false)]
    [string]$InputFile = "exemplo-formato-real.csv"
)

Write-Host "=== FORMATADOR DE CSV PARA FATURAS ===" -ForegroundColor Cyan
Write-Host ""

# Verificar se o arquivo existe
if (-not (Test-Path $InputFile)) {
    Write-Host "[ERRO] Arquivo nao encontrado: $InputFile" -ForegroundColor Red
    Write-Host ""
    Write-Host "Uso: .\formatar-csv.ps1 arquivo.csv" -ForegroundColor Yellow
    exit 1
}

# Nome do arquivo de saída
$OutputFile = $InputFile -replace '\.csv$', '-formatado.csv'

Write-Host "[OK] Arquivo de entrada: $InputFile" -ForegroundColor Green
Write-Host "[OK] Arquivo de saida: $OutputFile" -ForegroundColor Green
Write-Host ""

try {
    # Ler o arquivo
    $content = Get-Content $InputFile -Encoding UTF8
    
    # Array para armazenar as linhas formatadas
    $formattedLines = @()
    
    # Adicionar cabeçalho
    $formattedLines += "CLIENTE,N° FATURA,DATA VECTO,VALOR"
    
    $lineNumber = 0
    $processedCount = 0
    $skippedCount = 0
    $ultimoCliente = ""
    $clientesRepetidos = 0
    
    foreach ($line in $content) {
        $lineNumber++
        
        # Pular primeira linha (cabeçalho original)
        if ($lineNumber -eq 1) {
            continue
        }
        
        # Pular linhas vazias
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }
        
        # Remover caracteres especiais e limpar
        $line = $line -replace '[^\x20-\x7E\u00C0-\u00FF]', ''
        
        # Dividir por ponto e vírgula ou tabulação
        $allColumns = $line -split '[;\t]'
        
        # Remover colunas vazias mas manter a estrutura
        $columns = @()
        foreach ($col in $allColumns) {
            $trimmed = $col.Trim()
            if ($trimmed -ne '') {
                $columns += $trimmed
            }
        }
        
        # Verificar se tem pelo menos 3 colunas
        if ($columns.Count -lt 3) {
            Write-Host "[AVISO] Linha $lineNumber ignorada (colunas insuficientes: $($columns.Count))" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Detectar se a primeira coluna é um número (indica que não tem cliente)
        $primeiraColuna = $columns[0]
        $ehNumero = $primeiraColuna -match '^\d'
        
        if ($ehNumero) {
            # Primeira coluna é número = não tem cliente, usar o anterior
            if ([string]::IsNullOrWhiteSpace($ultimoCliente)) {
                Write-Host "[AVISO] Linha $lineNumber ignorada (sem cliente anterior)" -ForegroundColor Yellow
                $skippedCount++
                continue
            }
            
            $cliente = $ultimoCliente
            $numeroFatura = $columns[0]
            $dataVecto = $columns[1]
            $valor = if ($columns.Count -ge 3) { $columns[2] } else { "" }
            
            $clientesRepetidos++
            Write-Host "[INFO] Linha $lineNumber - cliente repetido: '$cliente'" -ForegroundColor Cyan
        } else {
            # Primeira coluna é texto = tem cliente
            $cliente = $columns[0]
            $numeroFatura = if ($columns.Count -ge 2) { $columns[1] } else { "" }
            $dataVecto = if ($columns.Count -ge 3) { $columns[2] } else { "" }
            $valor = if ($columns.Count -ge 4) { $columns[3] } else { "" }
            
            # Atualizar último cliente válido
            $ultimoCliente = $cliente
        }
        
        # Limpar valor (remover espaços extras)
        $valor = $valor -replace '\s+', ''
        
        # Formatar linha CSV (escapar aspas se necessário)
        if ($cliente -match '[,"]') {
            $cliente = "`"$($cliente -replace '"', '""')`""
        }
        if ($numeroFatura -match '[,"]') {
            $numeroFatura = "`"$($numeroFatura -replace '"', '""')`""
        }
        
        $csvLine = "$cliente,$numeroFatura,$dataVecto,$valor"
        $formattedLines += $csvLine
        
        $processedCount++
        
        # Mostrar progresso a cada 10 linhas
        if ($processedCount % 10 -eq 0) {
            Write-Host "[INFO] Processadas $processedCount linhas..." -ForegroundColor Gray
        }
    }
    
    # Salvar arquivo formatado
    $formattedLines | Out-File -FilePath $OutputFile -Encoding UTF8
    
    Write-Host ""
    Write-Host "[SUCESSO] Conversao concluida!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Estatisticas:" -ForegroundColor Cyan
    Write-Host "  - Linhas processadas: $processedCount" -ForegroundColor White
    Write-Host "  - Linhas com cliente repetido: $clientesRepetidos" -ForegroundColor White
    Write-Host "  - Linhas ignoradas: $skippedCount" -ForegroundColor White
    Write-Host ""
    Write-Host "[OK] Arquivo salvo em: $OutputFile" -ForegroundColor Green
    Write-Host ""
    Write-Host "Agora voce pode fazer upload do arquivo formatado no sistema!" -ForegroundColor Cyan
    
} catch {
    Write-Host ""
    Write-Host "[ERRO] Erro ao processar arquivo: $_" -ForegroundColor Red
    exit 1
}
