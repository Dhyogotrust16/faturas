# Como Instalar Fly CLI e Fazer Deploy

## ⚠️ Fly CLI Não Encontrado

O comando `fly` não está disponível no seu sistema. Você precisa instalar o Fly CLI primeiro.

---

## 📥 Opção 1: Instalar Fly CLI (Recomendado)

### No Windows (PowerShell como Administrador)

```powershell
# Abra PowerShell como Administrador e execute:
iwr https://fly.io/install.ps1 -useb | iex
```

Após a instalação:
1. Feche e abra o terminal novamente
2. Execute: `fly auth login`
3. Faça login no navegador
4. Execute: `fly deploy`

---

## 📥 Opção 2: Usar Fly.io Dashboard (Sem Instalar CLI)

Se você não quiser instalar o CLI, pode fazer deploy pelo dashboard:

### Passo 1: Preparar Arquivos
Os arquivos já estão prontos! As mudanças foram feitas em:
- `public/js/router.js`
- `public/js/modules/consultar-prazo.js`
- `public/index.html`

### Passo 2: Acessar Fly.io Dashboard
1. Acesse: https://fly.io/dashboard
2. Faça login com sua conta
3. Clique na aplicação "visao-faturas"

### Passo 3: Deploy via GitHub (Se Configurado)
Se você tem GitHub conectado:
1. Faça commit das mudanças:
   ```bash
   git add .
   git commit -m "feat: persistência de rota e filtro por empresa"
   git push
   ```
2. O deploy será automático

### Passo 4: Deploy Manual via Dashboard
1. No dashboard do Fly.io
2. Vá em "Deploy" > "Manual Deploy"
3. Siga as instruções na tela

---

## 📥 Opção 3: Instalar via Chocolatey (Windows)

Se você tem Chocolatey instalado:

```powershell
choco install flyctl
```

Depois:
```bash
fly auth login
fly deploy
```

---

## 📥 Opção 4: Instalar via Scoop (Windows)

Se você tem Scoop instalado:

```powershell
scoop install flyctl
```

Depois:
```bash
fly auth login
fly deploy
```

---

## 🚀 Após Instalar o Fly CLI

### 1. Fazer Login
```bash
fly auth login
```
Isso abrirá o navegador para você fazer login.

### 2. Verificar Instalação
```bash
fly version
```
Deve mostrar a versão instalada.

### 3. Verificar Apps
```bash
fly apps list
```
Deve mostrar "visao-faturas" na lista.

### 4. Fazer Deploy
```bash
fly deploy
```

### 5. Ver Logs
```bash
fly logs
```

### 6. Abrir Aplicação
```bash
fly open
```
Ou acesse: https://visao-faturas.fly.dev/

---

## 🔧 Comandos Úteis Após Instalação

```bash
# Ver status da aplicação
fly status

# Ver logs em tempo real
fly logs

# Reiniciar aplicação
fly apps restart visao-faturas

# Ver informações da app
fly info

# Abrir console SSH
fly ssh console

# Ver volumes (banco de dados)
fly volumes list

# Fazer backup do banco
fly ssh console -C "cat /app/data/faturas.db" > backup-$(Get-Date -Format "yyyyMMdd").db
```

---

## ✅ Verificar Deploy

Após o deploy (por qualquer método):

1. Acesse: https://visao-faturas.fly.dev/
2. Faça login: `daoliveira` / `123456`
3. Navegue para "Consultar a Prazo"
4. Pressione F5
5. ✅ Deve permanecer em "Consultar a Prazo"
6. Verifique o filtro "Empresa" (deve estar presente)
7. Verifique que o filtro "Status" foi removido

---

## 🐛 Troubleshooting

### Erro: "fly: command not found"
**Solução**: Feche e abra o terminal novamente após instalar

### Erro: "not logged in"
**Solução**: Execute `fly auth login`

### Erro: "app not found"
**Solução**: Verifique se está no diretório correto do projeto

### Erro: "permission denied"
**Solução**: Execute PowerShell como Administrador

---

## 📋 Resumo das Mudanças Prontas para Deploy

✅ **Persistência de Rota**
- Ao recarregar (F5), permanece na mesma seção
- Hash na URL mostra a rota atual

✅ **Filtro por Empresa**
- Substituído filtro de Status por filtro de Empresa
- Dropdown com todas as empresas cadastradas
- Funciona em conjunto com outros filtros

---

## 🎯 Próximos Passos

1. **Instalar Fly CLI** (escolha uma opção acima)
2. **Fazer Login**: `fly auth login`
3. **Deploy**: `fly deploy`
4. **Testar**: Acessar https://visao-faturas.fly.dev/

---

## 💡 Alternativa: Deploy Manual

Se você não conseguir instalar o Fly CLI, você pode:

1. Compactar os arquivos modificados
2. Acessar o dashboard do Fly.io
3. Fazer upload manual
4. Ou pedir para alguém com Fly CLI instalado fazer o deploy

---

## 📞 Links Úteis

- Documentação Fly.io: https://fly.io/docs/
- Instalação CLI: https://fly.io/docs/hands-on/install-flyctl/
- Dashboard: https://fly.io/dashboard
- Sua App: https://visao-faturas.fly.dev/

---

**Status Atual**: ✅ Código pronto | ⏳ Aguardando instalação do Fly CLI
