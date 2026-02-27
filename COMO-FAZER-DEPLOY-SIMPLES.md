# 🚀 Como Fazer Deploy - GUIA SIMPLES

## ⚡ Opção 1: Usar o Script Automático (MAIS FÁCIL)

### Passo 1: Clique com botão direito em `DEPLOY.bat`

### Passo 2: Selecione "Executar como Administrador"

### Passo 3: Siga as instruções na tela

O script vai:
- ✅ Instalar Fly CLI automaticamente
- ✅ Fazer login no Fly.io
- ✅ Fazer deploy para produção

---

## 📝 Opção 2: Comandos Manuais

### Passo 1: Abrir PowerShell como Administrador

1. Pressione `Windows + X`
2. Clique em "Windows PowerShell (Admin)"

### Passo 2: Instalar Fly CLI

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Passo 3: Fechar e Abrir PowerShell Novamente

Feche o PowerShell e abra novamente (não precisa ser como administrador).

### Passo 4: Navegar até o Projeto

```powershell
cd "C:\Users\Central de Vendas\Desktop\ATON"
```

### Passo 5: Fazer Login

```powershell
fly auth login
```

Isso abrirá o navegador. Faça login com sua conta Fly.io.

### Passo 6: Fazer Deploy

```powershell
fly deploy
```

Aguarde alguns minutos...

### Passo 7: Abrir Aplicação

```powershell
fly open
```

Ou acesse: https://visao-faturas.fly.dev/

---

## ✅ Testar Após Deploy

1. Acesse: https://visao-faturas.fly.dev/
2. Login: `daoliveira` / `123456`
3. Vá em "Consultar a Prazo"
4. Pressione F5
5. ✅ Deve permanecer em "Consultar a Prazo"
6. ✅ Filtros devem funcionar automaticamente (sem botão)

---

## 🎯 Mudanças Implementadas

### ✅ Persistência de Rota
- Ao recarregar (F5), permanece na mesma seção
- Hash na URL mostra a rota atual

### ✅ Filtro por Empresa
- Substituído filtro de Status por filtro de Empresa
- Dropdown com todas as empresas cadastradas

### ✅ Filtros Automáticos
- Removido botão "Aplicar Filtros"
- Filtros aplicados automaticamente ao digitar ou selecionar
- Busca por cliente em tempo real
- Filtro de empresa automático
- Filtro de período automático

---

## 🐛 Problemas?

### Erro: "fly: command not found"
**Solução**: Feche e abra o terminal novamente após instalar

### Erro: "not logged in"
**Solução**: Execute `fly auth login`

### Erro: "permission denied"
**Solução**: Execute PowerShell como Administrador

### Mudanças não aparecem no navegador
**Solução**: Limpe o cache (Ctrl + Shift + Delete) ou abra em modo anônimo (Ctrl + Shift + N)

---

## 📞 Comandos Úteis

```powershell
# Ver logs em tempo real
fly logs

# Ver status da aplicação
fly status

# Reiniciar aplicação
fly apps restart visao-faturas

# Abrir aplicação no navegador
fly open

# Ver informações
fly info
```

---

## 📋 Status Atual

- ✅ Código implementado
- ✅ Código commitado no Git
- ✅ Push para GitHub realizado
- ⏳ Aguardando instalação do Fly CLI
- ⏳ Aguardando deploy para produção

---

## 🎉 Após o Deploy

Teste todas as funcionalidades:
1. Persistência de rota (F5)
2. Filtro por empresa
3. Filtros automáticos
4. Busca por cliente em tempo real

---

**Dica**: Use o arquivo `DEPLOY.bat` para facilitar! Basta clicar com botão direito e "Executar como Administrador".
