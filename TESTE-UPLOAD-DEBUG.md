# 🔍 Debug do Upload de CSV

## ❌ Problema Atual

```
0 faturas importadas com sucesso. 27 erros encontrados
⚠️ Primeiros erros:
Linha 2: Cliente não especificado
Linha 3: Cliente não especificado
```

## 🔧 Solução Aplicada

### 1. Logs Adicionados no Backend

O backend agora mostra:
- Colunas detectadas no CSV
- Nome do cliente encontrado em cada linha
- Processo de busca/criação de cliente

### 2. Teste com Arquivo Limpo

Criado arquivo `teste-cliente-repetido.csv` com formato correto:

```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
HS TRANSPORTE,028.465,04/08/2025,1069.66
HS TRANSPORTE,028.824,11/08/2025,1843.65
```

## 🚀 Como Testar

### 1. Reiniciar o Servidor

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
node backend/server.js
```

### 2. Fazer Upload do Arquivo de Teste

1. Acesse: http://localhost:5000
2. Menu: **Faturas** → **Upload**
3. Selecione a **empresa**
4. Escolha: `teste-cliente-repetido.csv`
5. Clique em **Enviar**

### 3. Verificar Console do Servidor

O servidor deve mostrar:

```
[Upload] CSV lido. Total de linhas: 7
[Upload] Primeira linha: { CLIENTE: 'HS TRANSPORTE', ... }
[Upload] Colunas da primeira linha: [ 'CLIENTE', 'N° FATURA', 'DATA VECTO', 'VALOR' ]
[Upload] Processando linha 1: { CLIENTE: 'HS TRANSPORTE', ... }
[Upload] Nome do cliente encontrado: "HS TRANSPORTE"
[Upload] Criando novo cliente: HS TRANSPORTE (CPF temporário)
```

## 🔍 Possíveis Causas do Erro

### 1. Codificação do Arquivo

**Problema:** Arquivo com BOM ou codificação errada  
**Solução:** Salvar como UTF-8 sem BOM

### 2. Cabeçalho com Caracteres Especiais

**Problema:** `NÂ°` ao invés de `N°`  
**Solução:** Script já corrige isso

### 3. Colunas Não Reconhecidas

**Problema:** CSV parser não encontra coluna "CLIENTE"  
**Solução:** Backend agora busca em várias variações

## ✅ Verificações

### 1. Arquivo CSV Está Correto?

```bash
# Ver primeiras linhas
type teste-cliente-repetido.csv | Select-Object -First 5
```

Deve mostrar:
```
CLIENTE,N° FATURA,DATA VECTO,VALOR
HS TRANSPORTE,028.465,04/08/2025,1069.66
```

### 2. Servidor Está Rodando?

```bash
# Verificar se porta 5000 está em uso
netstat -ano | findstr :5000
```

### 3. Empresa Está Selecionada?

No formulário de upload, certifique-se de selecionar uma empresa.

## 🐛 Debug Passo a Passo

### 1. Verificar Logs do Servidor

Ao fazer upload, o console deve mostrar:

```
[Upload] Iniciando upload...
[Upload] Arquivo: { ... }
[Upload] Tipo de arquivo: csv
[Upload] Empresa ID: 1
[Upload] Processando CSV...
[Upload] CSV lido. Total de linhas: 7
[Upload] Colunas da primeira linha: [ 'CLIENTE', 'N° FATURA', 'DATA VECTO', 'VALOR' ]
```

### 2. Se Não Aparecer "Colunas da primeira linha"

O CSV não está sendo parseado corretamente.

**Solução:**
1. Verificar se arquivo tem extensão `.csv`
2. Verificar se está em UTF-8
3. Verificar se tem vírgulas separando as colunas

### 3. Se Aparecer "Cliente não especificado"

O backend não está encontrando a coluna CLIENTE.

**Solução:**
1. Verificar nome exato da coluna no CSV
2. Backend agora busca: `cliente_id`, `cliente`, `CLIENTE`, `['CLIENTE']`, `['cliente']`

## 📝 Teste Manual

### 1. Criar CSV Manualmente

Abra o Bloco de Notas e cole:

```
CLIENTE,N° FATURA,DATA VECTO,VALOR
TESTE CLIENTE,FAT-001,27/02/2026,100.00
```

Salve como `teste-manual.csv` (UTF-8)

### 2. Fazer Upload

Se funcionar, o problema está no arquivo gerado pelo script.

### 3. Comparar Arquivos

```powershell
# Ver bytes do arquivo
Get-Content teste-manual.csv -Encoding Byte | Select-Object -First 20
Get-Content teste-cliente-repetido.csv -Encoding Byte | Select-Object -First 20
```

## 🔧 Correções Aplicadas no Backend

### 1. Busca de Cliente Melhorada

```javascript
// ANTES
if (fatura.cliente || fatura.CLIENTE) {
  const nomeCliente = (fatura.cliente || fatura.CLIENTE).trim();
}

// DEPOIS
const nomeClienteRaw = fatura.cliente_id || 
                       fatura.cliente || 
                       fatura.CLIENTE || 
                       fatura['CLIENTE'] ||
                       fatura['cliente'];
```

### 2. Logs Adicionados

```javascript
console.log('[Upload] Colunas da primeira linha:', Object.keys(faturas[0]));
console.log(`[Upload] Nome do cliente encontrado: "${nomeClienteRaw}"`);
```

### 3. Validação Melhorada

```javascript
if (nomeClienteRaw && !isNaN(nomeClienteRaw)) {
  // É número = cliente_id
} else if (nomeClienteRaw) {
  // É texto = nome do cliente
} else {
  // Não tem cliente
  erros.push(`Linha ${index + 2}: Cliente não especificado`);
}
```

## 🎯 Próximos Passos

### 1. Reiniciar Servidor

```bash
# Parar (Ctrl+C)
node backend/server.js
```

### 2. Testar com Arquivo Limpo

Use `teste-cliente-repetido.csv`

### 3. Verificar Logs

Console do servidor deve mostrar o processamento

### 4. Se Funcionar

Problema está no arquivo gerado pelo script PowerShell

### 5. Se Não Funcionar

Verificar:
- Codificação do arquivo
- Formato das colunas
- Logs do servidor

## 📊 Resultado Esperado

```
✅ 7 faturas importadas com sucesso
✅ 3 clientes novos foram cadastrados automaticamente
```

Clientes criados:
- HS TRANSPORTE (3 faturas)
- DANILLO ALVES DE ABREU (2 faturas)
- JOSELIO OU JAIR (2 faturas)

## 🆘 Se Ainda Não Funcionar

1. Copie os logs do console do servidor
2. Verifique o conteúdo exato do CSV
3. Compare com o arquivo de teste

O problema está em:
- Codificação do arquivo
- Formato das colunas
- Nome das colunas no cabeçalho
