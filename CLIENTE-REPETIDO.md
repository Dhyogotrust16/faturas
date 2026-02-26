# 🔄 Cliente Repetido - Linhas sem Cliente

## 📋 Funcionalidade

Quando o campo CLIENTE está vazio, significa que aquela fatura pertence ao mesmo cliente da linha anterior.

### Exemplo no Excel:

| CLIENTE | N° FATURA | DATA VECTO | VALOR |
|---------|-----------|------------|-------|
| HS TRANSPORTE | 028.465 | 04/08/2025 | 1069,66 |
| | 028.824 | 11/08/2025 | 1843,65 |
| | 029.425 | 18/08/2025 | 2105,99 |

### Resultado Após Conversão:

```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
HS TRANSPORTE,028.465,04/08/2025,1069.66
HS TRANSPORTE,028.824,11/08/2025,1843.65
HS TRANSPORTE,029.425,18/08/2025,2105.99
```

---

## 🔧 Como Funciona

### 1. Detecção Automática

O script detecta quando uma linha não tem cliente:
- Se a primeira coluna começa com número → Não tem cliente
- Se a primeira coluna começa com letra → Tem cliente

### 2. Preenchimento Automático

Quando não tem cliente:
- Usa o nome do último cliente válido
- Preenche automaticamente na linha
- Continua até encontrar um novo cliente

### 3. Exemplo Completo

#### Arquivo Original:
```
CLIENTE;N° FATURA;DATA VECTO;VALOR
DANILLO ALVES DE ABREU;;;017.718;05/02/2025;;1.835,18
;;;019.452;03/03/2025;;526,26
HS TRANSPORTE;;;028.465;04/08/2025;;1.069,66
;;;028.824;11/08/2025;;1.843,65
;;;029.425;18/08/2025;;2.105,99
JOSELIO OU JAIR;;;002.317;30/04/2024;;1.997,28
;;;033.525;24/11/2025;;2.231,33
```

#### Após Conversão:
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
DANILLO ALVES DE ABREU,017.718,05/02/2025,1835.18
DANILLO ALVES DE ABREU,019.452,03/03/2025,526.26
HS TRANSPORTE,028.465,04/08/2025,1069.66
HS TRANSPORTE,028.824,11/08/2025,1843.65
HS TRANSPORTE,029.425,18/08/2025,2105.99
JOSELIO OU JAIR,002.317,30/04/2024,1997.28
JOSELIO OU JAIR,033.525,24/11/2025,2231.33
```

---

## 📊 Estatísticas

Ao executar o script, você verá:

```
[INFO] Linha 6 - cliente repetido: 'DANILLO ALVES DE ABREU'
[INFO] Linha 11 - cliente repetido: 'HS TRANSPORTE'
[INFO] Linha 12 - cliente repetido: 'HS TRANSPORTE'
[INFO] Linha 16 - cliente repetido: 'JOSELIO OU JAIR'

Estatisticas:
  - Linhas processadas: 27
  - Linhas com cliente repetido: 7
  - Linhas ignoradas: 0
```

---

## ✅ Vantagens

### 1. Menos Digitação
Não precisa repetir o nome do cliente em cada linha

### 2. Arquivo Mais Limpo
Visualmente mais organizado no Excel

### 3. Conversão Automática
Script preenche automaticamente

### 4. Sem Erros
Garante que o cliente está correto (usa o anterior)

---

## ⚠️ Regras Importantes

### 1. Primeira Linha Deve Ter Cliente
```
✅ CORRETO:
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
JOÃO DA SILVA,FAT-002,04/03/2026,469.61

❌ ERRADO:
,FAT-001,27/02/2026,148.02  ← Primeira linha sem cliente
,FAT-002,04/03/2026,469.61
```

### 2. Linhas Vazias Resetam
```
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
JOÃO DA SILVA,FAT-002,04/03/2026,469.61
[linha vazia]
,FAT-003,15/03/2026,1500.00  ← Será ignorada (sem cliente anterior)
```

### 3. Novo Cliente Reseta
```
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
JOÃO DA SILVA,FAT-002,04/03/2026,469.61
MARIA SANTOS,FAT-003,15/03/2026,1500.00  ← Novo cliente
MARIA SANTOS,FAT-004,20/03/2026,2500.00  ← Usa MARIA SANTOS
```

---

## 🎯 Casos de Uso

### Caso 1: Cliente com Múltiplas Faturas

**Excel:**
```
LEANDRO MARTINELLI | 027.410 | 31/07/2025 | 28.633,51
                   | 027.814 | 07/08/2025 | 25.356,45
                   | 028.397 | 14/08/2025 | 15.308,32
```

**CSV Gerado:**
```csv
LEANDRO MARTINELLI,027.410,31/07/2025,28633.51
LEANDRO MARTINELLI,027.814,07/08/2025,25356.45
LEANDRO MARTINELLI,028.397,14/08/2025,15308.32
```

### Caso 2: Vários Clientes com Múltiplas Faturas

**Excel:**
```
HS TRANSPORTE | 028.465 | 04/08/2025 | 1.069,66
              | 028.824 | 11/08/2025 | 1.843,65
              | 029.425 | 18/08/2025 | 2.105,99
JOSELIO OU JAIR | 002.317 | 30/04/2024 | 1.997,28
                | 033.525 | 24/11/2025 | 2.231,33
```

**CSV Gerado:**
```csv
HS TRANSPORTE,028.465,04/08/2025,1069.66
HS TRANSPORTE,028.824,11/08/2025,1843.65
HS TRANSPORTE,029.425,18/08/2025,2105.99
JOSELIO OU JAIR,002.317,30/04/2024,1997.28
JOSELIO OU JAIR,033.525,24/11/2025,2231.33
```

---

## 🔍 Como o Script Detecta

### Lógica de Detecção:

```powershell
# Se primeira coluna começa com número
if ($primeiraColuna -match '^\d') {
    # Não tem cliente, usar o anterior
    $cliente = $ultimoCliente
} else {
    # Tem cliente, usar este
    $cliente = $primeiraColuna
    $ultimoCliente = $cliente
}
```

### Exemplos:

```
"028.465" → Começa com número → Sem cliente
"HS TRANSPORTE" → Começa com letra → Com cliente
"002.317" → Começa com número → Sem cliente
"JOÃO DA SILVA" → Começa com letra → Com cliente
```

---

## 📝 Exemplo Real Completo

### Arquivo Original (exemplo-formato-real.csv):

```
CLIENTE,N° FATURA,DATA VECTO,VALOR;;;;;;;
AFS LOCAÇÕES;;;033.523;22/12/2025;;786,24;
DANILLO ALVES DE ABREU;;;017.718;05/02/2025;;1.835,18;
;;;019.452;03/03/2025;;526,26;
HS TRANSPORTE;;;028.465;04/08/2025;;1.069,66;
;;;028.824;11/08/2025;;1.843,65;
;;;029.425;18/08/2025;;2.105,99;
```

### Executar Script:

```powershell
.\formatar-csv.ps1 exemplo-formato-real.csv
```

### Resultado (exemplo-formato-real-formatado.csv):

```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
AFS LOCAÇÕES,033.523,22/12/2025,786.24
DANILLO ALVES DE ABREU,017.718,05/02/2025,1835.18
DANILLO ALVES DE ABREU,019.452,03/03/2025,526.26
HS TRANSPORTE,028.465,04/08/2025,1069.66
HS TRANSPORTE,028.824,11/08/2025,1843.65
HS TRANSPORTE,029.425,18/08/2025,2105.99
```

---

## 🚀 Upload no Sistema

Após a conversão, o arquivo está pronto para upload:

1. Acesse: http://localhost:5000
2. Menu: **Faturas** → **Upload**
3. Selecione a **empresa**
4. Escolha o arquivo **exemplo-formato-real-formatado.csv**
5. Clique em **Enviar**

### Resultado:

```
✅ 6 faturas importadas com sucesso
✅ 3 clientes novos foram cadastrados automaticamente
```

O sistema irá:
- Criar cliente "AFS LOCAÇÕES" com 1 fatura
- Criar cliente "DANILLO ALVES DE ABREU" com 2 faturas
- Criar cliente "HS TRANSPORTE" com 3 faturas

---

## ✅ Resumo

### O Que o Script Faz:
- ✅ Detecta linhas sem cliente
- ✅ Preenche com o cliente anterior
- ✅ Mantém a ordem correta
- ✅ Gera CSV válido

### O Que Você Precisa Fazer:
- ✅ Exportar do Excel
- ✅ Executar o script
- ✅ Fazer upload

### O Que o Sistema Faz:
- ✅ Importa todas as faturas
- ✅ Cria clientes automaticamente
- ✅ Vincula faturas aos clientes corretos

---

## 🎉 Pronto!

Agora você pode ter múltiplas faturas para o mesmo cliente sem precisar repetir o nome em cada linha! O script cuida de tudo automaticamente. 🚀
