# 📤 Instruções Completas para Upload de CSV

## 🎯 Resumo Rápido

Seu arquivo tem 4 colunas (A, B, C, D) que precisam virar CSV com vírgulas.

### Formato Esperado:
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
CARLOS ALBERTO DA SILVA,HAVER,27/02/2026,148.02
DIOGO ALVES DE OLIVEIRA,REQUIS,04/03/2026,469.61
```

---

## 🚀 Método Mais Rápido (RECOMENDADO)

### 1. Exportar do Excel
1. Abra seu arquivo no Excel
2. **Importante:** Formate a coluna de data como texto:
   - Selecione coluna C (DATA VECTO)
   - Clique com botão direito → Formatar Células
   - Escolha "Texto"
   - OK
3. **Arquivo** → **Salvar Como**
4. Tipo: **CSV (separado por vírgulas)**
5. Salvar

### 2. Converter com o Script
1. Localize o arquivo: `converter-excel-para-csv-simples.ps1`
2. Clique com botão direito → **Executar com PowerShell**
3. Arraste seu arquivo CSV para a janela
4. Pressione ENTER
5. Pronto! Arquivo convertido: `seu-arquivo-pronto.csv`

### 3. Fazer Upload
1. Acesse: http://localhost:5000
2. Menu: **Faturas** → **Upload**
3. Selecione a **empresa**
4. Escolha o arquivo **seu-arquivo-pronto.csv**
5. Clique em **Enviar**
6. Aguarde o processamento
7. Pronto! ✅

---

## 📋 Estrutura do Arquivo

### Colunas Obrigatórias:

| Coluna | Nome | Formato | Exemplo |
|--------|------|---------|---------|
| A | CLIENTE | Texto | CARLOS ALBERTO DA SILVA |
| B | N° FATURA | Texto/Número | HAVER ou FAT-001 |
| C | DATA VECTO | DD/MM/YYYY | 27/02/2026 |
| D | VALOR | Número | 148.02 ou 148,02 |

### Cabeçalho (primeira linha):
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
```

---

## 🔄 O Que o Sistema Faz Automaticamente

### Conversões no Upload:
- ✅ **Datas:** `27/02/2026` → `2026-02-27` (banco)
- ✅ **Valores:** `148,02` → `148.02` (aceita ambos formatos)
- ✅ **Clientes:** Busca por nome ou cria automaticamente
- ✅ **Status:** Converte PAGO/VENCIDO/PENDENTE

### Formatação na Exibição:
- ✅ **Datas:** `2026-02-27` → `27/02/2026`
- ✅ **Valores:** `148.02` → `R$ 148,02`
- ✅ **CPF/CNPJ:** `12345678901` → `123.456.789-01`
- ✅ **Telefone:** `11987654321` → `(11) 98765-4321`

---

## 📝 Exemplo Completo

### 1. Seu Arquivo Excel:

| CLIENTE | N° FATURA | DATA VECTO | VALOR |
|---------|-----------|------------|-------|
| JOÃO DA SILVA | FAT-001 | 27/02/2026 | 148,02 |
| MARIA SANTOS | FAT-002 | 04/03/2026 | 469,61 |
| PEDRO OLIVEIRA | FAT-003 | 15/03/2026 | 1.500,00 |

### 2. Exportar como CSV

### 3. Converter com Script
```powershell
.\converter-excel-para-csv-simples.ps1 meu-arquivo.csv
```

### 4. Resultado (meu-arquivo-pronto.csv):
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
MARIA SANTOS,FAT-002,04/03/2026,469.61
PEDRO OLIVEIRA,FAT-003,15/03/2026,1.500,00
```

### 5. Upload no Sistema
- Selecionar empresa
- Escolher arquivo
- Enviar

### 6. Resultado:
```
✅ 3 faturas importadas com sucesso
✅ 3 clientes novos foram cadastrados automaticamente
```

---

## ⚠️ Problemas Comuns

### Datas aparecem como números (46013)
**Solução:**
1. No Excel, selecione a coluna de data
2. Formatar Células → Texto
3. Exportar novamente

**OU** use a fórmula:
```excel
=TEXTO(C2;"DD/MM/YYYY")
```

### Colunas não separadas corretamente
**Solução:** Use o script conversor que corrige automaticamente

### Caracteres estranhos (Ã, ç)
**Solução:** Salvar como UTF-8 no Bloco de Notas

### Valores errados (148,02 vira 14802)
**Solução:** Sistema detecta automaticamente formato brasileiro/americano

---

## 🛠️ Scripts Disponíveis

### converter-excel-para-csv-simples.ps1
- ✅ Interface interativa
- ✅ Arrasta e solta arquivo
- ✅ Converte automaticamente
- ✅ Abre pasta do resultado
- 🎯 **MAIS FÁCIL - USE ESTE!**

### formatar-csv.ps1
- ✅ Relatório detalhado
- ✅ Estatísticas de processamento
- ✅ Para usuários avançados

### Uso:
```powershell
# Método 1: Duplo clique
Botão direito → Executar com PowerShell

# Método 2: Linha de comando
.\converter-excel-para-csv-simples.ps1 seu-arquivo.csv
```

---

## ✅ Checklist Final

Antes de fazer upload, verifique:

- [ ] Arquivo tem 4 colunas (CLIENTE, N° FATURA, DATA VECTO, VALOR)
- [ ] Primeira linha é o cabeçalho
- [ ] Datas no formato DD/MM/YYYY
- [ ] Valores com ponto ou vírgula (ambos funcionam)
- [ ] Sem linhas vazias no meio dos dados
- [ ] Arquivo salvo como .csv
- [ ] Empresa selecionada no formulário de upload

---

## 🎯 Fluxo Completo

```
Excel com 4 colunas (A, B, C, D)
         ↓
Exportar como CSV
         ↓
Executar script conversor
         ↓
Arquivo-pronto.csv gerado
         ↓
Upload no sistema
         ↓
Sistema processa automaticamente:
  • Converte datas
  • Converte valores
  • Busca/cria clientes
  • Importa faturas
         ↓
Pronto! ✅
```

---

## 📚 Documentação Adicional

- **EXPORTAR-DO-EXCEL.md** - Como exportar corretamente do Excel
- **COMO-CONVERTER-CSV.md** - Guia detalhado de conversão
- **SISTEMA-PRONTO.md** - Guia completo do sistema
- **CONVERSÕES-AUTOMÁTICAS.md** - Todas as conversões automáticas
- **GUIA-RÁPIDO.md** - Referência rápida

---

## 🎉 Pronto para Usar!

Com estes scripts e instruções, você pode:
1. ✅ Exportar do Excel
2. ✅ Converter automaticamente
3. ✅ Fazer upload
4. ✅ Sistema processa tudo sozinho

**Não precisa se preocupar com:**
- ❌ Formato de data
- ❌ Formato de valor
- ❌ Cadastro de clientes
- ❌ Duplicatas

**O sistema faz tudo automaticamente!** 🚀
