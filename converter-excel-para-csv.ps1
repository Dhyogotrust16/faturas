# Script para converter Excel (.xlsx) para CSV
# Uso: .\converter-excel-para-csv.ps1

Write-Host "Convertendo arquivo Excel para CSV..." -ForegroundColor Cyan

# Verificar se o arquivo dados.csv é realmente um Excel
$arquivo = "dados.csv"
if (Test-Path $arquivo) {
    $bytes = [System.IO.File]::ReadAllBytes($arquivo)[0..1]
    $header = [System.Text.Encoding]::ASCII.GetString($bytes)
    
    if ($header -eq "PK") {
        Write-Host "Arquivo detectado como Excel (.xlsx)" -ForegroundColor Yellow
        
        # Renomear para .xlsx
        $novoNome = "dados.xlsx"
        if (Test-Path $novoNome) {
            Remove-Item $novoNome -Force
        }
        Copy-Item $arquivo $novoNome
        
        Write-Host "Arquivo renomeado para: $novoNome" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para converter para CSV:" -ForegroundColor Cyan
        Write-Host "1. Abra o arquivo dados.xlsx no Excel"
        Write-Host "2. Vá em Arquivo > Salvar Como"
        Write-Host "3. Escolha o formato 'CSV (separado por vírgulas) (*.csv)'"
        Write-Host "4. Salve como 'dados-convertido.csv'"
        Write-Host ""
        Write-Host "Ou use este comando PowerShell:" -ForegroundColor Yellow
        Write-Host '$excel = New-Object -ComObject Excel.Application'
        Write-Host '$wb = $excel.Workbooks.Open("' + (Get-Location).Path + '\dados.xlsx")'
        Write-Host '$wb.SaveAs("' + (Get-Location).Path + '\dados-convertido.csv", 6)'
        Write-Host '$wb.Close()'
        Write-Host '$excel.Quit()'
    } else {
        Write-Host "Arquivo já está em formato CSV" -ForegroundColor Green
    }
} else {
    Write-Host "Arquivo dados.csv não encontrado!" -ForegroundColor Red
}
