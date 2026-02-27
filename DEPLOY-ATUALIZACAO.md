# Como Fazer Deploy das Atualizações

## Mudanças Implementadas

✅ **Persistência de Rota**: Ao recarregar a página (F5), você permanece na mesma seção
✅ **Filtro por Empresa**: Substituído filtro de Status por filtro de Empresa em "Consultar a Prazo"

---

## Opção 1: Deploy Automático via Fly.io (Recomendado)

### Passo 1: Commit das Mudanças
```bash
git add .
git commit -m "feat: adiciona persistência de rota e filtro por empresa"
```

### Passo 2: Deploy para Produção
```bash
fly deploy
```

### Passo 3: Verificar Deploy
```bash
fly status
fly logs
```

Acesse: https://visao-faturas.fly.dev/

---

## Opção 2: Testar Localmente Primeiro

### Passo 1: Rodar Localmente
```bash
node backend/server.js
```

### Passo 2: Acessar no Navegador
```
http://localhost:5000
```

### Passo 3: Testar as Funcionalidades

**Teste 1 - Persistência de Rota**:
1. Faça login
2. Navegue para "Consultar a Prazo"
3. Pressione F5
4. ✅ Deve permanecer em "Consultar a Prazo"

**Teste 2 - Filtro por Empresa**:
1. Acesse "Consultar a Prazo"
2. Selecione uma empresa no dropdown
3. Clique em "Aplicar Filtros"
4. ✅ Deve filtrar apenas faturas da empresa selecionada

### Passo 4: Se Tudo Estiver OK, Fazer Deploy
```bash
fly deploy
```

---

## Opção 3: Deploy Manual (Sem Git)

Se você não estiver usando Git:

### Passo 1: Fazer Deploy Direto
```bash
fly deploy
```

O Fly.io vai:
1. Ler o `Dockerfile`
2. Construir a imagem
3. Fazer deploy da aplicação
4. Reiniciar os containers

---

## Verificar se Deploy Foi Bem-Sucedido

### Ver Logs em Tempo Real
```bash
fly logs
```

### Ver Status da Aplicação
```bash
fly status
```

### Abrir a Aplicação no Navegador
```bash
fly open
```

Ou acesse diretamente: https://visao-faturas.fly.dev/

---

## Troubleshooting

### Problema: Deploy Falhou
```bash
# Ver logs detalhados
fly logs

# Reiniciar a aplicação
fly apps restart visao-faturas
```

### Problema: Mudanças Não Aparecem
1. Limpe o cache do navegador (Ctrl + Shift + Delete)
2. Ou abra em modo anônimo (Ctrl + Shift + N)
3. Ou force reload (Ctrl + F5)

### Problema: Erro de Permissão
```bash
# Fazer login novamente
fly auth login
```

---

## Arquivos Modificados Nesta Atualização

1. `public/js/router.js` - Persistência de rota
2. `public/js/modules/consultar-prazo.js` - Filtro por empresa
3. `public/index.html` - Interface do filtro

---

## Comandos Úteis

```bash
# Ver todas as apps no Fly.io
fly apps list

# Ver informações da app
fly info

# Ver volumes (banco de dados)
fly volumes list

# Fazer backup do banco
fly ssh console -C "cat /app/data/faturas.db" > backup-$(date +%Y%m%d).db

# Abrir console SSH
fly ssh console
```

---

## Próximos Passos Após Deploy

1. ✅ Testar persistência de rota
2. ✅ Testar filtro por empresa
3. ✅ Verificar se todos os filtros funcionam juntos
4. ✅ Testar em diferentes navegadores (Chrome, Firefox, Edge)
5. ✅ Testar em dispositivos móveis

---

## Suporte

Se encontrar problemas:
1. Verifique os logs: `fly logs`
2. Verifique o status: `fly status`
3. Reinicie a app: `fly apps restart visao-faturas`
