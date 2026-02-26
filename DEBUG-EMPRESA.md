# Guia de Debug - Problema Empresa

## Problema Relatado
Ao clicar em qualquer opção do submenu de Empresa, sempre aparece o formulário de cadastro.

## Passos para Debug

### 1. Abrir o Console do Navegador
- Pressione F12 ou Ctrl+Shift+I
- Vá para a aba "Console"

### 2. Limpar o Cache
- Pressione Ctrl+Shift+Delete
- Selecione "Imagens e arquivos em cache"
- Clique em "Limpar dados"
- OU pressione Ctrl+F5 para recarregar forçando o cache

### 3. Testar a Navegação
1. Faça login no sistema
2. Clique em "Empresa" no menu
3. No modal, clique em "Cadastrar Empresa"
4. Observe os logs no console (devem aparecer em cores):
   - Azul: Navegação do router
   - Verde: Seção sendo mostrada
   - Laranja: renderForm sendo executado

5. Volte e clique em "Empresa" novamente
6. Agora clique em "Listar Empresa"
7. Observe os logs no console:
   - Azul: Navegação do router
   - Verde: Seção sendo mostrada
   - Teal/Azul-esverdeado: renderInfo sendo executado

### 4. Verificar Elementos no DOM
No console, execute os seguintes comandos:

```javascript
// Verificar se as seções existem
console.log('Cadastrar:', document.getElementById('empresa-cadastrar-section'));
console.log('Listar:', document.getElementById('empresa-listar-section'));

// Verificar classes
console.log('Classes Cadastrar:', document.getElementById('empresa-cadastrar-section').className);
console.log('Classes Listar:', document.getElementById('empresa-listar-section').className);

// Verificar display
console.log('Display Cadastrar:', window.getComputedStyle(document.getElementById('empresa-cadastrar-section')).display);
console.log('Display Listar:', window.getComputedStyle(document.getElementById('empresa-listar-section')).display);
```

### 5. Testar Navegação Manual
No console, execute:

```javascript
// Ir para cadastrar
router.navigate('empresa-cadastrar');

// Aguardar 2 segundos e ir para listar
setTimeout(() => router.navigate('empresa-listar'), 2000);
```

### 6. Verificar Rotas
No console, execute:

```javascript
// Ver todas as rotas
console.log(router.routes);

// Ver rota atual
console.log('Rota atual:', router.currentRoute);
```

## O que Procurar

### Sintomas Esperados se Estiver Funcionando:
- Ao clicar em "Cadastrar Empresa": deve mostrar formulário com campos editáveis
- Ao clicar em "Listar Empresa": deve mostrar informações em formato de leitura (não editável)
- Os logs devem mostrar claramente qual método está sendo chamado (renderForm vs renderInfo)

### Sintomas de Problema:
- Sempre mostra o formulário independente da opção clicada
- Os logs mostram renderForm sendo chamado mesmo ao clicar em "Listar"
- As classes das seções não mudam corretamente
- Ambas as seções têm display: block ao mesmo tempo

## Possíveis Causas

1. **Cache do Navegador**: Arquivos JavaScript antigos ainda em uso
2. **Erro de JavaScript**: Algum erro impedindo a execução correta
3. **Conflito de IDs**: IDs duplicados no HTML
4. **Problema no Router**: Rotas não configuradas corretamente
5. **Problema no Modal**: Modal não fechando corretamente e interferindo

## Soluções Testadas

✅ Verificado HTML - seções existem e estão corretas
✅ Verificado CSS - classes hidden e section estão corretas
✅ Verificado Router - rotas configuradas corretamente
✅ Adicionados logs detalhados para debug
✅ Adicionadas verificações de elementos antes de usar

## Próximos Passos

Se o problema persistir após limpar o cache:
1. Compartilhe os logs do console
2. Compartilhe o resultado dos comandos de verificação do DOM
3. Tire um screenshot mostrando o problema
