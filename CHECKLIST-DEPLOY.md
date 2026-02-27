# ✅ Checklist de Deploy - Visão Faturas

## 📋 Pré-Deploy

- [x] Código implementado
- [x] Persistência de rota funcionando
- [x] Filtro por empresa implementado
- [x] Filtro de status removido
- [x] Sem erros de sintaxe
- [ ] Testado localmente
- [ ] Deploy realizado

---

## 🧪 Testes Locais (Antes do Deploy)

### 1. Iniciar Servidor Local
```bash
node backend/server.js
```

### 2. Acessar no Navegador
```
http://localhost:5000
```

### 3. Fazer Login
- Usuário: `daoliveira`
- Senha: `123456`

### 4. Testar Persistência de Rota
- [ ] Navegar para "Dashboard"
- [ ] Pressionar F5
- [ ] ✅ Deve permanecer em "Dashboard"
- [ ] Navegar para "Consultar a Prazo"
- [ ] Pressionar F5
- [ ] ✅ Deve permanecer em "Consultar a Prazo"
- [ ] Navegar para "Clientes"
- [ ] Pressionar F5
- [ ] ✅ Deve permanecer em "Clientes"

### 5. Testar Filtro por Empresa
- [ ] Acessar "Consultar a Prazo"
- [ ] Verificar se dropdown "Empresa" está presente
- [ ] Verificar se dropdown "Status" NÃO está presente
- [ ] Selecionar uma empresa específica
- [ ] Clicar em "Aplicar Filtros"
- [ ] ✅ Deve mostrar apenas faturas da empresa selecionada
- [ ] Selecionar "Todas"
- [ ] Clicar em "Aplicar Filtros"
- [ ] ✅ Deve mostrar todas as faturas

### 6. Testar Busca por Cliente
- [ ] Digitar nome de um cliente
- [ ] ✅ Deve filtrar em tempo real
- [ ] Digitar CPF/CNPJ (com ou sem formatação)
- [ ] ✅ Deve filtrar corretamente

### 7. Testar Combinação de Filtros
- [ ] Buscar cliente + Selecionar empresa + Selecionar período
- [ ] Clicar em "Aplicar Filtros"
- [ ] ✅ Deve aplicar todos os filtros juntos

---

## 🚀 Deploy para Produção

### Opção 1: Deploy Simples
```bash
fly deploy
```

### Opção 2: Com Git
```bash
git add .
git commit -m "feat: persistência de rota e filtro por empresa"
git push
fly deploy
```

---

## ✅ Verificação Pós-Deploy

### 1. Verificar Status
```bash
fly status
```

Deve mostrar:
```
Status: running
Health: healthy
```

### 2. Ver Logs
```bash
fly logs
```

Procurar por:
- ✅ "Server running on port 8080"
- ✅ Sem erros de JavaScript
- ✅ Sem erros de banco de dados

### 3. Abrir Aplicação
```bash
fly open
```

Ou acessar: https://visao-faturas.fly.dev/

### 4. Testes em Produção

#### Teste 1: Login
- [ ] Acessar https://visao-faturas.fly.dev/
- [ ] Fazer login com `daoliveira` / `123456`
- [ ] ✅ Deve entrar no sistema

#### Teste 2: Persistência de Rota
- [ ] Navegar para "Consultar a Prazo"
- [ ] Verificar URL: deve ter `#consultar-prazo`
- [ ] Pressionar F5
- [ ] ✅ Deve permanecer em "Consultar a Prazo"
- [ ] URL ainda deve ter `#consultar-prazo`

#### Teste 3: Filtro por Empresa
- [ ] Acessar "Consultar a Prazo"
- [ ] Verificar se dropdown "Empresa" aparece
- [ ] Verificar se dropdown "Status" NÃO aparece
- [ ] Selecionar uma empresa
- [ ] Clicar em "Aplicar Filtros"
- [ ] ✅ Deve filtrar corretamente

#### Teste 4: Cache do Navegador
- [ ] Limpar cache (Ctrl + Shift + Delete)
- [ ] Ou abrir em modo anônimo (Ctrl + Shift + N)
- [ ] Fazer login novamente
- [ ] Testar todas as funcionalidades
- [ ] ✅ Tudo deve funcionar

---

## 🌐 Testes em Diferentes Navegadores

### Chrome
- [ ] Persistência de rota
- [ ] Filtro por empresa
- [ ] Busca por cliente

### Firefox
- [ ] Persistência de rota
- [ ] Filtro por empresa
- [ ] Busca por cliente

### Edge
- [ ] Persistência de rota
- [ ] Filtro por empresa
- [ ] Busca por cliente

### Safari (se disponível)
- [ ] Persistência de rota
- [ ] Filtro por empresa
- [ ] Busca por cliente

---

## 📱 Testes Mobile

### Chrome Mobile
- [ ] Abrir menu hambúrguer
- [ ] Navegar para "Consultar a Prazo"
- [ ] Pressionar F5
- [ ] ✅ Deve permanecer na mesma seção

### Safari Mobile (se disponível)
- [ ] Mesmos testes acima

---

## 🐛 Troubleshooting

### Problema: Mudanças não aparecem
**Solução**:
```bash
# Limpar cache do navegador
Ctrl + Shift + Delete

# Ou forçar reload
Ctrl + F5

# Ou abrir em modo anônimo
Ctrl + Shift + N
```

### Problema: Deploy falhou
**Solução**:
```bash
# Ver logs detalhados
fly logs

# Reiniciar aplicação
fly apps restart visao-faturas

# Verificar status
fly status
```

### Problema: Erro 500 no navegador
**Solução**:
```bash
# Ver logs do servidor
fly logs

# Verificar se banco de dados está OK
fly ssh console
ls -la /app/data/
```

### Problema: Filtro não funciona
**Solução**:
1. Abrir console do navegador (F12)
2. Verificar erros JavaScript
3. Verificar se empresas estão sendo carregadas
4. Verificar chamadas à API na aba Network

---

## 📊 Métricas de Sucesso

Após deploy, verificar:

- [ ] ✅ 0 erros no console do navegador
- [ ] ✅ 0 erros nos logs do servidor
- [ ] ✅ Persistência de rota funciona 100%
- [ ] ✅ Filtro por empresa funciona 100%
- [ ] ✅ Busca por cliente funciona 100%
- [ ] ✅ Combinação de filtros funciona 100%
- [ ] ✅ Performance OK (carregamento < 2s)

---

## 📝 Notas Finais

### Arquivos Modificados
1. `public/js/router.js`
2. `public/js/modules/consultar-prazo.js`
3. `public/index.html`

### Funcionalidades Adicionadas
1. ✅ Persistência de rota com localStorage
2. ✅ Hash na URL para rotas
3. ✅ Filtro por empresa em "Consultar a Prazo"

### Funcionalidades Removidas
1. ❌ Filtro por status em "Consultar a Prazo"

---

## ✅ Status Final

| Item | Status |
|------|--------|
| Código Implementado | ✅ |
| Testes Locais | ⏳ |
| Deploy Produção | ⏳ |
| Testes Produção | ⏳ |
| Aprovação Final | ⏳ |

---

**Próximo Passo**: Executar `fly deploy` e testar em produção!
