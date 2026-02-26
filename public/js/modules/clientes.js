// Clientes Module
const Clientes = {
  clientes: [],
  clientesFiltrados: [],
  editingId: null,

  async loadCadastrar() {
    // Apenas prepara o formulário se não estiver editando
    if (!this.editingId) {
      this.reset();
    }
  },

  async loadListar() {
    console.log('[Clientes] Carregando lista de clientes...');
    try {
      this.clientes = await api.getClientes();
      this.clientesFiltrados = this.clientes;
      console.log('[Clientes] Clientes carregados:', this.clientes);
      this.setupFiltroListeners();
      this.render();
    } catch (error) {
      console.error('[Clientes] Erro ao carregar:', error);
      Utils.showNotification('Erro ao carregar clientes', 'error');
    }
  },

  async load() {
    // Método legado - redireciona para listar
    router.navigate('clientes-listar');
  },

  setupFiltroListeners() {
    // Aguardar um pouco para garantir que o DOM está pronto
    setTimeout(() => {
      const pesquisaInput = document.getElementById('filtro-cliente-pesquisa');

      if (pesquisaInput) {
        console.log('[Clientes] Campo de pesquisa encontrado, configurando listener');
        
        // Remover listeners antigos se existirem
        pesquisaInput.removeEventListener('input', this._handleInput);
        
        // Criar função bound para poder remover depois
        this._handleInput = (e) => {
          console.log('[Clientes] Input detectado:', e.target.value);
          // Aplicar com debounce
          clearTimeout(this._debounceTimer);
          this._debounceTimer = setTimeout(() => {
            this.aplicarFiltros();
          }, 300);
        };
        
        pesquisaInput.addEventListener('input', this._handleInput);
        
        console.log('[Clientes] Filtro de pesquisa configurado com sucesso');
      } else {
        console.error('[Clientes] Campo de pesquisa NÃO encontrado!');
      }
    }, 100);
  },

  aplicarFiltros() {
    const pesquisaInput = document.getElementById('filtro-cliente-pesquisa');
    const pesquisa = pesquisaInput ? pesquisaInput.value.toLowerCase().trim() : '';
    
    console.log('[Clientes] Aplicando filtros. Pesquisa:', pesquisa);
    console.log('[Clientes] Total de clientes antes do filtro:', this.clientes.length);

    if (!pesquisa) {
      // Se não há pesquisa, mostrar todos
      this.clientesFiltrados = [...this.clientes];
      console.log('[Clientes] Sem filtro - mostrando todos');
    } else {
      // Aplicar filtro
      this.clientesFiltrados = this.clientes.filter(cliente => {
        const nomeCliente = (cliente.nome || '').toLowerCase();
        const cpfCliente = (cliente.cpf_cnpj || '').replace(/\D/g, '');
        const pesquisaSemMascara = pesquisa.replace(/\D/g, '');
        
        const matchNome = nomeCliente.includes(pesquisa);
        const matchCPF = pesquisaSemMascara && cpfCliente.includes(pesquisaSemMascara);
        
        const match = matchNome || matchCPF;
        if (match) {
          console.log(`[Clientes] ✓ Match: "${cliente.nome}"`);
        }
        
        return match;
      });
    }

    console.log('[Clientes] Clientes filtrados:', this.clientesFiltrados.length);
    this.render();
  },

  render() {
    console.log('[Clientes] Renderizando lista de clientes');
    console.log('[Clientes] Total de clientes:', this.clientesFiltrados.length);
    
    const tbody = document.querySelector('#clientes-table tbody');
    const countEl = document.getElementById('clientes-count');
    
    if (!tbody) {
      console.error('[Clientes] Elemento tbody não encontrado!');
      return;
    }

    // Atualizar contador
    if (countEl) {
      if (this.clientesFiltrados.length !== this.clientes.length) {
        countEl.textContent = `(${this.clientesFiltrados.length} de ${this.clientes.length})`;
      } else {
        countEl.textContent = `(${this.clientes.length})`;
      }
    }
    
    if (this.clientesFiltrados.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <p>Nenhum cliente encontrado</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.clientesFiltrados.map(c => `
      <tr>
        <td><strong>${c.nome}</strong></td>
        <td>${Utils.formatCPFCNPJ(c.cpf_cnpj)}</td>
        <td>${c.email || '-'}</td>
        <td>${c.telefone ? Utils.formatPhone(c.telefone) : '-'}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-primary" onclick="Clientes.edit(${c.id})">✏️ Editar</button>
          <button class="btn btn-sm btn-danger" onclick="Clientes.delete(${c.id})">🗑️ Deletar</button>
        </td>
      </tr>
    `).join('');
    
    console.log('[Clientes] Lista renderizada com sucesso');
  },

  async save(event) {
    event.preventDefault();
    
    const data = {
      nome: document.getElementById('cliente-nome').value,
      cpf_cnpj: document.getElementById('cliente-cpf').value.replace(/\D/g, ''),
      email: document.getElementById('cliente-email').value,
      telefone: document.getElementById('cliente-telefone').value.replace(/\D/g, ''),
      endereco: document.getElementById('cliente-endereco').value
    };

    try {
      if (this.editingId) {
        await api.updateCliente(this.editingId, data);
        Utils.showNotification('Cliente atualizado com sucesso!');
      } else {
        await api.createCliente(data);
        Utils.showNotification('Cliente criado com sucesso!');
      }
      
      this.reset();
      router.navigate('clientes-listar');
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  edit(id) {
    const cliente = this.clientes.find(c => c.id === id);
    if (!cliente) {
      console.error('[Clientes] Cliente não encontrado:', id);
      return;
    }

    console.log('[Clientes] Editando cliente:', cliente);
    
    // Definir o ID de edição ANTES de navegar
    this.editingId = id;
    
    // Navegar para a página de cadastro
    router.navigate('clientes-cadastrar');
    
    // Preencher os campos após um pequeno delay para garantir que a página foi carregada
    setTimeout(() => {
      const nomeInput = document.getElementById('cliente-nome');
      const cpfInput = document.getElementById('cliente-cpf');
      const emailInput = document.getElementById('cliente-email');
      const telefoneInput = document.getElementById('cliente-telefone');
      const enderecoInput = document.getElementById('cliente-endereco');
      const idInput = document.getElementById('cliente-id');
      
      if (nomeInput) nomeInput.value = cliente.nome || '';
      if (cpfInput) cpfInput.value = cliente.cpf_cnpj || '';
      if (emailInput) emailInput.value = cliente.email || '';
      if (telefoneInput) telefoneInput.value = cliente.telefone || '';
      if (enderecoInput) enderecoInput.value = cliente.endereco || '';
      if (idInput) idInput.value = cliente.id;
      
      console.log('[Clientes] Campos preenchidos com sucesso');
    }, 100);
  },

  async delete(id) {
    if (!Utils.confirm('Deseja realmente deletar este cliente?')) return;

    try {
      await api.deleteCliente(id);
      Utils.showNotification('Cliente deletado com sucesso!');
      this.loadListar();
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  reset() {
    document.getElementById('cliente-form').reset();
    document.getElementById('cliente-id').value = '';
    this.editingId = null;
  }
};

// Event Listeners
document.getElementById('cliente-form')?.addEventListener('submit', (e) => Clientes.save(e));
