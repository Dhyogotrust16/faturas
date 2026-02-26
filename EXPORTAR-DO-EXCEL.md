# 📊 Como Exportar Corretamente do Excel

## ⚠️ Problema Comum

Quando você exporta do Excel para CSV, as datas podem vir como números:
```
46013  (ao invés de 22/12/2025)
45985  (ao invés de 24/11/2025)
```

## ✅ Solução: Formatar Antes de Exportar

### Método 1: Formatar Colunas no Excel (RECOMENDADO)

#### Passo 1: Formatar a Coluna de Data
1. Abra seu arquivo no Excel
2. Selecione a coluna C (DATA VECTO)
3. Clique com botão direito → **Formatar Células**
4. Escolha **Personalizado**
5. Digite o formato: `DD/MM/YYYY`
6. Clique em **OK**

#### Passo 2: Formatar a Coluna de Valor
1. Selecione a coluna D (VALOR)
2. Clique com botão direito → **Formatar Células**
3. Escolha **Número**
4. Casas decimais: **2**
5. Separador de milhar: **Nenhum** (desmarque)
6. Clique em **OK**

#### Passo 3: Converter para Texto (Importante!)
1. Selecione a coluna C (DATA VECTO)
2. Copie (Ctrl+C)
3. Clique com botão direito → **Colar Especial**
4. Escolha **Valores**
5. Clique em **OK**

#### Passo 4: Exportar
1. **Arquivo** → **Salvar Como**
2. Tipo: **CSV (separado por vírgulas) (*.csv)**
3. Salve o arquivo

---

### Método 2: Copiar e Colar em Novo Arquivo

#### Passo 1: Preparar os Dados
1. No Excel, selecione as 4 colunas (A, B, C, D)
2. Copie (Ctrl+C)

#### Passo 2: Colar no Bloco de Notas
1. Abra o **Bloco de Notas**
2. Cole (Ctrl+V)
3. Você verá algo assim:
   ```
   CLIENTE	N° FATURA	DATA VECTO	VALOR
   JOÃO DA SILVA	FAT-001	27/02/2026	148.02
   ```

#### Passo 3: Substituir Tabulações por Vírgulas
1. Pressione **Ctrl+H** (Localizar e Substituir)
2. Em "Localizar": pressione **TAB** (tecla Tab)
3. Em "Substituir por": digite `,` (vírgula)
4. Clique em **Substituir Tudo**

#### Passo 4: Adicionar Cabeçalho
1. Na primeira linha, substitua por:
   ```
   CLIENTE,N° FATURA,DATA VECTO,VALOR
   ```

#### Passo 5: Salvar
1. **Arquivo** → **Salvar Como**
2. Nome: `faturas.csv`
3. Tipo: **Todos os arquivos (*.*)**
4. Codificação: **UTF-8**
5. Salvar

---

### Método 3: Usar Fórmula no Excel

Se as datas estão como números, converta com fórmula:

#### Passo 1: Criar Coluna Auxiliar
1. Crie uma nova coluna E
2. Na célula E2, digite:
   ```excel
   =TEXTO(C2;"DD/MM/YYYY")
   ```
3. Arraste a fórmula para baixo

#### Passo 2: Copiar Valores
1. Selecione a coluna E
2. Copie (Ctrl+C)
3. Clique na coluna C
4. Botão direito → **Colar Especial** → **Valores**

#### Passo 3: Deletar Coluna Auxiliar
1. Delete a coluna E

#### Passo 4: Exportar
1. **Arquivo** → **Salvar Como** → **CSV**

---

## 🎯 Formato Correto Final

Seu arquivo CSV deve ficar assim:

```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
CARLOS ALBERTO DA SILVA,HAVER,27/02/2026,148.02
DIOGO ALVES DE OLIVEIRA,REQUIS,04/03/2026,469.61
ANA FRANCYELA GOMES VALADARES,REQUIS,02/03/2026,2569.62
```

### Verificações:
- ✅ Datas no formato DD/MM/YYYY (27/02/2026)
- ✅ Valores com ponto decimal (148.02)
- ✅ Colunas separadas por vírgula
- ✅ Sem espaços extras
- ✅ Primeira linha é o cabeçalho

---

## 🔧 Alternativa: Usar o Script Conversor

Se mesmo assim as datas vierem erradas, você pode:

1. Exportar do Excel normalmente
2. Abrir o CSV no Excel novamente
3. Formatar a coluna de data manualmente
4. Salvar novamente como CSV
5. Usar o script conversor:
   ```powershell
   .\converter-excel-para-csv-simples.ps1 seu-arquivo.csv
   ```

---

## 📝 Exemplo Completo

### No Excel (antes de exportar):

| A (CLIENTE) | B (N° FATURA) | C (DATA VECTO) | D (VALOR) |
|-------------|---------------|----------------|-----------|
| JOÃO DA SILVA | FAT-001 | 27/02/2026 | 148,02 |
| MARIA SANTOS | FAT-002 | 04/03/2026 | 469,61 |

### Formatação:
1. Coluna C: Formato `DD/MM/YYYY`
2. Coluna D: Formato `Número` com 2 casas decimais

### Após Exportar (CSV):
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
JOÃO DA SILVA,FAT-001,27/02/2026,148.02
MARIA SANTOS,FAT-002,04/03/2026,469.61
```

---

## ⚠️ Problemas e Soluções

### Problema: Datas aparecem como números (46013)
**Causa:** Excel armazena datas como números internamente  
**Solução:** Formatar coluna como texto antes de exportar

### Problema: Valores com vírgula viram texto
**Causa:** Excel usa vírgula como separador decimal  
**Solução:** Sistema aceita ambos (vírgula ou ponto)

### Problema: Caracteres estranhos (Ã, ç, etc)
**Causa:** Problema de codificação  
**Solução:** Salvar como UTF-8 no Bloco de Notas

### Problema: Colunas não separadas corretamente
**Causa:** Separador errado (ponto e vírgula ao invés de vírgula)  
**Solução:** Usar script conversor ou substituir manualmente

---

## 🚀 Fluxo Recomendado

```
1. Abrir Excel
   ↓
2. Formatar colunas (data e valor)
   ↓
3. Converter data para texto (Colar Especial → Valores)
   ↓
4. Exportar como CSV
   ↓
5. Verificar no Bloco de Notas
   ↓
6. Se necessário, usar script conversor
   ↓
7. Fazer upload no sistema
   ↓
8. Pronto! ✅
```

---

## 📋 Checklist Antes de Exportar

- [ ] Coluna A: CLIENTE (texto)
- [ ] Coluna B: N° FATURA (texto)
- [ ] Coluna C: DATA VECTO (formato DD/MM/YYYY)
- [ ] Coluna D: VALOR (número com 2 casas decimais)
- [ ] Sem linhas vazias
- [ ] Primeira linha é o cabeçalho
- [ ] Dados começam na linha 2

---

## 🎉 Resultado Final

Arquivo pronto para upload no sistema com:
- ✅ Datas corretas (DD/MM/YYYY)
- ✅ Valores corretos (com ponto ou vírgula)
- ✅ Formato CSV válido
- ✅ Codificação UTF-8

Agora é só fazer upload e o sistema faz o resto automaticamente!
