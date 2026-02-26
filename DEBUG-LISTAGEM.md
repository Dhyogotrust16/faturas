# Debug - Problema na Listagem de Clientes e Faturas

## Passos para Identificar o Problema

### 1. Abrir Console do Navegador
- Pressione F12
- Vá para a aba "Console"
- Limpe o console (ícone 🚫 ou Ctrl+L)

### 2. Testar Listagem de Clientes
1. Faça login no sistema
2. Clique em "Clientes" → "Listar Clientes"
3. Observe os logs no console:
   - `[Router] Navegando para: clientes-listar`
   - `[Router] Mostrando seção: clientes-listar-section`
   - `[Clientes] Carregando lista de clientes...`
   - `[Clientes] Clientes carregados: [...]`
   - `[Clientes] Renderizando lista de clientes`
   - `[Clientes] Total de clientes: X`

### 3. Testar Listagem de Faturas
1. Clique em "Faturas" → "Listar Faturas"
2. Observe os logs no console:
   - `[Router] Navegando para: faturas-listar`
   - `[Router] Mostrando seção: faturas-listar-section`
   - `[Faturas] Carregando lista de faturas...`
   - `[Faturas] Faturas carregadas: [...]`
   - `[Faturas] Renderizando lista de faturas`
   - `[Faturas] Total de faturas: X`

### 4. Verificar Erros
Procure por mensagens de erro em vermelho no console:
- Erros de rede (404, 500, etc.)
- Erros de JavaScript
- Erros de CORS
- Elementos não encontrados

### 5. Testar Manualmente no Console

Execute estes comandos no console para verificar:

```javascript
// Verificar se as tabelas existem
console.log('Tabela clientes:', document.querySelector('#clientes-table'));
console.log('Tbody clientes:', document.querySelector('#clientes-table tbody'));
console.log('Tabela faturas:', document.querySelector('#faturas-table'));
console.log('Tbody faturas:', document.querySelector('#faturas-table tbody'));

// Verificar se os módulos estão carregados
console.log('Módulo Clientes:', typeof Clientes);
console.log('Módulo Faturas:', typeof Faturas);

// Testar API manualmente
api.getClientes().then(c => console.log('Clientes da API:', c));
api.getFaturas().then(f => console.log('Faturas da API:', f));

// Forçar renderização
Clientes.loadListar();
Faturas.loadListar();
```

## Possíveis Causas e Soluções

### Causa 1: Tabela não encontrada
**Sintoma:** `[Clientes] Elemento tbody não encontrado!`
**Solução:** Verificar se o HTML da tabela está correto

### Causa 2: Erro na API
**Sintoma:** Erro 404 ou 500 nas requisições
**Solução:** Verificar se o backend está rodando e as rotas estão corretas

### Causa 3: Dados vazios
**Sintoma:** `Total de clientes: 0` ou `Total de faturas: 0`
**Solução:** Cadastrar alguns clientes/faturas primeiro

### Causa 4: Erro de JavaScript
**Sintoma:** Erro em vermelho no console
**Solução:** Verificar o erro específico e corrigir

### Causa 5: Seção não visível
**Sintoma:** Seção tem classe "hidden"
**Solução:** Verificar se o router está navegando corretamente

## Comandos Úteis

```javascript
// Ver estado atual do router
console.log('Rota atual:', router.currentRoute);

// Ver dados carregados
console.log('Clientes:', Clientes.clientes);
console.log('Faturas:', Faturas.faturas);

// Forçar navegação
router.navigate('clientes-listar');
router.navigate('faturas-listar');
```

## Checklist

- [ ] Console aberto e limpo
- [ ] Logs de navegação aparecem
- [ ] Logs de carregamento aparecem
- [ ] Dados são retornados da API
- [ ] Tabela existe no DOM
- [ ] Tbody existe no DOM
- [ ] Nenhum erro em vermelho
- [ ] Seção está visível (sem classe hidden)

## Compartilhar Resultados

Se o problema persistir, compartilhe:
1. Screenshot do console com os logs
2. Mensagens de erro (se houver)
3. Resultado dos comandos de teste manual
4. Network tab mostrando as requisições HTTP
