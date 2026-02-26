# 🚀 Guia Rápido - Sistema de Faturas

## ⚡ Início Rápido

### 1. Iniciar Sistema
```bash
iniciar.bat
```

### 2. Acessar
- URL: http://localhost:5000
- Usuário: `admin`
- Senha: `admin123`

---

## 📤 Upload de CSV

### Passo a Passo
1. Menu: **Faturas** → **Upload**
2. Selecione a **empresa**
3. Escolha o arquivo **CSV**
4. Clique em **Enviar**
5. Aguarde o processamento
6. Veja o resultado! ✅

### Formato do CSV
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
CARLOS ALBERTO DA SILVA,HAVER,27/02/2026,148.02
DIOGO ALVES DE OLIVEIRA,REQUIS,04/03/2026,469.61
```

### O Sistema Faz Automaticamente
- ✅ Converte datas: `27/02/2026` → `2026-02-27`
- ✅ Converte valores: `148,02` → `148.02`
- ✅ Busca cliente por nome
- ✅ Cria cliente se não existir
- ✅ Evita duplicatas
- ✅ Valida todos os dados

---

## 📊 Conversões Automáticas

### Datas
```
Upload:    27/02/2026 → 2026-02-27 (banco)
Exibição:  2026-02-27 → 27/02/2026 (tela)
```

### Valores
```
Upload:    148,02 → 148.02 (banco)
           1.500,00 → 1500.00 (banco)
Exibição:  148.02 → R$ 148,02 (tela)
```

### CPF/CNPJ
```
Exibição:  12345678901 → 123.456.789-01
           " 1772048337240" → - (temporário)
```

### Telefone
```
Exibição:  11987654321 → (11) 98765-4321
```

---

## 🎯 Funcionalidades Principais

### Clientes
- ✅ Cadastrar (nome, CPF, email, telefone, endereço)
- ✅ Listar (com formatação)
- ✅ Editar (formulário pré-preenchido)
- ✅ Deletar
- ✅ Criação automática via CSV

### Empresas
- ✅ Cadastrar
- ✅ Listar
- ✅ Editar
- ✅ Deletar

### Faturas
- ✅ Cadastrar manual
- ✅ Upload CSV/PDF
- ✅ Listar (com filtros)
- ✅ Alterar status
- ✅ Download
- ✅ Deletar

---

## 🔍 Filtros de Faturas

### Pesquisa
- Por nome do cliente
- Por CPF/CNPJ do cliente
- Busca inteligente (palavras)

### Empresa
- Filtrar por empresa específica
- Ver todas as empresas

### Status
- Pendente
- Pago
- Vencido
- Todos

---

## 📝 Colunas do CSV

### Obrigatórias
- `CLIENTE` - Nome do cliente
- `N° FATURA` - Número da fatura
- `DATA VECTO` - Data de vencimento (DD/MM/YYYY)
- `VALOR` - Valor (pode usar vírgula ou ponto)

### Opcionais
- `SIT` - Status (PAGO, VENCIDO, PENDENTE)

### Variações Aceitas
```
Cliente:
- CLIENTE, cliente, cliente_id

Número:
- N° FATURA, Nº FATURA
- N° NOTA FISCAL, Nº NOTA FISCAL
- N° BOLETO, Nº BOLETO

Data:
- DATA VECTO
- DATA DE VENCIMENTO
- data_vencimento

Valor:
- VALOR
- VALOR TOTAL
```

---

## ⚠️ Importante

### CPF Temporário
Quando um cliente é criado automaticamente via CSV:
- CPF: espaço + número único
- Exemplo: `" 1772048337240"`
- Aparece como `-` na lista
- Pode ser editado depois

### Formatos de Valor
Sistema aceita ambos:
- Brasileiro: `1.500,00`
- Americano: `1500.00`

### Formatos de Data
Sistema aceita:
- Upload: `DD/MM/YYYY` (27/02/2026)
- Exibição: `DD/MM/YYYY` (27/02/2026)

---

## 🎨 Interface

### Menu Principal
```
Dashboard
├── Clientes
│   ├── Cadastrar
│   └── Listar
├── Empresas
│   ├── Cadastrar
│   └── Listar
└── Faturas
    ├── Cadastrar
    ├── Upload
    └── Listar
```

### Lista de Faturas
```
Cliente | Nº Fatura | Data Vecto | Valor | Status | Ações
```

### Lista de Clientes
```
Nome | CPF/CNPJ | Email | Telefone | Ações
```

---

## 🔧 Ações Disponíveis

### Faturas
- ⬇️ **Download** - Baixar arquivo
- ✓ **Alterar Status** - Marcar como pago/pendente
- 🗑️ **Deletar** - Remover fatura

### Clientes
- ✏️ **Editar** - Alterar dados
- 🗑️ **Deletar** - Remover cliente

### Empresas
- ✏️ **Editar** - Alterar dados
- 🗑️ **Deletar** - Remover empresa

---

## 📊 Exemplo Completo

### 1. Preparar CSV
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
JOÃO DA SILVA,FAT-001,15/03/2026,1500.00
MARIA SANTOS,FAT-002,20/03/2026,2500.50
```

### 2. Fazer Upload
- Selecionar empresa: "Empresa ABC"
- Escolher arquivo: `faturas.csv`
- Enviar

### 3. Resultado
```
✅ 2 faturas importadas com sucesso
✅ 2 clientes novos foram cadastrados automaticamente
```

### 4. Verificar Lista
```
Cliente          | Nº Fatura | Data Vecto | Valor        | Status
JOÃO DA SILVA    | FAT-001   | 15/03/2026 | R$ 1.500,00  | pendente
MARIA SANTOS     | FAT-002   | 20/03/2026 | R$ 2.500,50  | pendente
```

---

## 🎯 Dicas

### Upload Eficiente
1. Prepare o CSV com as colunas corretas
2. Use formato brasileiro ou americano (ambos funcionam)
3. Não precisa cadastrar clientes antes
4. Sistema cria automaticamente

### Edição de Clientes
1. Clique em "Editar"
2. Formulário já vem preenchido
3. Altere o que precisar
4. Salve

### Filtros Rápidos
1. Digite nome do cliente
2. Selecione empresa
3. Escolha status
4. Resultados em tempo real

### Busca Inteligente
- Digite parte do nome
- Sistema busca por palavras
- Também busca por CPF/CNPJ

---

## ✅ Checklist de Uso

### Primeira Vez
- [ ] Iniciar sistema (`iniciar.bat`)
- [ ] Fazer login (admin/admin123)
- [ ] Cadastrar empresa
- [ ] Fazer upload de CSV
- [ ] Verificar faturas importadas

### Uso Diário
- [ ] Fazer upload de novos CSVs
- [ ] Alterar status de faturas pagas
- [ ] Editar dados de clientes
- [ ] Filtrar e buscar faturas

---

## 🚀 Pronto para Usar!

Sistema completo com todas as conversões automáticas. Basta fazer upload do CSV e tudo é processado automaticamente! ✅

### Arquivos de Teste
- `teste-upload.csv` - CSV limpo para testar
- `test-formatting.js` - Testar formatações

### Documentação Completa
- `SISTEMA-PRONTO.md` - Guia completo
- `FLUXO-COMPLETO.md` - Fluxo detalhado
- `CONVERSÕES-AUTOMÁTICAS.md` - Todas as conversões
- `RESUMO-FINAL.md` - Resumo completo
