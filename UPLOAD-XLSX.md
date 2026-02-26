# 📊 Upload de Arquivos Excel (.xlsx)

## 🎉 Nova Funcionalidade!

Agora você pode fazer upload de arquivos Excel (.xlsx) diretamente, sem precisar converter para CSV!

---

## 🚀 Como Usar

### 1. Preparar o Arquivo no Excel

Seu arquivo deve ter as seguintes colunas (A, B, C, D):

| A - CLIENTE | B - N° FATURA | C - DATA VECTO | D - VALOR |
|-------------|---------------|----------------|-----------|
| HS TRANSPORTE | 028.465 | 04.08.2025 | 1069,66 |
| | 028.824 | 11.08.2025 | 1843,65 |
| | 029.425 | 18.08.2025 | 2105,99 |

**Importante:**
- Primeira linha = Cabeçalho (será ignorada)
- Coluna A vazia = Usa o cliente da linha anterior
- Datas podem estar em qualquer formato
- Valores podem ter vírgula ou ponto

### 2. Salvar o Arquivo

**Não precisa converter!** Mantenha como `.xlsx`

### 3. Fazer Upload

1. Acesse: http://localhost:5000
2. Menu: **Faturas** → **Upload**
3. Selecione a **empresa**
4. Escolha o arquivo **.xlsx**
5. Clique em **Enviar**

### 4. Pronto!

```
✅ 27 faturas importadas com sucesso
✅ 20 clientes novos foram cadastrados automaticamente
```

---

## 📊 Formatos Suportados

### 1. Excel (.xlsx) - NOVO! ✨
```
Arquivo direto do Excel
Sem conversão necessária
```

### 2. CSV (.csv)
```
Exportado do Excel
Separado por ponto e vírgula (;)
```

### 3. PDF (.pdf)
```
Requer preenchimento manual dos campos
```

---

## 🔄 O Que o Sistema Faz Automaticamente

### Com Arquivos Excel (.xlsx):

1. **Lê a primeira aba** do arquivo
2. **Ignora a primeira linha** (cabeçalho)
3. **Processa cada linha:**
   - Coluna A = CLIENTE
   - Coluna B = N° FATURA
   - Coluna C = DATA VECTO
   - Coluna D = VALOR

4. **Preenche clientes vazios:**
   - Se coluna A vazia → Usa cliente anterior

5. **Converte automaticamente:**
   - Datas: DD.MM.YYYY → YYYY-MM-DD
   - Valores: 1.069,66 → 1069.66
   - Status: PAGO → pago

6. **Cria clientes automaticamente:**
   - Se não existir no sistema

---

## 📝 Exemplo Completo

### Seu Arquivo Excel:

```
Linha 1: CLIENTE | N° FATURA | DATA VECTO | VALOR
Linha 2: HS TRANSPORTE | 028.465 | 04.08.2025 | 1069,66
Linha 3: (vazio) | 028.824 | 11.08.2025 | 1843,65
Linha 4: (vazio) | 029.425 | 18.08.2025 | 2105,99
Linha 5: JOSELIO OU JAIR | 002.317 | 30.04.2024 | 1997,28
Linha 6: (vazio) | 033.525 | 24.11.2025 | 2231,33
```

### Resultado no Sistema:

```
1. HS TRANSPORTE - 028.465 - 04/08/2025 - R$ 1.069,66
2. HS TRANSPORTE - 028.824 - 11/08/2025 - R$ 1.843,65
3. HS TRANSPORTE - 029.425 - 18/08/2025 - R$ 2.105,99
4. JOSELIO OU JAIR - 002.317 - 30/04/2024 - R$ 1.997,28
5. JOSELIO OU JAIR - 033.525 - 24/11/2025 - R$ 2.231,33
```

---

## ✅ Vantagens do Upload XLSX

### Antes (CSV):
1. Abrir Excel
2. Salvar como CSV
3. Verificar separadores
4. Fazer upload

### Agora (XLSX):
1. Abrir Excel
2. Fazer upload
3. Pronto! ✅

**Economia de tempo: 50%!**

---

## 🔧 Detalhes Técnicos

### Biblioteca Usada:
- **xlsx** (SheetJS)
- Lê arquivos Excel nativamente
- Converte para array de dados

### Processamento:
```javascript
// Ler arquivo Excel
const workbook = XLSX.readFile(arquivo);
const sheet = workbook.Sheets[workbook.SheetNames[0]];

// Converter para array
const dados = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Processar cada linha
for (let i = 1; i < dados.length; i++) {
  const [cliente, nFatura, data, valor] = dados[i];
  // ... processar
}
```

---

## 📋 Comparação de Formatos

| Formato | Conversão | Facilidade | Recomendado |
|---------|-----------|------------|-------------|
| **XLSX** | ❌ Não precisa | ⭐⭐⭐⭐⭐ | ✅ SIM |
| **CSV** | ✅ Automática | ⭐⭐⭐⭐ | ✅ SIM |
| **PDF** | ⚠️ Manual | ⭐⭐ | ❌ Não |

---

## ⚠️ Observações Importantes

### 1. Primeira Aba
O sistema lê apenas a **primeira aba** do Excel.

### 2. Formato das Colunas
- **Coluna A:** Texto (nome do cliente)
- **Coluna B:** Texto ou número (nº fatura)
- **Coluna C:** Data ou texto (data vencimento)
- **Coluna D:** Número (valor)

### 3. Linhas Vazias
Linhas completamente vazias são ignoradas automaticamente.

### 4. Clientes Vazios
Se a coluna A estiver vazia, o sistema usa o cliente da linha anterior.

---

## 🎯 Casos de Uso

### Caso 1: Arquivo Direto do Sistema Contábil
```
Exportar relatório → Salvar como .xlsx → Upload
```

### Caso 2: Planilha Manual
```
Criar planilha → Preencher dados → Upload
```

### Caso 3: Arquivo Existente
```
Abrir arquivo → Fazer upload (sem modificar)
```

---

## 🆘 Problemas Comuns

### Erro: "Apenas arquivos PDF, CSV e XLSX são permitidos"
**Solução:** Certifique-se que o arquivo tem extensão `.xlsx`

### Erro: "Colunas insuficientes"
**Solução:** Verifique se o arquivo tem 4 colunas (A, B, C, D)

### Erro: "Cliente não especificado"
**Solução:** Primeira linha de dados deve ter o nome do cliente

### Datas aparecem como números
**Não é problema!** O sistema converte automaticamente

---

## 🎉 Resumo

### O Que Você Precisa:
1. ✅ Arquivo Excel (.xlsx)
2. ✅ 4 colunas (CLIENTE, N° FATURA, DATA, VALOR)
3. ✅ Empresa selecionada

### O Que o Sistema Faz:
- ✅ Lê o arquivo Excel
- ✅ Preenche clientes vazios
- ✅ Converte datas e valores
- ✅ Cria clientes automaticamente
- ✅ Importa todas as faturas

### O Que Você NÃO Precisa Mais:
- ❌ Converter para CSV
- ❌ Ajustar separadores
- ❌ Formatar manualmente

---

## 🚀 Pronto para Usar!

Agora você pode fazer upload de arquivos Excel diretamente!

**Sem conversão. Sem complicação. Direto do Excel!** 📊✨
