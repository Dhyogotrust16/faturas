// Consultar Prazo Module
const ConsultarPrazo = {
  faturas: [],
  clientes: [],
  filtros: {},

  async load() {
    try {
      [this.faturas, this.clientes] = await Promise.all([
        api.getFaturas(),
        api.getClientes()
      ]);
      
      this.aplicarFiltros();
      
      // Event listener para busca em tempo real
      const inputCliente = document.getElementById('filtro-cliente');
      if (inputCliente) {
        inputCliente.addEventListener('input', () => this.aplicarFiltros());
      }
    } catch (error) {
      Utils.showNotification('Erro ao carregar faturas', 'error');
    }
  },

  aplicarFiltros() {
    this.filtros = {
      cliente: document.getElementById('filtro-cliente')?.value.toLowerCase().trim(),
      status: document.getElementById('filtro-status')?.value,
      periodo: document.getElementById('filtro-periodo')?.value
    };

    let faturasFiltradas = [...this.faturas];

    // Filtro por cliente (nome ou CPF/CNPJ)
    if (this.filtros.cliente) {
      faturasFiltradas = faturasFiltradas.filter(f => {
        const cliente = this.clientes.find(c => c.id === f.cliente_id);
        if (!cliente) return false;
        
        const nome = (cliente.nome || '').toLowerCase();
        const cpfCnpj = (cliente.cpf_cnpj || '').replace(/[^\d]/g, '');
        const busca = this.filtros.cliente.replace(/[^\d]/g, '');
        
        return nome.includes(this.filtros.cliente) || cpfCnpj.includes(busca);
      });
    }

    // Filtro por status
    if (this.filtros.status) {
      faturasFiltradas = faturasFiltradas.filter(f => f.status === this.filtros.status);
    }

    // Filtro por período
    if (this.filtros.periodo) {
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
    }

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
