// Dashboard Module
const Dashboard = {
  charts: {},
  empresaFiltro: '',
  
  async load() {
    try {
      // Carregar empresas para o filtro
      await this.loadEmpresaFilter();
      
      // Carregar dados e renderizar
      await this.loadData();
      
      // Event listener para filtro de empresa
      document.getElementById('dashboard-empresa-filter').addEventListener('change', (e) => {
        this.empresaFiltro = e.target.value;
        this.loadData();
      });
    } catch (error) {
      Utils.showNotification('Erro ao carregar dashboard', 'error');
      console.error(error);
    }
  },
  
  async loadEmpresaFilter() {
    try {
      const empresas = await api.getEmpresas();
      const select = document.getElementById('dashboard-empresa-filter');
      
      select.innerHTML = '<option value="">Todas as Empresas</option>';
      empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa.id;
        option.textContent = empresa.nome;
        select.appendChild(option);
      });
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
    }
  },
  
  async loadData() {
    try {
      const [clientes, todasFaturas] = await Promise.all([
        api.getClientes(),
        api.getFaturas()
      ]);
      
      // Filtrar faturas por empresa se selecionada
      const faturas = this.empresaFiltro 
        ? todasFaturas.filter(f => f.empresa_id == this.empresaFiltro)
        : todasFaturas;

      const stats = {
        clientes: clientes.length,
        faturas: faturas.length,
        pendentes: faturas.filter(f => f.status === 'pendente').length,
        vencidas: faturas.filter(f => f.status === 'vencido').length
      };

      this.render(stats);
      this.renderCharts(faturas, clientes);
    } catch (error) {
      Utils.showNotification('Erro ao carregar dados', 'error');
      console.error(error);
    }
  },

  render(stats) {
    document.getElementById('stat-clientes').textContent = stats.clientes;
    document.getElementById('stat-faturas').textContent = stats.faturas;
    document.getElementById('stat-pendentes').textContent = stats.pendentes;
    document.getElementById('stat-vencidas').textContent = stats.vencidas;
  },
  
  renderCharts(faturas, clientes) {
    this.renderStatusChart(faturas);
    this.renderValorStatusChart(faturas);
    this.renderMesChart(faturas);
    this.renderClientesChart(faturas, clientes);
  },
  
  renderStatusChart(faturas) {
    const ctx = document.getElementById('chart-status');
    if (!ctx) return;
    
    const statusCount = {
      'pendente': faturas.filter(f => f.status === 'pendente').length,
      'pago': faturas.filter(f => f.status === 'pago').length,
      'vencido': faturas.filter(f => f.status === 'vencido').length
    };
    
    if (this.charts.status) {
      this.charts.status.destroy();
    }
    
    this.charts.status = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Pendente', 'Pago', 'Vencido'],
        datasets: [{
          data: [statusCount.pendente, statusCount.pago, statusCount.vencido],
          backgroundColor: ['#FF9800', '#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },
  
  renderValorStatusChart(faturas) {
    const ctx = document.getElementById('chart-valor-status');
    if (!ctx) return;
    
    const valorStatus = {
      'pendente': faturas.filter(f => f.status === 'pendente').reduce((sum, f) => sum + parseFloat(f.valor || 0), 0),
      'pago': faturas.filter(f => f.status === 'pago').reduce((sum, f) => sum + parseFloat(f.valor || 0), 0),
      'vencido': faturas.filter(f => f.status === 'vencido').reduce((sum, f) => sum + parseFloat(f.valor || 0), 0)
    };
    
    if (this.charts.valorStatus) {
      this.charts.valorStatus.destroy();
    }
    
    this.charts.valorStatus = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pendente', 'Pago', 'Vencido'],
        datasets: [{
          label: 'Valor Total (R$)',
          data: [valorStatus.pendente, valorStatus.pago, valorStatus.vencido],
          backgroundColor: ['#FF9800', '#10b981', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            }
          }
        }
      }
    });
  },
  
  renderMesChart(faturas) {
    const ctx = document.getElementById('chart-mes');
    if (!ctx) return;
    
    // Agrupar por mês
    const meses = {};
    faturas.forEach(f => {
      const data = new Date(f.data_vencimento);
      const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
      meses[mesAno] = (meses[mesAno] || 0) + 1;
    });
    
    // Ordenar por data
    const mesesOrdenados = Object.keys(meses).sort((a, b) => {
      const [mesA, anoA] = a.split('/');
      const [mesB, anoB] = b.split('/');
      return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
    });
    
    // Pegar últimos 6 meses
    const ultimos6Meses = mesesOrdenados.slice(-6);
    
    if (this.charts.mes) {
      this.charts.mes.destroy();
    }
    
    this.charts.mes = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ultimos6Meses,
        datasets: [{
          label: 'Faturas',
          data: ultimos6Meses.map(m => meses[m]),
          borderColor: '#1B5E3E',
          backgroundColor: 'rgba(27, 94, 62, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  },
  
  renderClientesChart(faturas, clientes) {
    const ctx = document.getElementById('chart-clientes');
    if (!ctx) return;
    
    // Contar faturas por cliente
    const clienteCount = {};
    faturas.forEach(f => {
      const cliente = clientes.find(c => c.id === f.cliente_id);
      if (cliente) {
        const nome = cliente.nome;
        clienteCount[nome] = (clienteCount[nome] || 0) + 1;
      }
    });
    
    // Ordenar e pegar top 10
    const top10 = Object.entries(clienteCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    if (this.charts.clientes) {
      this.charts.clientes.destroy();
    }
    
    this.charts.clientes = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: top10.map(([nome]) => nome.length > 20 ? nome.substring(0, 20) + '...' : nome),
        datasets: [{
          label: 'Faturas',
          data: top10.map(([, count]) => count),
          backgroundColor: '#FF9800'
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }
};
