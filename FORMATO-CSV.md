# Formatos de CSV para Upload de Faturas

O sistema suporta dois formatos de CSV para importação de faturas com **cadastro automático de clientes**.

## 🎯 Cadastro Automático de Clientes

Quando você faz upload de um CSV, o sistema:
1. Busca o cliente pelo nome
2. Se encontrar, vincula a fatura ao cliente existente
3. Se NÃO encontrar, **cria automaticamente** um novo cliente
4. Vincula a fatura à empresa selecionada

## Formato Simples

Use este formato quando você já tem os IDs dos clientes cadastrados no sistema.

```csv
cliente_id,numero_fatura,valor,data_vencimento
1,FAT-001,1500.00,2026-03-15
1,FAT-002,2300.50,2026-03-20
2,FAT-003,890.00,2026-03-25
```

### Colunas obrigatórias:
- `cliente_id`: ID do cliente no sistema
- `numero_fatura`: Número identificador da fatura
- `valor`: Valor da fatura (use ponto como separador decimal)
- `data_vencimento`: Data no formato YYYY-MM-DD

## Formato Completo (Recomendado)

Use este formato para cadastro automático de clientes. O sistema cria clientes que não existirem.

```csv
cliente,cpf_cnpj,email,telefone,numero_fatura,valor,data_vencimento,situacao
CARLOS ALBERTO DA SILVA,12345678901,carlos@email.com,(11) 98765-4321,HAVER,148.02,27/02/2026,PENDENTE
DIOGO ALVES DE OLIVEIRA,98765432100,diogo@email.com,(11) 91234-5678,REQUIS,469.61,04/03/2026,PENDENTE
ANA FRANCYELA GOMES VALADARES,11122233344,ana@email.com,(11) 99999-8888,REQUIS,2569.62,02/03/2026,PAGO
```

### Colunas aceitas:

**Identificação do Cliente (obrigatório):**
- `cliente`: Nome do cliente (busca automática ou cria novo)
- `cliente_id`: ID direto do cliente (se já cadastrado)

**Dados do Cliente (opcionais - usados ao criar novo cliente):**
- `cpf_cnpj`: CPF ou CNPJ do cliente
- `email`: Email do cliente
- `telefone`: Telefone do cliente
- `endereco`: Endereço completo

**Número da Fatura (use qualquer uma):**
- `numero_fatura`
- `nota_fiscal`
- `numero_boleto`

**Valor (obrigatório):**
- `valor`: Aceita formato com vírgula (1.500,00) ou ponto (1500.00)

**Data de Vencimento (obrigatório):**
- `data_vencimento`: Aceita YYYY-MM-DD ou DD/MM/YYYY
- `data_vecto`: Alternativa para data de vencimento

**Status/Situação (opcional):**
- `situacao` ou `sit`: PENDENTE, PAGO, VENCIDO, QUITADO

### Colunas opcionais ignoradas:
- `limite_credito`
- `data_fatura`
- `valor_total`
- Qualquer outra coluna não listada acima

## 🔄 Como Funciona o Cadastro Automático

### Cenário 1: Cliente já existe
```csv
cliente,numero_fatura,valor,data_vencimento
JOÃO DA SILVA,FAT-001,1500.00,2026-03-15
```
✅ Sistema encontra "JOÃO DA SILVA" cadastrado → Vincula fatura ao cliente existente

### Cenário 2: Cliente não existe
```csv
cliente,cpf_cnpj,email,numero_fatura,valor,data_vencimento
MARIA SANTOS,98765432100,maria@email.com,FAT-002,2500.00,2026-03-20
```
✅ Sistema NÃO encontra "MARIA SANTOS" → Cria novo cliente automaticamente → Vincula fatura

### Cenário 3: Cliente sem dados completos
```csv
cliente,numero_fatura,valor,data_vencimento
PEDRO OLIVEIRA,FAT-003,800.00,2026-03-25
```
✅ Sistema cria cliente com nome "PEDRO OLIVEIRA" e CPF temporário → Vincula fatura

## 📋 Observações Importantes

1. **Empresa é obrigatória**: Ao fazer upload de CSV, você DEVE selecionar uma empresa no formulário

2. **Busca de clientes por nome**: 
   - O sistema busca clientes cujo nome contenha o texto informado
   - A busca não é case-sensitive
   - Se não encontrar, cria automaticamente

3. **CPF/CNPJ temporário**:
   - Se não informar CPF/CNPJ, o sistema gera um código temporário
   - Você pode editar o cliente depois para adicionar o CPF/CNPJ correto

4. **Conversão automática**:
   - Datas em formato DD/MM/YYYY são convertidas para YYYY-MM-DD
   - Valores com vírgula são convertidos para ponto decimal
   - Status em texto são convertidos para: pendente, pago ou vencido

5. **Relatório de importação**:
   - Mostra quantas faturas foram importadas
   - Informa quantos clientes novos foram criados
   - Lista erros encontrados (se houver)

## 📊 Exemplo de Relatório

Após o upload, você verá uma mensagem como:

```
✅ 15 faturas importadas com sucesso
✅ 3 clientes novos cadastrados automaticamente
```

## 📁 Exemplos de Arquivos

Veja os arquivos de exemplo incluídos:
- `exemplo-faturas.csv` - Formato simples com cliente_id
- `exemplo-faturas-completo.csv` - Formato completo com cadastro automático
