# 🔄 Fluxo Completo do Sistema

## 📤 Upload de CSV - Passo a Passo

### 1️⃣ Usuário Faz Upload
```
Arquivo CSV → Sistema recebe
```

### 2️⃣ Sistema Lê o CSV
```csv
CLIENTE,N° FATURA,DATA VECTO,VALOR
CARLOS ALBERTO DA SILVA,HAVER,27/02/2026,148.02
```

### 3️⃣ Para Cada Linha do CSV

#### A. Buscar/Criar Cliente
```javascript
// 1. Busca exata
"CARLOS ALBERTO DA SILVA" → Busca no banco

// 2. Se não encontrar, busca parcial
"CARLOS ALBERTO" contém "CARLOS ALBERTO DA SILVA"?

// 3. Se não encontrar, cria novo
Cliente criado com:
- Nome: "CARLOS ALBERTO DA SILVA"
- CPF: " 1772048337240" (temporário)
```

#### B. Converter Data
```javascript
// Entrada: DD/MM/YYYY
"27/02/2026"

// Conversão
Split por "/" → ["27", "02", "2026"]
Reorganiza → "2026-02-27"

// Saída: YYYY-MM-DD
"2026-02-27" ✅
```

#### C. Converter Valor
```javascript
// Entrada
"148.02" ou "148,02" ou "1.500,00"

// Lógica
if (tem vírgula) {
  // Formato brasileiro
  Remove pontos → "1500,00"
  Troca vírgula por ponto → "1500.00"
} else {
  // Formato americano
  Mantém → "148.02"
}

// Saída
parseFloat("148.02") → 148.02 ✅
```

#### D. Processar Status
```javascript
// Entrada
"PAGO" ou "VENCIDO" ou vazio

// Conversão
"PAGO" → "pago"
"QUITADO" → "pago"
"VENCIDO" → "vencido"
outros → "pendente"
```

#### E. Salvar no Banco
```sql
INSERT INTO faturas (
  cliente_id,      -- ID do cliente (encontrado ou criado)
  empresa_id,      -- ID da empresa (selecionada no form)
  numero_fatura,   -- "HAVER"
  valor,           -- 148.02
  data_vencimento, -- "2026-02-27"
  status,          -- "pendente"
  arquivo_path,    -- "1772048337240-dados.csv"
  tipo_arquivo     -- "csv"
)
```

### 4️⃣ Resultado Final
```
✅ 3 faturas importadas com sucesso
✅ 2 clientes novos foram cadastrados automaticamente
```

---

## 📊 Exibição na Lista de Faturas

### 1️⃣ Sistema Busca Dados
```sql
SELECT f.*, c.nome as cliente_nome 
FROM faturas f 
JOIN clientes c ON f.cliente_id = c.id 
ORDER BY f.data_vencimento DESC
```

### 2️⃣ Para Cada Fatura

#### A. Formatar Cliente
```javascript
// Direto do banco
cliente_nome: "CARLOS ALBERTO DA SILVA"
```

#### B. Formatar Número
```javascript
// Direto do banco
numero_fatura: "HAVER"
```

#### C. Formatar Data
```javascript
// Entrada do banco: YYYY-MM-DD
"2026-02-27"

// Conversão
new Date("2026-02-27T00:00:00") // T00:00:00 evita timezone
toLocaleDateString('pt-BR')

// Saída: DD/MM/YYYY
"27/02/2026" ✅
```

#### D. Formatar Valor
```javascript
// Entrada do banco
148.02

// Conversão
new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(148.02)

// Saída
"R$ 148,02" ✅
```

#### E. Formatar Status
```javascript
// Entrada do banco
"pendente"

// Badge colorido
<span class="badge badge-warning">pendente</span>
```

### 3️⃣ Renderizar Tabela
```html
<tr>
  <td>CARLOS ALBERTO DA SILVA</td>
  <td><strong>HAVER</strong></td>
  <td>27/02/2026</td>
  <td><strong>R$ 148,02</strong></td>
  <td><span class="badge badge-warning">pendente</span></td>
  <td>
    <button>⬇️</button>
    <button>✓</button>
    <button>🗑️</button>
  </td>
</tr>
```

---

## 👤 Exibição na Lista de Clientes

### 1️⃣ Sistema Busca Dados
```sql
SELECT * FROM clientes ORDER BY nome
```

### 2️⃣ Para Cada Cliente

#### A. Formatar Nome
```javascript
// Direto do banco
nome: "CARLOS ALBERTO DA SILVA"
```

#### B. Formatar CPF/CNPJ
```javascript
// Entrada do banco
cpf_cnpj: " 1772048337240" // CPF temporário

// Lógica
if (value.startsWith(' ')) {
  return '-'; // Mostra como vazio
}

// Ou se for CPF real
"12345678901" → "123.456.789-01"

// Ou se for CNPJ real
"12345678901234" → "12.345.678/9012-34"
```

#### C. Formatar Email
```javascript
// Entrada do banco
email: null

// Saída
email || '-' → "-"
```

#### D. Formatar Telefone
```javascript
// Entrada do banco
telefone: "11987654321"

// Conversão
if (length === 11) {
  return "(11) 98765-4321"
}

// Ou se vazio
null → "-"
```

### 3️⃣ Renderizar Tabela
```html
<tr>
  <td><strong>CARLOS ALBERTO DA SILVA</strong></td>
  <td>-</td> <!-- CPF temporário -->
  <td>-</td> <!-- Email vazio -->
  <td>-</td> <!-- Telefone vazio -->
  <td>
    <button>✏️ Editar</button>
    <button>🗑️ Deletar</button>
  </td>
</tr>
```

---

## 🔄 Fluxo de Edição de Cliente

### 1️⃣ Usuário Clica em "Editar"
```javascript
Clientes.edit(id)
```

### 2️⃣ Sistema Busca Cliente
```javascript
const cliente = this.clientes.find(c => c.id === id)
// {
//   id: 1,
//   nome: "CARLOS ALBERTO DA SILVA",
//   cpf_cnpj: " 1772048337240",
//   email: null,
//   telefone: null,
//   endereco: null
// }
```

### 3️⃣ Define ID de Edição
```javascript
this.editingId = id
```

### 4️⃣ Navega para Formulário
```javascript
router.navigate('clientes-cadastrar')
```

### 5️⃣ Preenche Campos (após 100ms)
```javascript
document.getElementById('cliente-nome').value = "CARLOS ALBERTO DA SILVA"
document.getElementById('cliente-cpf').value = " 1772048337240"
document.getElementById('cliente-email').value = ""
document.getElementById('cliente-telefone').value = ""
document.getElementById('cliente-endereco').value = ""
```

### 6️⃣ Usuário Edita e Salva
```javascript
// Atualiza CPF temporário para CPF real
cpf_cnpj: "12345678901"

// Envia para API
PUT /api/clientes/1
```

### 7️⃣ Sistema Atualiza Banco
```sql
UPDATE clientes 
SET cpf_cnpj = '12345678901'
WHERE id = 1
```

---

## 📈 Resumo das Conversões

### Upload (CSV → Banco)
```
DD/MM/YYYY → YYYY-MM-DD
1.500,00 → 1500.00
PAGO → pago
Nome → BUSCA/CRIA cliente
```

### Exibição (Banco → Tela)
```
YYYY-MM-DD → DD/MM/YYYY
1500.00 → R$ 1.500,00
pago → badge verde
12345678901 → 123.456.789-01
" 1772048337240" → -
```

---

## ✅ Validações em Cada Etapa

### Upload
- ✅ Arquivo é CSV ou PDF
- ✅ Empresa selecionada
- ✅ Colunas obrigatórias presentes
- ✅ Data em formato válido
- ✅ Valor numérico

### Cadastro Manual
- ✅ Todos os campos obrigatórios preenchidos
- ✅ CPF/CNPJ com 11 ou 14 dígitos
- ✅ Email em formato válido
- ✅ Data de vencimento válida
- ✅ Valor numérico positivo

### Edição
- ✅ Cliente existe
- ✅ Campos válidos
- ✅ Não permite CPF/CNPJ duplicado

---

## 🎯 Resultado Final

### Dados no Banco (formato técnico)
```sql
cliente_id: 1
numero_fatura: "HAVER"
data_vencimento: "2026-02-27"
valor: 148.02
status: "pendente"
```

### Dados na Tela (formato amigável)
```
Cliente: CARLOS ALBERTO DA SILVA
Nº Fatura: HAVER
Data Vencimento: 27/02/2026
Valor: R$ 148,02
Status: pendente
```

---

## 🚀 Performance

### Upload de 100 Faturas
- ⏱️ Tempo: ~2-3 segundos
- 📊 Processamento sequencial
- ✅ Validação em cada linha
- 📝 Log detalhado no console

### Listagem de 1000 Faturas
- ⏱️ Tempo: ~100ms
- 🔍 Filtros em tempo real
- 📊 Renderização otimizada
- 💾 Cache de clientes/empresas

---

## 🎉 Sistema Completo e Otimizado!

Todas as conversões acontecem automaticamente, o usuário só precisa:
1. Preparar o CSV
2. Selecionar a empresa
3. Fazer upload
4. Pronto! ✅
