# 📤 Upload Direto do Excel - SEM Scripts!

## 🎯 Novidade: Sistema Converte Automaticamente!

Agora você pode fazer upload do arquivo CSV diretamente do Excel, **sem precisar usar scripts PowerShell**!

O sistema detecta e converte automaticamente:
- ✅ Colunas A, B, C, D
- ✅ Clientes vazios (usa o anterior)
- ✅ Datas em formato Excel
- ✅ Valores com vírgula ou ponto

---

## 🚀 Como Usar (3 Passos Simples)

### 1. Exportar do Excel

1. Abra seu arquivo no Excel
2. **Arquivo** → **Salvar Como**
3. Tipo: **CSV (separado por vírgulas) (*.csv)**
4. Salvar

### 2. Fazer Upload no Sistema

1. Acesse: http://localhost:5000
2. Menu: **Faturas** → **Upload**
3. Selecione a **empresa**
4. Escolha o arquivo CSV
5. Clique em **Enviar**

### 3. Pronto!

O sistema faz tudo automaticamente:
- ✅ Detecta as colunas
- ✅ Preenche clientes vazios
- ✅ Converte datas
- ✅ Converte valores
- ✅ Cria clientes automaticamente
- ✅ Importa todas as faturas

---

## 📊 Formato do Excel

### Seu Arquivo Pode Estar Assim:

| A (CLIENTE) | B (N° FATURA) | C (DATA VECTO) | D (VALOR) |
|-------------|---------------|----------------|-----------|
| HS TRANSPORTE | 028.465 | 04/08/2025 | 1069,66 |
| | 028.824 | 11/08/2025 | 1843,65 |
| | 029.425 | 18/08/2025 | 2105,99 |
| JOSELIO OU JAIR | 002.317 | 30/04/2024 | 1997,28 |
| | 033.525 | 24/11/2025 | 2231,33 |

### O Sistema Entende Automaticamente:

- **Coluna A vazia** = Usa o cliente da linha anterior
- **Datas em número** (46013) = Converte automaticamente
- **Valores com vírgula** (1.069,66) = Converte para ponto
- **Primeira linha** = Cabeçalho (ignora)

---

## 🔄 O Que o Sistema Faz Automaticamente

### 1. Detecta as Colunas

O sistema procura por:
- **Cliente:** Coluna com "CLIENTE" ou primeira coluna (A)
- **N° Fatura:** Coluna com "FATURA" ou "N°" ou segunda coluna (B)
- **Data:** Coluna com "DATA" ou "VECTO" ou terceira coluna (C)
- **Valor:** Coluna com "VALOR" ou quarta coluna (D)

### 2. Preenche Clientes Vazios

```
HS TRANSPORTE | 028.465 | 04/08/2025 | 1069,66
              | 028.824 | 11/08/2025 | 1843,65  ← Usa "HS TRANSPORTE"
              | 029.425 | 18/08/2025 | 2105,99  ← Usa "HS TRANSPORTE"
```

### 3. Converte Datas

```
46013 → 22/12/2025
45985 → 24/11/2025
04/08/2025 → 04/08/2025 (já está correto)
```

### 4. Converte Valores

```
1.069,66 → 1069.66
1069.66 → 1069.66
R$ 1.500,00 → 1500.00
```

### 5. Cria Clientes

Se o cliente não existir no sistema:
- Cria automaticamente
- CPF temporário (pode editar depois)
- Vincula todas as faturas

---

## ✅ Exemplo Completo

### Seu Excel:

```
CLIENTE,NÂ° FATURA,DATA VECTO,VALOR
AFS LOCAÇÕES,033.523,46013,786,24
DANILLO ALVES DE ABREU,017.718,45693,1835,18
,019.452,45719,526,26
HS TRANSPORTE,028.465,45873,1069,66
,028.824,45880,1843,65
,029.425,45887,2105,99
```

### Após Upload:

```
✅ 6 faturas importadas com sucesso
✅ 3 clientes novos foram cadastrados automaticamente
```

### Resultado no Sistema:

| Cliente | N° Fatura | Data Vecto | Valor | Status |
|---------|-----------|------------|-------|--------|
| AFS LOCAÇÕES | 033.523 | 22/12/2025 | R$ 786,24 | pendente |
| DANILLO ALVES DE ABREU | 017.718 | 05/02/2025 | R$ 1.835,18 | pendente |
| DANILLO ALVES DE ABREU | 019.452 | 03/03/2025 | R$ 526,26 | pendente |
| HS TRANSPORTE | 028.465 | 04/08/2025 | R$ 1.069,66 | pendente |
| HS TRANSPORTE | 028.824 | 11/08/2025 | R$ 1.843,65 | pendente |
| HS TRANSPORTE | 029.425 | 18/08/2025 | R$ 2.105,99 | pendente |

---

## 📝 Regras Importantes

### 1. Primeira Linha = Cabeçalho

A primeira linha é sempre ignorada (cabeçalho).

### 2. Cliente Vazio = Usa o Anterior

Se a coluna A estiver vazia, o sistema usa o cliente da linha anterior.

### 3. Primeira Fatura Deve Ter Cliente

```
✅ CORRETO:
HS TRANSPORTE,028.465,04/08/2025,1069.66
,028.824,11/08/2025,1843.65

❌ ERRADO:
,028.465,04/08/2025,1069.66  ← Primeira linha sem cliente
,028.824,11/08/2025,1843.65
```

### 4. Empresa Obrigatória

Sempre selecione a empresa no formulário de upload.

---

## ⚠️ Problemas Comuns

### Erro: "Cliente não especificado"

**Causa:** Primeira linha de dados sem cliente  
**Solução:** Certifique-se que a primeira fatura tem o nome do cliente

### Erro: "Colunas insuficientes"

**Causa:** Arquivo não tem 4 colunas  
**Solução:** Verifique se o Excel tem colunas A, B, C, D

### Datas aparecem como números

**Não é problema!** O sistema converte automaticamente:
- 46013 → 22/12/2025
- 45985 → 24/11/2025

### Valores errados

**Não é problema!** O sistema converte automaticamente:
- 1.069,66 → 1069.66
- 1069.66 → 1069.66

---

## 🎯 Fluxo Completo

```
Excel com dados
      ↓
Salvar como CSV
      ↓
Upload no sistema
      ↓
Sistema detecta colunas automaticamente
      ↓
Sistema preenche clientes vazios
      ↓
Sistema converte datas e valores
      ↓
Sistema cria clientes automaticamente
      ↓
Sistema importa todas as faturas
      ↓
Pronto! ✅
```

---

## 🆕 Mudanças no Sistema

### O Que Foi Adicionado:

1. **Detecção Automática de Colunas**
   - Procura por nomes conhecidos
   - Usa posição (A, B, C, D) se não encontrar

2. **Preenchimento de Clientes Vazios**
   - Detecta quando coluna A está vazia
   - Usa o último cliente válido

3. **Conversão Automática de Datas**
   - Números do Excel → Datas
   - DD/MM/YYYY → YYYY-MM-DD

4. **Conversão Automática de Valores**
   - Vírgula → Ponto
   - Remove pontos de milhar
   - Remove R$

---

## ✅ Vantagens

### Antes (com scripts):
1. Exportar do Excel
2. Executar script PowerShell
3. Aguardar conversão
4. Fazer upload do arquivo convertido

### Agora (direto):
1. Exportar do Excel
2. Fazer upload
3. Pronto! ✅

**Economia de tempo: 50%!**

---

## 🎉 Resumo

### Você Precisa Fazer:
1. ✅ Exportar do Excel como CSV
2. ✅ Fazer upload no sistema
3. ✅ Selecionar a empresa

### O Sistema Faz Automaticamente:
- ✅ Detecta colunas
- ✅ Preenche clientes vazios
- ✅ Converte datas
- ✅ Converte valores
- ✅ Cria clientes
- ✅ Importa faturas

### Você NÃO Precisa Mais:
- ❌ Executar scripts PowerShell
- ❌ Formatar arquivo manualmente
- ❌ Converter datas
- ❌ Converter valores
- ❌ Preencher clientes vazios

---

## 🚀 Pronto para Usar!

Agora é só exportar do Excel e fazer upload. O sistema cuida de tudo! 🎉

**Sem scripts. Sem complicação. Direto e simples!**
