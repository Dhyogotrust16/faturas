# Guia de Uso - Sistema de Faturas

## 🚀 Como Iniciar

O sistema já está rodando em: **http://localhost:5000**

Abra seu navegador e acesse o endereço acima.

## 📋 Passo a Passo

### 1. Criar sua Conta
- Na tela inicial, clique em "Criar nova conta"
- Preencha: Nome, Email e Senha
- Clique em "Criar Conta"
- Faça login com suas credenciais

### 2. Cadastrar Clientes
- No menu superior, clique em "Clientes"
- Preencha o formulário:
  - Nome (obrigatório)
  - CPF/CNPJ (obrigatório)
  - Email (opcional)
  - Telefone (opcional)
  - Endereço (opcional)
- Clique em "Salvar"

**Ações disponíveis:**
- Editar: Modifica os dados do cliente
- Deletar: Remove o cliente (cuidado!)

### 3. Gerenciar Faturas

#### Opção A: Criar Fatura Manual
- No menu superior, clique em "Faturas"
- Na seção "Nova Fatura", preencha:
  - Cliente (selecione da lista)
  - Número da Fatura
  - Valor
  - Data de Vencimento
  - Status (Pendente/Pago/Vencido)
- Clique em "Criar Fatura"

#### Opção B: Upload de PDF
- Na seção "Upload de Arquivo"
- Selecione um arquivo PDF
- Preencha os dados da fatura:
  - Cliente
  - Número da Fatura
  - Valor
  - Data de Vencimento
- Clique em "Fazer Upload"

#### Opção C: Importar CSV em Lote
- Use o arquivo `exemplo-faturas.csv` como modelo
- O CSV deve ter as colunas:
  ```
  cliente_id,numero_fatura,valor,data_vencimento
  ```
- Na seção "Upload de Arquivo", selecione o CSV
- Clique em "Fazer Upload"
- Todas as faturas serão importadas automaticamente

### 4. Faturar Notas a Prazo (Parcelamento)
- No menu, clique em "Faturar notas a prazo"
- Preencha:
  - Cliente
  - Número da Nota
  - Valor Total
  - Número de Parcelas (1-12)
  - Data do Primeiro Vencimento
  - Intervalo entre Parcelas (dias)
- Clique em "Gerar Parcelas"
- Revise o preview das parcelas
- Clique em "Confirmar e Salvar"

**Exemplo:** Uma nota de R$ 3.000,00 em 3x de R$ 1.000,00 com vencimentos a cada 30 dias

### 5. Consultar Notas a Prazo
- No menu, clique em "Consultar notas a prazo"
- Use os filtros:
  - Cliente: Filtra por cliente específico
  - Status: Pendente, Pago ou Vencido
  - Período: Vencendo (7 dias), Este mês, Vencidas
- Clique em "Aplicar Filtros"
- Visualize totais: Total, Pendente e Pago
- Ações disponíveis:
  - Marcar como Pago
  - Baixar PDF (se disponível)

### 6. Arquivo Remessa Boletos
- No menu, clique em "Arquivo remessa boletos"
- Configure os dados bancários:
  - Banco (001-BB, 237-Bradesco, 341-Itaú, etc)
  - Agência
  - Conta
  - Carteira
  - Convênio/Cedente
- Selecione as faturas pendentes para incluir
- Clique em "Gerar Arquivo de Remessa"
- O arquivo CNAB será baixado automaticamente

**Importante:** O arquivo gerado é um formato simplificado. Para uso em produção, consulte as especificações do seu banco.

### 7. Baixar Faturas
- Na lista de faturas, clique no botão "Baixar"
- O arquivo PDF será baixado automaticamente

### 8. Dashboard
- Visualize estatísticas em tempo real:
  - Total de Clientes
  - Total de Faturas
  - Faturas Pendentes

## 📁 Arquivos de Exemplo

### exemplo-faturas.csv
```csv
cliente_id,numero_fatura,valor,data_vencimento
1,FAT-001,1500.00,2026-03-15
1,FAT-002,2300.50,2026-03-20
1,FAT-003,890.00,2026-03-25
```

**Importante:** O `cliente_id` deve corresponder a um cliente já cadastrado!

## 🔒 Segurança

- Todas as senhas são criptografadas com bcrypt
- Autenticação via JWT (token expira em 24h)
- Apenas usuários autenticados podem acessar o sistema

## 💡 Dicas

1. **Cadastre clientes primeiro** antes de criar faturas
2. **Use o CSV** para importar muitas faturas de uma vez
3. **Faça backup** da pasta `database/` periodicamente
4. **Arquivos enviados** ficam salvos na pasta `uploads/`

## ⚠️ Troubleshooting

**Problema:** Não consigo fazer login
- Verifique se criou a conta primeiro
- Confirme email e senha corretos

**Problema:** Erro ao importar CSV
- Verifique se o cliente_id existe
- Confirme o formato das datas (YYYY-MM-DD)
- Certifique-se que o valor usa ponto (.) como decimal

**Problema:** Upload de PDF não funciona
- Verifique se o arquivo é realmente PDF
- Tamanho máximo recomendado: 10MB

## 🛠️ Comandos Úteis

Para parar o servidor:
```bash
Ctrl + C no terminal
```

Para reiniciar o servidor:
```bash
npm start
```

Para ver logs do servidor:
- Verifique o terminal onde o servidor está rodando

## 📞 Estrutura de Dados

### Cliente
- id (gerado automaticamente)
- nome
- cpf_cnpj (único)
- email
- telefone
- endereco

### Fatura
- id (gerado automaticamente)
- cliente_id (referência ao cliente)
- numero_fatura
- valor (decimal)
- data_vencimento (formato: YYYY-MM-DD)
- status (pendente/pago/vencido)
- arquivo_path (caminho do PDF/CSV)
- tipo_arquivo (pdf/csv)
