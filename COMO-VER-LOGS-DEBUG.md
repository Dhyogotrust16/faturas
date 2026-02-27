# 🔍 Como Ver os Logs de Debug

## 📋 Deploy Concluído com Logs

**Status**: ✅ Deploy realizado com logs de debug
**URL**: https://visao-faturas.fly.dev/

---

## 🧪 Como Testar e Ver os Logs

### Passo 1: Abrir o Console do Navegador

1. Acesse: https://visao-faturas.fly.dev/
2. Pressione **F12** (ou Ctrl+Shift+I)
3. Clique na aba **Console**

### Passo 2: Fazer Login

- Usuário: `daoliveira`
- Senha: `123456`

### Passo 3: Ir para "Consultar a Prazo"

Clique no menu "Consultar a prazo"

### Passo 4: Verificar os Logs Iniciais

No console, você deve ver:
```
[ConsultarPrazo] Configurando event listeners...
[ConsultarPrazo] Input cliente encontrado: true
[ConsultarPrazo] Select empresa encontrado: true
[ConsultarPrazo] Select período encontrado: true
[ConsultarPrazo] Event listener adicionado ao input cliente
[ConsultarPrazo] Event listener adicionado ao select empresa
[ConsultarPrazo] Event listener adicionado ao select período
```

### Passo 5: Digitar no Campo de Busca

Digite "diogo" no campo de busca.

Após 300ms, você deve ver no console:
```
[ConsultarPrazo] Input detectado, aplicando filtros...
[ConsultarPrazo] Aplicando filtros: {cliente: "diogo", empresa: "", periodo: ""}
[ConsultarPrazo] Total de faturas: XXX
[ConsultarPrazo] Total de clientes: XXX
[ConsultarPrazo] Filtrando por cliente: diogo
[ConsultarPrazo] Match encontrado: DIOGO XXXXX
[ConsultarPrazo] Faturas após filtro de cliente: X
[ConsultarPrazo] Total de faturas filtradas: X
```

---

## 🐛 Possíveis Problemas e Soluções

### Problema 1: Não vejo os logs

**Causa**: Cache do navegador

**Solução**:
1. Pressione **Ctrl + Shift + Delete**
2. Selecione "Imagens e arquivos em cache"
3. Clique em "Limpar dados"
4. Ou abra em modo anônimo: **Ctrl + Shift + N**

### Problema 2: Event listeners não são adicionados

**Logs esperados**:
```
[ConsultarPrazo] Input cliente encontrado: false
```

**Causa**: Elementos não encontrados no DOM

**Solução**: Verificar se a página carregou completamente

### Problema 3: Filtro não é aplicado ao digitar

**Logs esperados**:
```
[ConsultarPrazo] Input detectado, aplicando filtros...
```

**Se não aparecer**: Event listener não foi adicionado corretamente

**Solução**: 
1. Limpar cache
2. Recarregar página (Ctrl + F5)
3. Verificar console por erros JavaScript

### Problema 4: Nenhum match encontrado

**Logs esperados**:
```
[ConsultarPrazo] Filtrando por cliente: diogo
[ConsultarPrazo] Faturas após filtro de cliente: 0
```

**Causa**: Nome não corresponde ou cliente não tem faturas

**Solução**: Verificar se o nome está correto

---

## 📊 Interpretando os Logs

### Logs de Inicialização
```
[ConsultarPrazo] Configurando event listeners...
```
✅ Módulo carregado corretamente

### Logs de Event Listeners
```
[ConsultarPrazo] Event listener adicionado ao input cliente
```
✅ Filtro de busca configurado

### Logs de Filtro
```
[ConsultarPrazo] Input detectado, aplicando filtros...
```
✅ Usuário digitou e filtro está sendo aplicado

### Logs de Match
```
[ConsultarPrazo] Match encontrado: DIOGO XXXXX
```
✅ Cliente encontrado

### Logs de Resultado
```
[ConsultarPrazo] Total de faturas filtradas: 5
```
✅ Filtro aplicado com sucesso

---

## 🔧 Comandos Úteis no Console

### Ver todas as faturas carregadas
```javascript
ConsultarPrazo.faturas
```

### Ver todos os clientes carregados
```javascript
ConsultarPrazo.clientes
```

### Ver filtros atuais
```javascript
ConsultarPrazo.filtros
```

### Aplicar filtros manualmente
```javascript
ConsultarPrazo.aplicarFiltros()
```

---

## 📸 O Que Enviar se Não Funcionar

Se o filtro ainda não funcionar, envie:

1. **Screenshot do console** (F12 → Console)
2. **Resultado de**:
   ```javascript
   ConsultarPrazo.faturas.length
   ConsultarPrazo.clientes.length
   ConsultarPrazo.filtros
   ```
3. **Navegador e versão** (Chrome, Firefox, Edge, etc.)

---

## ✅ Teste Agora

1. Acesse: https://visao-faturas.fly.dev/
2. Pressione F12
3. Faça login
4. Vá em "Consultar a Prazo"
5. Digite no campo de busca
6. Veja os logs no console

---

**Os logs vão nos ajudar a identificar exatamente onde está o problema!** 🔍
