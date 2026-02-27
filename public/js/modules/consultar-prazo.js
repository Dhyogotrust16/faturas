// Consultar Prazo Module
const ConsultarPrazo = {
  faturas: [],
  clientes: [],
  empresas: [],
  filtros: {},

  async load() {
    console.log('[ConsultarPrazo] Iniciando carregamento...');
    try {
      [this.faturas, this.clientes, this.empresas] = await Promise.all([
        api.getFaturas(),
        api.getClientes(),
        api.getEmpresas()
      ]);
      
      console.log('[ConsultarPrazo] Dados carregados:');
      console.log('[ConsultarPrazo] - Faturas:', this.faturas.length);
      console.log('[ConsultarPrazo] - Clientes:', this.clientes.length);
      console.log('[ConsultarPrazo] - Empresas:', this.empresas.length);
      
      // Verificar se faturas têm cliente_nome
      if (this.faturas.length > 0) {
        console.log('[ConsultarPrazo] Exemplo de fatura:', this.faturas[0]);
      }
      
      this.loadEmpresasSelect();
      this.aplicarFiltros();
      
      // Configurar listeners após um pequeno delay para garantir que o DOM está pronto
      setTimeout(() => {
        this.setupEventListeners();
      }, 100);
    } catch (error) {
      console.error('[ConsultarPrazo] Erro ao carregar:', error);
      Utils.showNotification('Erro ao carregar faturas', 'error');
    }
  },

  setupEventListeners() {
    const inputCliente = document.getElementById('filtro-cliente');
    const selectEmpresa = document.getElementById('filtro-empresa');
    const selectPeriodo = document.getElementById('filtro-periodo');

    console.log('[ConsultarPrazo] Configurando event listeners...');
    console.log('[ConsultarPrazo] Input cliente encontrado:', !!inputCliente);
    console.log('[ConsultarPrazo] Select empresa encontrado:', !!selectEmpresa);
    console.log('[ConsultarPrazo] Select período encontrado:', !!selectPeriodo);

    // Configurar filtro de busca com debounce manual (igual ao módulo Clientes)
    if (inputCliente) {
      // Remover listeners antigos se existirem
      if (this._handleInput) {
        inputCliente.removeEventListener('input', this._handleInput);
      }
      
      // Criar função bound para poder remover depois
      this._handleInput = (e) => {
        console.log('[ConsultarPrazo] Input detectado:', e.target.value);
        // Aplicar com debounce
        clearTimeout(this._debounceTimer);
        this._debounceTimer = setTimeout(() => {
          this.aplicarFiltros();
        }, 300);
      };
      
      inputCliente.addEventListener('input', this._handleInput);
      console.log('[ConsultarPrazo] Event listener adicionado ao input cliente');
    } else {
      console.error('[ConsultarPrazo] Campo de pesquisa NÃO encontrado!');
    }

    // Filtro imediato para os selects
    if (selectEmpresa) {
      selectEmpresa.addEventListener('change', () => {
        console.log('[ConsultarPrazo] Empresa selecionada, aplicando filtros...');
        this.aplicarFiltros();
      });
      console.log('[ConsultarPrazo] Event listener adicionado ao select empresa');
    }

    if (selectPeriodo) {
      selectPeriodo.addEventListener('change', () => {
        console.log('[ConsultarPrazo] Período selecionado, aplicando filtros...');
        this.aplicarFiltros();
      });
      console.log('[ConsultarPrazo] Event listener adicionado ao select período');
    }
  },

  loadEmpresasSelect() {
    const select = document.getElementById('filtro-empresa');
    if (!select) return;

    select.innerHTML = '<option value="">Todas</option>' +
      this.empresas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');
  },

  aplicarFiltros() {
    const inputCliente = document.getElementById('filtro-cliente');
    const selectEmpresa = document.getElementById('filtro-empresa');
    const selectPeriodo = document.getElementById('filtro-periodo');
    
    this.filtros = {
      cliente: inputCliente ? inputCliente.value.toLowerCase().trim() : '',
      empresa: selectEmpresa ? selectEmpresa.value : '',
      periodo: selectPeriodo ? selectPeriodo.value : ''
    };

    console.log('[ConsultarPrazo] ========================================');
    console.log('[ConsultarPrazo] Aplicando filtros:', this.filtros);
    console.log('[ConsultarPrazo] Total de faturas:', this.faturas.length);
    console.log('[ConsultarPrazo] Total de clientes:', this.clientes.length);

    let faturasFiltradas = [...this.faturas];
    console.log('[ConsultarPrazo] Faturas antes dos filtros:', faturasFiltradas.length);

    // Filtro por cliente (nome ou CPF/CNPJ)
    if (this.filtros.cliente) {
      console.log('[ConsultarPrazo] Filtrando por cliente:', this.filtros.cliente);
      
      faturasFiltradas = faturasFiltradas.filter(f => {
        // Verificar se a fatura já tem cliente_nome (vem da API)
        if (f.cliente_nome) {
          const nomeNaFatura = (f.cliente_nome || '').toLowerCase();
          const match = nomeNaFatura.includes(this.filtros.cliente);
          
          if (match) {
            console.log('[ConsultarPrazo] ✓ Match direto na fatura:', f.cliente_nome);
          }
          
          return match;
        }
        
        // Fallback: buscar cliente pelo ID
        const cliente = this.clientes.find(c => c.id === f.cliente_id);
        if (!cliente) {
          console.log('[ConsultarPrazo] ✗ Cliente não encontrado para fatura ID:', f.id);
          return false;
        }
        
        const nome = (cliente.nome || '').toLowerCase();
        const cpfCnpj = (cliente.cpf_cnpj || '').replace(/[^\d]/g, '');
        const busca = this.filtros.cliente.replace(/[^\d]/g, '');
        
        const matchNome = nome.includes(this.filtros.cliente);
        const matchCPF = busca && cpfCnpj.includes(busca);
        
        if (matchNome || matchCPF) {
          console.log('[ConsultarPrazo] ✓ Match encontrado:', cliente.nome);
        }
        
        return matchNome || matchCPF;
      });
      
      console.log('[ConsultarPrazo] Faturas após filtro de cliente:', faturasFiltradas.length);
    }

    // Filtro por empresa
    if (this.filtros.empresa) {
      console.log('[ConsultarPrazo] Filtrando por empresa:', this.filtros.empresa);
      const antes = faturasFiltradas.length;
      faturasFiltradas = faturasFiltradas.filter(f => f.empresa_id == this.filtros.empresa);
      console.log('[ConsultarPrazo] Faturas após filtro de empresa:', faturasFiltradas.length, '(antes:', antes + ')');
    }

    // Filtro por período
    if (this.filtros.periodo) {
      console.log('[ConsultarPrazo] Filtrando por período:', this.filtros.periodo);
      const antes = faturasFiltradas.length;
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (this.filtros.periodo === 'vencendo') {
        const seteDias = new Date(hoje.getTime() + 7 * 24 * 60 * 60 * 1000);
        faturasFiltradas = faturasFiltradas.filter(f => {
          const venc = new Date(f.data_vencimento);
          return venc >= hoje && venc <= seteDias && f.status === 'pendente';
        });
      } else if (this.filtros.periodo === 'mes') {
        faturasFiltradas = faturasFiltradas.filter(f => {
          const venc = new Date(f.data_vencimento);
          return venc.getMonth() === hoje.getMonth() && 
                 venc.getFullYear() === hoje.getFullYear();
        });
      } else if (this.filtros.periodo === 'vencidas') {
        faturasFiltradas = faturasFiltradas.filter(f => {
          const venc = new Date(f.data_vencimento);
          return venc < hoje && f.status === 'pendente';
        });
      }
      console.log('[ConsultarPrazo] Faturas após filtro de período:', faturasFiltradas.length, '(antes:', antes + ')');
    }

    console.log('[ConsultarPrazo] Total de faturas filtradas FINAL:', faturasFiltradas.length);
    console.log('[ConsultarPrazo] ========================================');
    this.render(faturasFiltradas);
  },

  render(faturas) {
    // Calcular totais
    const totalPrazo = faturas.reduce((sum, f) => sum + parseFloat(f.valor), 0);
    const totalPendente = faturas.filter(f => f.status === 'pendente')
      .reduce((sum, f) => sum + parseFloat(f.valor), 0);
    const totalPago = faturas.filter(f => f.status === 'pago')
      .reduce((sum, f) => sum + parseFloat(f.valor), 0);

    document.getElementById('total-prazo').textContent = Utils.formatCurrency(totalPrazo);
    document.getElementById('total-pendente').textContent = Utils.formatCurrency(totalPendente);
    document.getElementById('total-pago').textContent = Utils.formatCurrency(totalPago);

    // Renderizar tabela
    const tbody = document.querySelector('#consultar-prazo-table tbody');
    
    if (faturas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="empty-state">
            <p>Nenhuma fatura encontrada com os filtros aplicados</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = faturas.map(f => {
      return `
        <tr>
          <td>${f.cliente_nome}</td>
          <td>${Utils.formatDate(f.data_vencimento)}</td>
          <td><strong>${Utils.formatCurrency(f.valor)}</strong></td>
        </tr>
      `;
    }).join('');
  }
};
