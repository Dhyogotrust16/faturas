# 📝 Como Converter Arquivo CSV para Upload

## 🎯 Problema

Seu arquivo vem assim (colunas separadas sem vírgulas):
```
COLUNA A          COLUNA B      COLUNA C        COLUNA D
JOÃO DA SILVA     FAT-001       27/02/2026      148.02
MARIA SANTOS      FAT-002       04/03/2026      469.61
```

Precisa ficar assim (CSV com vírgulas):
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
MARIA SANTOS,FAT-002,04/03/2026,469.61
```

---

## ✅ Solução Automática (RECOMENDADO)

### Método 1: Script Interativo (Mais Fácil)

1. **Localize o arquivo:**
   ```
   converter-excel-para-csv-simples.ps1
   ```

2. **Clique com botão direito** no arquivo

3. **Selecione:** "Executar com PowerShell"

4. **Arraste seu arquivo CSV** para a janela que abrir

5. **Pressione ENTER**

6. **Pronto!** Arquivo convertido será salvo como `seu-arquivo-pronto.csv`

### Método 2: Linha de Comando

```powershell
.\converter-excel-para-csv-simples.ps1 seu-arquivo.csv
```

---

## 📋 Passo a Passo Detalhado

### 1️⃣ Exportar do Excel

Se seu arquivo está no Excel:

1. Abra o arquivo no Excel
2. Vá em **Arquivo** → **Salvar Como**
3. Escolha o tipo: **CSV (separado por vírgulas) (*.csv)**
4. Salve na pasta do projeto

### 2️⃣ Converter o Arquivo

**Opção A - Duplo Clique:**
1. Clique com botão direito em `converter-excel-para-csv-simples.ps1`
2. Escolha "Executar com PowerShell"
3. Arraste seu arquivo CSV para a janela
4. Pressione ENTER

**Opção B - PowerShell:**
1. Abra PowerShell na pasta do projeto
2. Execute:
   ```powershell
   .\converter-excel-para-csv-simples.ps1 seu-arquivo.csv
   ```

### 3️⃣ Resultado

O script cria um novo arquivo:
```
seu-arquivo-pronto.csv
```

Este arquivo está no formato correto para upload!

### 4️⃣ Fazer Upload

1. Acesse o sistema: http://localhost:5000
2. Vá em **Faturas** → **Upload**
3. Selecione a **empresa**
4. Escolha o arquivo **seu-arquivo-pronto.csv**
5. Clique em **Enviar**
6. Aguarde o processamento
7. Pronto! ✅

---

## 🔧 Solução Manual (Se Preferir)

### No Excel

1. Abra seu arquivo no Excel
2. Selecione as 4 primeiras colunas (A, B, C, D)
3. Copie (Ctrl+C)
4. Abra um novo arquivo
5. Cole (Ctrl+V)
6. Adicione cabeçalho na primeira linha:
   ```
   CLIENTE,N° FATURA,DATA VECTO,VALOR
   ```
7. Salve como CSV

### No Bloco de Notas

1. Abra seu arquivo no Bloco de Notas
2. Use "Localizar e Substituir" (Ctrl+H)
3. Substitua os separadores por vírgulas:
   - Se usa ponto e vírgula: `;` → `,`
   - Se usa tabulação: `[TAB]` → `,`
4. Adicione cabeçalho:
   ```
   CLIENTE,N° FATURA,DATA VECTO,VALOR
   ```
5. Salve o arquivo

---

## 📊 Formato Esperado

### Estrutura do CSV

```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
CARLOS ALBERTO DA SILVA,HAVER,27/02/2026,148.02
DIOGO ALVES DE OLIVEIRA,REQUIS,04/03/2026,469.61
ANA FRANCYELA GOMES VALADARES,REQUIS,02/03/2026,2569.62
```

### Regras

✅ **Cabeçalho obrigatório:** `CLIENTE,N° FATURA,DATA VECTO,VALOR`  
✅ **4 colunas separadas por vírgula**  
✅ **Data no formato:** DD/MM/YYYY  
✅ **Valor pode ter:** vírgula ou ponto decimal  
✅ **Sem linhas vazias** entre os dados  

---

## 🎯 Exemplos de Conversão

### Antes (arquivo original)
```
CLIENTE;N° FATURA;DATA VECTO;VALOR
JOÃO DA SILVA;;;FAT-001;27/02/2026;;148,02
MARIA SANTOS;;;FAT-002;04/03/2026;;469,61
```

### Depois (arquivo convertido)
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
MARIA SANTOS,FAT-002,04/03/2026,469.61
```

---

## ⚠️ Problemas Comuns

### Erro: "Arquivo não encontrado"
**Solução:** Verifique se o caminho do arquivo está correto

### Erro: "Colunas insuficientes"
**Solução:** Certifique-se que o arquivo tem 4 colunas (A, B, C, D)

### Caracteres estranhos no arquivo
**Solução:** O script remove automaticamente caracteres especiais

### Linhas vazias no resultado
**Solução:** O script pula linhas vazias automaticamente

---

## 🚀 Scripts Disponíveis

### 1. converter-excel-para-csv-simples.ps1
- ✅ **Mais fácil de usar**
- ✅ Interface interativa
- ✅ Arrasta e solta o arquivo
- ✅ Abre a pasta do resultado
- 🎯 **RECOMENDADO**

### 2. formatar-csv.ps1
- ✅ Mais opções de configuração
- ✅ Relatório detalhado
- ✅ Estatísticas de processamento
- 🎯 Para usuários avançados

### 3. converter-excel-para-csv.ps1 (original)
- ✅ Converte direto do Excel
- ✅ Requer Excel instalado
- 🎯 Se preferir trabalhar com .xlsx

---

## 📝 Exemplo Completo

### 1. Seu arquivo original (exemplo-dados.csv)
```
CLIENTE;N° FATURA;DATA VECTO;VALOR
JOÃO DA SILVA;;;FAT-001;27/02/2026;;148,02
MARIA SANTOS;;;FAT-002;04/03/2026;;469,61
PEDRO OLIVEIRA;;;FAT-003;15/03/2026;;1.500,00
```

### 2. Executar conversor
```powershell
.\converter-excel-para-csv-simples.ps1 exemplo-dados.csv
```

### 3. Resultado (exemplo-dados-pronto.csv)
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
MARIA SANTOS,FAT-002,04/03/2026,469.61
PEDRO OLIVEIRA,FAT-003,15/03/2026,1.500,00
```

### 4. Upload no sistema
- Arquivo: `exemplo-dados-pronto.csv`
- Empresa: Selecionar da lista
- Resultado: 3 faturas importadas ✅

---

## ✅ Checklist

Antes de fazer upload, verifique:

- [ ] Arquivo tem extensão `.csv`
- [ ] Primeira linha é o cabeçalho
- [ ] Colunas separadas por vírgula
- [ ] Datas no formato DD/MM/YYYY
- [ ] Sem linhas vazias no meio
- [ ] Todos os clientes têm nome
- [ ] Arquivo salvo em UTF-8

---

## 🎉 Pronto!

Agora você pode converter qualquer arquivo e fazer upload no sistema!

### Fluxo Completo
```
1. Exportar do Excel → CSV
2. Executar conversor
3. Fazer upload no sistema
4. Sistema processa automaticamente
5. Faturas importadas! ✅
```

### Dúvidas?

Consulte a documentação completa:
- `SISTEMA-PRONTO.md` - Guia completo
- `GUIA-RÁPIDO.md` - Referência rápida
- `CONVERSÕES-AUTOMÁTICAS.md` - Conversões do sistema
