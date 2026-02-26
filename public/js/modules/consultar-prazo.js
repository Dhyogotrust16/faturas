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
      
      this.loadClientesSelect();
      this.aplicarFiltros();
    } catch (error) {
      Utils.showNotification('Erro ao carregar faturas', 'error');
    }
  },

  loadClientesSelect() {
    const select = document.getElementById('filtro-cliente');
    if (!select) return;

    select.innerHTML = '<option value="">Todos</option>' +
      this.clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');
  },

  aplicarFiltros() {
    this.filtros = {
      cliente: document.getElementById('filtro-cliente')?.value,
      status: document.getElementById('filtro-status')?.value,
      periodo: document.getElementById('filtro-periodo')?.value
    };

    let faturasFiltradas = [...this.faturas];

    // Filtro por cliente
    if (this.filtros.cliente) {
      faturasFiltradas = faturasFiltradas.filter(f => f.cliente_id == this.filtros.cliente);
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
          <td colspan="6" class="empty-state">
            <p>Nenhuma fatura encontrada com os filtros aplicados</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = faturas.map(f => {
      const vencimento = new Date(f.data_vencimento);
      const hoje = new Date();
      const statusClass = f.status === 'pago' ? 'success' : 
                         (vencimento < hoje ? 'danger' : 'warning');
      
      const notaParcela = f.numero_fatura.split('-');
      const nota = notaParcela[0];
      const parcela = notaParcela[1] || '1/1';

      return `
        <tr>
          <td><strong>${nota}</strong></td>
          <td>${parcela}</td>
          <td>${f.cliente_nome}</td>
          <td><strong>${Utils.formatCurrency(f.valor)}</strong></td>
          <td>${Utils.formatDate(f.data_vencimento)}</td>
          <td><span class="badge badge-${statusClass}">${f.status}</span></td>
        </tr>
      `;
    }).join('');
  }
};
