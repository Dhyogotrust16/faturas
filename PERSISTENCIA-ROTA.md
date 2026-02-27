# Persistência de Rota e Filtro por Empresa

## Implementações Realizadas

### 1. Persistência de Rota ao Recarregar Página

**Arquivo**: `public/js/router.js`

**Funcionalidade**:
- Quando o usuário navega para qualquer seção, a rota é salva no `localStorage`
- Ao recarregar a página (F5), o sistema:
  1. Verifica se há um hash na URL (`#consultar-prazo`)
  2. Se não houver hash, busca a última rota salva no `localStorage`
  3. Restaura a rota e define o hash na URL
  4. Carrega a seção correspondente

**Como funciona**:
```javascript
// Ao navegar, salva a rota
localStorage.setItem('lastRoute', routeName);
window.location.hash = routeName;

// Ao inicializar, restaura a rota
let hash = window.location.hash.substring(1);
if (!hash) {
  const lastRoute = localStorage.getItem('lastRoute');
  if (lastRoute) {
    hash = lastRoute;
    window.location.hash = hash; // Define o hash na URL
  }
}
```

**Resultado**: Agora quando você atualiza a página (F5), ela permanece na mesma seção em que estava.

---

### 2. Filtro por Empresa em "Consultar a Prazo"

**Arquivo**: `public/js/modules/consultar-prazo.js`

**Mudanças**:
- ❌ Removido: Filtro por Status
- ✅ Adicionado: Filtro por Empresa (dropdown)

**Filtros Disponíveis**:
1. **Buscar Cliente**: Campo de texto para buscar por nome ou CPF/CNPJ
2. **Empresa**: Dropdown com todas as empresas cadastradas
3. **Período**: Dropdown com opções (Todos, Vencendo em 7 dias, Este mês, Vencidas)

**Arquivo**: `public/index.html`

**Interface**:
```html
<div class="form-group">
  <label>Empresa</label>
  <select id="filtro-empresa">
    <option value="">Todas</option>
    <!-- Empresas carregadas dinamicamente -->
  </select>
</div>
```

**Como funciona**:
```javascript
// Carrega empresas no dropdown
loadEmpresasSelect() {
  const select = document.getElementById('filtro-empresa');
  select.innerHTML = '<option value="">Todas</option>' +
    this.empresas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
}

// Filtra faturas por empresa
if (this.filtros.empresa) {
  faturasFiltradas = faturasFiltradas.filter(f => f.empresa_id == this.filtros.empresa);
}
```

---

## Como Testar

### Teste 1: Persistência de Rota
1. Faça login no sistema
2. Navegue para "Consultar a Prazo"
3. Pressione F5 para recarregar a página
4. ✅ A página deve permanecer em "Consultar a Prazo"

### Teste 2: Filtro por Empresa
1. Acesse "Consultar a Prazo"
2. No filtro "Empresa", selecione uma empresa específica
3. Clique em "Aplicar Filtros"
4. ✅ Deve mostrar apenas faturas da empresa selecionada

### Teste 3: Combinação de Filtros
1. Digite um nome de cliente no campo "Buscar Cliente"
2. Selecione uma empresa no dropdown
3. Selecione um período (ex: "Vencendo em 7 dias")
4. Clique em "Aplicar Filtros"
5. ✅ Deve mostrar apenas faturas que atendem TODOS os critérios

---

## Arquivos Modificados

1. ✅ `public/js/router.js` - Persistência de rota
2. ✅ `public/js/modules/consultar-prazo.js` - Filtro por empresa
3. ✅ `public/index.html` - Interface do filtro

---

## Próximos Passos

Se precisar de ajustes:
- Adicionar mais opções de filtro
- Salvar filtros aplicados no localStorage
- Adicionar botão "Limpar Filtros"
- Exportar resultados filtrados para Excel/PDF
