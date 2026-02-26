// Dashboard Module
const Dashboard = {
  async load() {
    try {
      const [clientes, faturas] = await Promise.all([
        api.getClientes(),
        api.getFaturas()
      ]);

      const stats = {
        clientes: clientes.length,
        faturas: faturas.length,
        pendentes: faturas.filter(f => f.status === 'pendente').length,
        vencidas: faturas.filter(f => f.status === 'vencido').length,
        totalPendente: faturas
          .filter(f => f.status === 'pendente')
          .reduce((sum, f) => sum + parseFloat(f.valor), 0),
        totalPago: faturas
          .filter(f => f.status === 'pago')
          .reduce((sum, f) => sum + parseFloat(f.valor), 0)
      };

      this.render(stats);
    } catch (error) {
      Utils.showNotification('Erro ao carregar dashboard', 'error');
      console.error(error);
    }
  },

  render(stats) {
    document.getElementById('stat-clientes').textContent = stats.clientes;
    document.getElementById('stat-faturas').textContent = stats.faturas;
    document.getElementById('stat-pendentes').textContent = stats.pendentes;
    document.getElementById('stat-vencidas').textContent = stats.vencidas;
    
    // Adicionar cards de valores se existirem
    const valorPendenteEl = document.getElementById('stat-valor-pendente');
    const valorPagoEl = document.getElementById('stat-valor-pago');
    
    if (valorPendenteEl) {
      valorPendenteEl.textContent = Utils.formatCurrency(stats.totalPendente);
    }
    if (valorPagoEl) {
      valorPagoEl.textContent = Utils.formatCurrency(stats.totalPago);
    }
  }
};
