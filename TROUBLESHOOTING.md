# Troubleshooting - Sistema de Faturas

## Erro 500 no Upload de Faturas

### Correções Aplicadas:

1. ✅ Removido `});` extra que causava erro de sintaxe
2. ✅ Adicionados logs de debug para rastrear o problema
3. ✅ Melhorado tratamento de erros

### Como Reiniciar o Servidor:

**Opção 1: Usando o script (Windows)**
```bash
restart-server.bat
```

**Opção 2: Manual**
1. Abra o Gerenciador de Tarefas (Ctrl+Shift+Esc)
2. Encontre todos os processos "Node.js"
3. Clique com botão direito → Finalizar tarefa
4. Abra um terminal na pasta do projeto
5. Execute: `npm start`

**Opção 3: Via terminal**
```bash
# Parar processos Node
taskkill /F /IM node.exe

# Aguardar 2 segundos
timeout /t 2

# Iniciar servidor
npm start
```

### Verificar se o Servidor Está Rodando:

```bash
# Testar conexão
curl http://localhost:5000/api/auth/login
```

Ou abra no navegador: http://localhost:5000

### Logs de Debug:

Após reiniciar o servidor, ao fazer upload você verá logs como:

```
[Upload] Iniciando upload...
[Upload] Arquivo: { ... }
[Upload] Body: { empresa_id: '1' }
[Upload] Tipo de arquivo: csv
[Upload] Empresa ID: 1
[Upload] Processando CSV...
[Upload] CSV lido. Total de linhas: 3
[Upload] Primeira linha: { cliente: 'CARLOS ALBERTO DA SILVA', ... }
[Upload] Clientes encontrados: 5
```

### Problemas Comuns:

#### 1. Erro "Cannot read property 'cliente' of undefined"
**Causa:** CSV mal formatado ou vazio
**Solução:** Verifique se o CSV tem cabeçalho e dados

#### 2. Erro "SQLITE_CONSTRAINT: UNIQUE constraint failed"
**Causa:** CPF/CNPJ duplicado
**Solução:** O sistema agora gera CPF temporário se não informado

#### 3. Erro "Cliente não encontrado"
**Causa:** Sistema antigo não criava clientes automaticamente
**Solução:** Agora cria automaticamente!

#### 4. Servidor não inicia
**Causa:** Porta 5000 em uso
**Solução:** 
```bash
# Verificar o que está usando a porta
netstat -ano | findstr :5000

# Matar o processo (substitua PID pelo número encontrado)
taskkill /F /PID <PID>
```

### Testar Upload Manualmente:

1. Certifique-se de ter pelo menos uma empresa cadastrada
2. Vá em "Faturas" → "Upload de Faturas"
3. Selecione o arquivo `exemplo-faturas-completo.csv`
4. Selecione uma empresa
5. Clique em "Fazer Upload"
6. Verifique os logs no terminal do servidor

### Verificar Banco de Dados:

```bash
# Instalar sqlite3 CLI (se não tiver)
npm install -g sqlite3

# Abrir banco
sqlite3 database/faturas.db

# Ver clientes
SELECT * FROM clientes;

# Ver empresas
SELECT * FROM empresa;

# Ver faturas
SELECT * FROM faturas;

# Sair
.exit
```

### Contato para Suporte:

Se o problema persistir:
1. Copie os logs do terminal
2. Copie a mensagem de erro do navegador (F12 → Console)
3. Informe qual arquivo CSV está usando
