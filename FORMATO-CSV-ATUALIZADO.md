# Formato CSV Atualizado - Sistema de Faturas

## 📋 Formato Baseado na Sua Planilha

O sistema agora aceita o formato exato da sua planilha com as seguintes colunas:

### Colunas Aceitas (em qualquer ordem):

1. **CLIENTE** - Nome do cliente (obrigatório)
2. **LIMITE CRÉDITO** - Limite de crédito (opcional, ignorado)
3. **DATA FATURA** - Data da fatura (opcional, ignorado)
4. **N° FATURA** - Número da fatura
5. **N° NOTA FISCAL** - Número da nota fiscal (alternativa)
6. **N° BOLETO** - Número do boleto (alternativa)
7. **DATA VECTO** ou **DATA DE VENCIMENTO** - Data de vencimento (obrigatório)
8. **VALOR** - Valor da fatura (obrigatório)
9. **SIT** - Situação (PENDENTE, PAGO, VENCIDO)
10. **VALOR TOTAL** - Valor total (alternativa para VALOR)

**Observação:** DATA VECTO e DATA DE VENCIMENTO são a mesma coisa!

### Exemplo de CSV:

```csv
CLIENTE,LIMITE CRÉDITO,DATA FATURA,N° FATURA,N° NOTA FISCAL,N° BOLETO,DATA VECTO,VALOR,SIT,VALOR TOTAL
CARLOS ALBERTO DA SILVA,9999999,25/02/2026,HAVER,,,27/02/2026,148.02,PENDENTE,148.02
DIOGO ALVES DE OLIVEIRA,750.00,25/02/2026,REQUIS,,,04/03/2026,469.61,PENDENTE,469.61
ANA FRANCYELA GOMES VALADARES,9999999,25/02/2026,REQUIS,,,02/03/2026,2569.62,PAGO,2569.62
```

## 🔄 Conversão de Excel para CSV

Se seu arquivo está em formato Excel (.xlsx):

### Opção 1: Manual no Excel
1. Abra o arquivo no Excel
2. Vá em **Arquivo** → **Salvar Como**
3. Escolha **CSV (separado por vírgulas) (*.csv)**
4. Salve o arquivo

### Opção 2: Script PowerShell
Execute o script incluído:
```powershell
.\converter-excel-para-csv.ps1
```

## ✅ O Que o Sistema Faz Automaticamente:

1. **Busca Cliente por Nome**
   - Procura o cliente pelo nome na coluna CLIENTE
   - Se não encontrar, cria automaticamente

2. **Aceita Múltiplos Formatos de Data**
   - DD/MM/YYYY (ex: 27/02/2026)
   - YYYY-MM-DD (ex: 2026-02-27)

3. **Aceita Múltiplos Formatos de Valor**
   - Com ponto de milhar: 1.500,00
   - Sem ponto de milhar: 1500,00
   - Formato americano: 1500.00

4. **Número da Fatura Flexível**
   - Usa N° FATURA se disponível
   - Senão, usa N° NOTA FISCAL
   - Senão, usa N° BOLETO
   - Se nenhum, gera automaticamente

5. **Status Automático**
   - PENDENTE → pendente
   - PAGO/QUITADO → pago
   - VENCIDO → vencido

## 📊 Colunas Obrigatórias:

- ✅ **CLIENTE** - Nome do cliente
- ✅ **DATA VECTO** - Data de vencimento
- ✅ **VALOR** ou **VALOR TOTAL** - Valor da fatura

## 📊 Colunas Opcionais:

- N° FATURA / N° NOTA FISCAL / N° BOLETO (pelo menos uma)
- SIT (situação)
- Todas as outras colunas são ignoradas

## 🚀 Como Usar:

1. Prepare seu arquivo CSV com as colunas acima
2. Acesse o sistema
3. Vá em **Faturas** → **Upload de Faturas**
4. Selecione o arquivo CSV
5. Selecione a **Empresa**
6. Clique em **Fazer Upload**

## ✨ Resultado:

```
✅ 150 faturas importadas com sucesso
✅ 45 clientes novos cadastrados automaticamente
```

## 🔍 Logs Detalhados:

O sistema mostra logs no console do servidor:

```
[Upload] CSV lido. Total de linhas: 150
[Upload] Clientes encontrados: 105
[Upload] Criando novo cliente: JOÃO DA SILVA
[Upload] Cliente criado com ID: 106
[Upload] Processando fatura 1: { clienteId: 106, numeroFatura: 'HAVER', valorFatura: 148.02, ... }
```

## ⚠️ Observações:

- O sistema ignora colunas que não são necessárias (LIMITE CRÉDITO, DATA FATURA, etc.)
- Clientes são criados com CPF temporário se não informado
- Você pode editar os clientes depois para adicionar CPF/CNPJ correto
- O arquivo deve estar em formato CSV, não Excel (.xlsx)

## 📁 Arquivos de Exemplo:

- `exemplo-formato-real.csv` - Formato baseado na sua planilha
- `exemplo-faturas-completo.csv` - Formato alternativo
- `exemplo-faturas.csv` - Formato simples
