# Conversões Automáticas no Upload de CSV

O sistema realiza as seguintes conversões automaticamente ao fazer upload de CSV:

## 📅 Datas

### Formatos Aceitos:
- `DD/MM/YYYY` → Convertido para `YYYY-MM-DD`
- `YYYY-MM-DD` → Mantido como está

### Exemplos:
```
27/02/2026 → 2026-02-27 ✅
04/03/2026 → 2026-03-04 ✅
2026-03-15 → 2026-03-15 ✅
```

### Colunas Aceitas:
- `DATA VECTO`
- `DATA DE VENCIMENTO`
- `data_vencimento`
- `data_vecto`
- `vencimento`

## 💰 Valores

### Formatos Aceitos:
- **Formato Brasileiro:** `1.500,00` → `1500.00`
- **Formato Americano:** `1500.00` → `1500.00`
- **Sem formatação:** `1500` → `1500.00`

### Lógica de Conversão:
1. Remove `R$` se houver
2. Se tem vírgula → Formato brasileiro (remove pontos, troca vírgula por ponto)
3. Se tem apenas ponto → Formato americano (mantém)
4. Converte para número decimal

### Exemplos:
```
148,02      → 148.02 ✅
148.02      → 148.02 ✅
1.500,00    → 1500.00 ✅
1500.00     → 1500.00 ✅
R$ 2.569,62 → 2569.62 ✅
```

### Colunas Aceitas:
- `VALOR`
- `VALOR TOTAL`
- `valor`

## 📝 Número da Fatura

### Colunas Aceitas (em ordem de prioridade):
1. `N° FATURA` ou `Nº FATURA`
2. `N° NOTA FISCAL` ou `Nº NOTA FISCAL`
3. `N° BOLETO` ou `Nº BOLETO`
4. `numero_fatura`
5. `nota_fiscal`
6. `numero_boleto`

### Conversão:
- Aceita qualquer texto/número
- Se nenhuma coluna for encontrada, gera automaticamente: `FAT-[timestamp]-[índice]`

### Exemplos:
```
HAVER           → HAVER ✅
REQUIS          → REQUIS ✅
FAT-001         → FAT-001 ✅
12345           → 12345 ✅
(vazio)         → FAT-1772048337225-0 ✅
```

## 👤 Nome do Cliente

### Conversão:
- Remove espaços extras no início e fim
- Converte para MAIÚSCULAS para busca
- Mantém o nome original ao salvar

### Busca Inteligente:
1. **Busca Exata:** Nome idêntico (case-insensitive)
2. **Busca Parcial:** Um nome contém o outro
3. **Criar Novo:** Se não encontrar nenhuma correspondência

### Exemplos:
```
CSV: "JOÃO DA SILVA"
Banco: "JOÃO DA SILVA"
→ Reutiliza cliente existente ✅

CSV: "  João Silva  "
→ Salva como "João Silva" (sem espaços extras) ✅

CSV: "MARIA SANTOS"
Banco: (não existe)
→ Cria novo cliente ✅
```

### Colunas Aceitas:
- `CLIENTE`
- `cliente`
- `cliente_id` (ID direto)

## 📊 Status/Situação

### Conversão Automática:
- `PAGO`, `QUITADO` → `pago`
- `VENCIDO` → `vencido`
- `PENDENTE` ou qualquer outro → `pendente`

### Case-Insensitive:
```
PAGO     → pago ✅
Pago     → pago ✅
pago     → pago ✅
QUITADO  → pago ✅
VENCIDO  → vencido ✅
PENDENTE → pendente ✅
(vazio)  → pendente ✅
```

### Colunas Aceitas:
- `SIT`
- `situacao`
- `status`

## 🔢 CPF/CNPJ Temporário

### Quando o cliente não existe:
- Gera CPF temporário: `" [timestamp][índice]"`
- Formato: Espaço + número único
- Exemplo: `" 17720483372401"`

### Por que espaço no início?
- Visualmente parece "vazio"
- Garante unicidade (evita conflito UNIQUE)
- Pode ser editado depois para CPF/CNPJ real

## 🔄 Resumo das Conversões

| Dado | Entrada | Saída |
|------|---------|-------|
| Data | `27/02/2026` | `2026-02-27` |
| Valor | `1.500,00` | `1500.00` |
| Valor | `R$ 148,02` | `148.02` |
| Nome | `  João  ` | `João` |
| Status | `PAGO` | `pago` |
| CPF (novo) | (vazio) | `" 1772048337240"` |

## ✅ Validações

O sistema também valida:
- ✅ Data de vencimento obrigatória
- ✅ Valor obrigatório e numérico
- ✅ Nome do cliente obrigatório
- ✅ Empresa obrigatória (selecionada no formulário)

## 🚫 Dados Ignorados

Estas colunas são lidas mas ignoradas:
- `LIMITE CRÉDITO`
- `DATA FATURA`
- Qualquer outra coluna não listada acima

## 📝 Exemplo Completo

### CSV de Entrada:
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
CARLOS ALBERTO DA SILVA,HAVER,27/02/2026,148,02
```

### Dados Processados:
```javascript
{
  cliente: "CARLOS ALBERTO DA SILVA",
  cpf_cnpj: " 1772048337240",  // Gerado automaticamente
  numero_fatura: "HAVER",
  data_vencimento: "2026-02-27",  // Convertido de DD/MM/YYYY
  valor: 148.02,  // Convertido de 148,02
  status: "pendente",  // Padrão
  empresa_id: 1  // Selecionado no formulário
}
```

## 🎯 Resultado Final

Todas as conversões são feitas automaticamente, você só precisa:
1. Preparar o CSV com os dados
2. Selecionar a empresa
3. Fazer upload
4. O sistema cuida do resto! ✅
