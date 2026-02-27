// Faturas Module
const Faturas = {
  faturas: [],
  clientes: [],
  empresas: [],
  faturasFiltradas: [],

  async loadCadastrar() {
    try {
      this.clientes = await api.getClientes();
      this.empresas = await this.loadEmpresas();
      this.loadClientesSelect();
      this.loadEmpresasSelect();
    } catch (error) {
      Utils.showNotification('Erro ao carregar dados', 'error');
      console.error(error);
    }
  },

  async loadListar() {
    console.log('[Faturas] Carregando lista de faturas...');
    try {
      [this.faturas, this.clientes, this.empresas] = await Promise.all([
        api.getFaturas(),
        api.getClientes(),
        this.loadEmpresas()
      ]);
      console.log('[Faturas] Faturas carregadas:', this.faturas);
      console.log('[Faturas] Clientes carregados:', this.clientes);
      
      this.loadEmpresasFiltroSelect();
      this.faturasFiltradas = [...this.faturas];
      this.setupFiltroListeners();
      this.render();
    } catch (error) {
      console.error('[Faturas] Erro ao carregar:', error);
      Utils.showNotification('Erro ao carregar faturas', 'error');
    }
  },

  async loadUpload() {
    try {
      this.clientes = await api.getClientes();
      this.empresas = await this.loadEmpresas();
      this.loadClientesSelectUpload();
      this.loadEmpresasSelectUpload();
      this.setupUploadFileListener();
    } catch (error) {
      Utils.showNotification('Erro ao carregar dados', 'error');
      console.error(error);
    }
  },

  setupUploadFileListener() {
    const fileInput = document.getElementById('upload-arquivo');
    const pdfFields = document.getElementById('upload-fields-pdf');
    
    if (fileInput && pdfFields) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
          const isXLSX = file.name.endsWith('.xlsx');
          const isCSV = file.name.endsWith('.csv');
          
          // Mostrar campos extras apenas para PDF
          pdfFields.style.display = isPDF ? 'block' : 'none';
          
          // Ajustar required dos campos
          const pdfInputs = pdfFields.querySelectorAll('input, select');
          pdfInputs.forEach(input => {
            input.required = isPDF;
          });
          
          // Mostrar mensagem informativa
          if (isXLSX || isCSV) {
            console.log(`Arquivo ${isXLSX ? 'Excel' : 'CSV'} selecionado. Processamento automático.`);
          }
        }
      });
    }
  },

  async loadEmpresas() {
    try {
      const empresas = await api.getEmpresas();
      return empresas || [];
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      return [];
    }
  },

  async load() {
    // Método legado - redireciona para listar
    router.navigate('faturas-listar');
  },

  render() {
    console.log('[Faturas] Renderizando lista de faturas');
    console.log('[Faturas] Total de faturas:', this.faturasFiltradas.length);
    
    const tbody = document.querySelector('#faturas-table tbody');
    const countSpan = document.getElementById('faturas-count');
    
    if (!tbody) {
      console.error('[Faturas] Elemento tbody não encontrado!');
      return;
    }

    // Atualizar contador
    if (countSpan) {
      countSpan.textContent = `(${this.faturasFiltradas.length} de ${this.faturas.length})`;
    }
    
    if (this.faturasFiltradas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <p>Nenhuma fatura encontrada</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.faturasFiltradas.map(f => {
      const statusClass = f.status === 'pago' ? 'success' : 
                         f.status === 'vencido' ? 'danger' : 'warning';
      
      return `
        <tr>
          <td>${f.cliente_nome}</td>
          <td><strong>${f.numero_fatura}</strong></td>
          <td>${Utils.formatDate(f.data_vencimento)}</td>
          <td><strong>${Utils.formatCurrency(f.valor)}</strong></td>
          <td><span class="badge badge-${statusClass}">${f.status}</span></td>
          <td class="table-actions">
            <button class="btn btn-sm btn-primary" onclick="Faturas.edit(${f.id})" title="Editar fatura">✏️</button>
            <button class="btn btn-sm btn-success" onclick="Faturas.toggleStatus(${f.id}, '${f.status}')" title="Alterar status">
              ${f.status === 'pago' ? '↩️' : '✓'}
            </button>
            <button class="btn btn-sm btn-danger" onclick="Faturas.delete(${f.id})" title="Deletar">🗑️</button>
          </td>
        </tr>
      `;
    }).join('');
    
    console.log('[Faturas] Lista renderizada com sucesso');
  },

  setupFiltroListeners() {
    const pesquisaInput = document.getElementById('filtro-fatura-pesquisa');
    const empresaSelect = document.getElementById('filtro-fatura-empresa');
    const statusSelect = document.getElementById('filtro-fatura-status');

    // Debounce para o campo de pesquisa (aguarda 300ms após parar de digitar)
    if (pesquisaInput) {
      pesquisaInput.addEventListener('input', Utils.debounce(() => {
        this.aplicarFiltros();
      }, 300));
    }

    // Filtro imediato para os selects
    if (empresaSelect) {
      empresaSelect.addEventListener('change', () => {
        this.aplicarFiltros();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', () => {
        this.aplicarFiltros();
      });
    }
  },

  loadEmpresasFiltroSelect() {
    const select = document.getElementById('filtro-fatura-empresa');
    if (!select) return;

    const options = '<option value="">Todas as empresas</option>' +
      this.empresas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');

    select.innerHTML = options;
  },

  aplicarFiltros() {
    const pesquisa = document.getElementById('filtro-fatura-pesquisa')?.value.toLowerCase().trim() || '';
    const empresaId = document.getElementById('filtro-fatura-empresa')?.value || '';
    const status = document.getElementById('filtro-fatura-status')?.value || '';

    this.faturasFiltradas = this.faturas.filter(f => {
      // Filtro por pesquisa (nome ou CPF/CNPJ do cliente)
      if (pesquisa) {
        const cliente = this.clientes.find(c => c.id === f.cliente_id);
        if (cliente) {
          const nomeCliente = cliente.nome.toLowerCase();
          const cpfCnpjCliente = cliente.cpf_cnpj.replace(/\D/g, '');
          const pesquisaLimpa = pesquisa.replace(/\D/g, '');
          
          // Verifica se o nome do cliente COMEÇA com a pesquisa OU contém a pesquisa como palavra completa
          const palavrasPesquisa = pesquisa.split(' ').filter(p => p.length > 0);
          const palavrasCliente = nomeCliente.split(' ');
          
          // Verifica se todas as palavras da pesquisa estão no início de alguma palavra do nome
          const nomeMatch = palavrasPesquisa.every(palavraPesquisa => 
            palavrasCliente.some(palavraCliente => palavraCliente.startsWith(palavraPesquisa))
          );
          
          // Verifica CPF/CNPJ
          const cpfCnpjMatch = pesquisaLimpa.length > 0 && cpfCnpjCliente.includes(pesquisaLimpa);
          
          if (!nomeMatch && !cpfCnpjMatch) return false;
        } else {
          return false;
        }
      }

      // Filtro por empresa
      if (empresaId && f.empresa_id != empresaId) {
        return false;
      }

      // Filtro por status
      if (status && f.status !== status) {
        return false;
      }

      return true;
    });

    this.render();
  },

  loadClientesSelect() {
    const select = document.getElementById('fatura-cliente');
    if (!select) return;

    const options = '<option value="">Selecione um cliente</option>' +
      this.clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');

    select.innerHTML = options;
  },

  loadEmpresasSelect() {
    const select = document.getElementById('fatura-empresa');
    if (!select) return;

    const options = '<option value="">Selecione uma empresa</option>' +
      this.empresas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');

    select.innerHTML = options;
  },

  loadClientesSelectUpload() {
    const select = document.getElementById('upload-cliente');
    if (!select) return;

    const options = '<option value="">Selecione um cliente</option>' +
      this.clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('');

    select.innerHTML = options;
  },

  loadEmpresasSelectUpload() {
    const select = document.getElementById('upload-empresa');
    if (!select) return;

    const options = '<option value="">Selecione uma empresa</option>' +
      this.empresas.map(e => `<option value="${e.id}">${e.nome}</option>`).join('');

    select.innerHTML = options;
  },

  async create(event) {
    event.preventDefault();
    
    const empresaId = document.getElementById('fatura-empresa').value;
    
    if (!empresaId) {
      Utils.showNotification('Selecione uma empresa', 'error');
      return;
    }
    
    const data = {
      cliente_id: document.getElementById('fatura-cliente').value,
      empresa_id: empresaId,
      numero_fatura: document.getElementById('fatura-numero').value,
      valor: document.getElementById('fatura-valor').value,
      data_vencimento: document.getElementById('fatura-vencimento').value,
      status: document.getElementById('fatura-status').value
    };

    try {
      await api.createFatura(data);
      Utils.showNotification('Fatura criada com sucesso!');
      document.getElementById('fatura-form').reset();
      router.navigate('faturas-listar');
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  async upload(event) {
    event.preventDefault();
    
    const arquivo = document.getElementById('upload-arquivo').files[0];
    
    if (!arquivo) {
      Utils.showNotification('Selecione um arquivo', 'error');
      return;
    }

    const empresaId = document.getElementById('upload-empresa')?.value;
    
    if (!empresaId) {
      Utils.showNotification('Selecione uma empresa', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('arquivo', arquivo);
    formData.append('empresa_id', empresaId);

    // Apenas adicionar campos extras se for PDF
    if (arquivo.type === 'application/pdf') {
      const clienteId = document.getElementById('upload-cliente').value;
      const numeroFatura = document.getElementById('upload-numero').value;
      const valor = document.getElementById('upload-valor').value;
      const dataVencimento = document.getElementById('upload-vencimento').value;

      if (!clienteId || !numeroFatura || !valor || !dataVencimento) {
        Utils.showNotification('Preencha todos os campos para upload de PDF', 'error');
        return;
      }

      formData.append('cliente_id', clienteId);
      formData.append('numero_fatura', numeroFatura);
      formData.append('valor', valor);
      formData.append('data_vencimento', dataVencimento);
    }

    try {
      const result = await api.uploadFatura(formData);
      
      // Construir mensagem detalhada
      let mensagem = result.mensagem;
      
      if (result.clientesCriados > 0) {
        mensagem += `\n\n✅ ${result.clientesCriados} cliente(s) novo(s) cadastrado(s) automaticamente`;
      }
      
      // Mostrar mensagem com erros se houver
      if (result.erros && result.erros.length > 0) {
        const errosMsg = result.erros.slice(0, 5).join('\n');
        mensagem += '\n\n⚠️ Primeiros erros:\n' + errosMsg;
        Utils.showNotification(mensagem, 'warning');
      } else {
        Utils.showNotification(mensagem, 'success');
      }
      
      document.getElementById('upload-form').reset();
      document.getElementById('upload-fields-pdf').style.display = 'none';
      
      // Aguardar um pouco antes de navegar para dar tempo de ler a mensagem
      setTimeout(() => {
        router.navigate('faturas-listar');
      }, result.clientesCriados > 0 ? 3000 : 2000);
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  async edit(id) {
    console.log('[Faturas] Editando fatura ID:', id);
    try {
      // Buscar dados da fatura
      const faturas = await api.getFaturas();
      console.log('[Faturas] Faturas carregadas:', faturas.length);
      const fatura = faturas.find(f => f.id === id);
      console.log('[Faturas] Fatura encontrada:', fatura);
      
      if (!fatura) {
        Utils.showNotification('Fatura não encontrada', 'error');
        return;
      }

      // Buscar lista de clientes para o select
      const clientes = await api.getClientes();
      console.log('[Faturas] Clientes carregados:', clientes.length);
      const clienteSelect = document.getElementById('edit-cliente-id');
      clienteSelect.innerHTML = '<option value="">Selecione um cliente</option>' +
        clientes.map(c => `<option value="${c.id}" ${c.id === fatura.cliente_id ? 'selected' : ''}>${c.nome}</option>`).join('');

      // Preencher formulário
      document.getElementById('edit-fatura-id').value = fatura.id;
      document.getElementById('edit-numero-fatura').value = fatura.numero_fatura;
      document.getElementById('edit-valor').value = fatura.valor;
      document.getElementById('edit-data-vencimento').value = fatura.data_vencimento;
      document.getElementById('edit-status').value = fatura.status;

      console.log('[Faturas] Abrindo modal de edição');
      // Abrir modal
      const modal = document.getElementById('editar-fatura-modal');
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    } catch (error) {
      console.error('[Faturas] Erro ao editar:', error);
      Utils.showNotification('Erro ao carregar fatura', 'error');
      console.error(error);
    }
  },

  closeEditModal() {
    const modal = document.getElementById('editar-fatura-modal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    document.getElementById('form-editar-fatura').reset();
  },

  async submitEdit(event) {
    event.preventDefault();

    const id = document.getElementById('edit-fatura-id').value;
    const data = {
      cliente_id: document.getElementById('edit-cliente-id').value,
      numero_fatura: document.getElementById('edit-numero-fatura').value,
      valor: parseFloat(document.getElementById('edit-valor').value),
      data_vencimento: document.getElementById('edit-data-vencimento').value,
      status: document.getElementById('edit-status').value
    };

    try {
      await api.updateFatura(id, data);
      Utils.showNotification('Fatura atualizada com sucesso!', 'success');
      this.closeEditModal();
      await this.loadListar();
    } catch (error) {
      Utils.showNotification('Erro ao atualizar fatura', 'error');
      console.error(error);
    }
  },

  async toggleStatus(id, currentStatus) {
    // Se está marcando como pago, abrir modal de pagamento
    if (currentStatus !== 'pago') {
      this.openPagamentoModal(id);
    } else {
      // Se está desmarcando como pago, voltar para pendente
      if (!Utils.confirm('Deseja reverter o pagamento desta fatura?')) return;
      
      try {
        await api.updateFaturaStatus(id, 'pendente');
        Utils.showNotification('Status alterado para pendente!', 'success');
        await this.loadListar();
      } catch (error) {
        Utils.showNotification('Erro ao alterar status', 'error');
        console.error(error);
      }
    }
  },

  openPagamentoModal(id) {
    const fatura = this.faturasFiltradas.find(f => f.id === id);
    if (!fatura) {
      Utils.showNotification('Fatura não encontrada', 'error');
      return;
    }

    // Preencher dados da fatura
    document.getElementById('pag-fatura-id').value = fatura.id;
    document.getElementById('pag-cliente-nome').textContent = fatura.cliente_nome;
    document.getElementById('pag-numero-fatura').textContent = fatura.numero_fatura;
    document.getElementById('pag-valor-total').textContent = Utils.formatCurrency(fatura.valor);
    document.getElementById('pag-valor-original').value = fatura.valor;
    
    // Definir data atual
    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('pag-data').value = hoje;
    
    // Resetar form
    document.getElementById('form-pagamento').reset();
    document.getElementById('pag-fatura-id').value = fatura.id;
    document.getElementById('pag-valor-original').value = fatura.valor;
    document.getElementById('pag-data').value = hoje;
    
    // Mostrar modal
    document.getElementById('pagamento-modal').classList.add('active');
  },

  closePagamentoModal() {
    document.getElementById('pagamento-modal').classList.remove('active');
    document.getElementById('form-pagamento').reset();
    
    // Esconder todos os campos condicionais
    document.getElementById('pag-campos-parcial').style.display = 'none';
    document.getElementById('pag-campos-vale').style.display = 'none';
    document.getElementById('pag-campos-haver').style.display = 'none';
  },

  handleTipoPagamento() {
    const tipo = document.getElementById('pag-tipo').value;
    const valorOriginal = parseFloat(document.getElementById('pag-valor-original').value);
    
    // Esconder todos os campos
    document.getElementById('pag-campos-parcial').style.display = 'none';
    document.getElementById('pag-campos-vale').style.display = 'none';
    document.getElementById('pag-campos-haver').style.display = 'none';
    
    // Mostrar campos específicos
    if (tipo === 'parcial') {
      document.getElementById('pag-campos-parcial').style.display = 'block';
      document.getElementById('pag-valor-pago').value = valorOriginal;
      document.getElementById('pag-desconto').value = 0;
      this.calcularDesconto();
    } else if (tipo === 'vale') {
      document.getElementById('pag-campos-vale').style.display = 'block';
      document.getElementById('pag-valor-vale').value = valorOriginal;
    } else if (tipo === 'haver') {
      document.getElementById('pag-campos-haver').style.display = 'block';
      document.getElementById('pag-valor-haver').value = valorOriginal;
    }
  },

  calcularDesconto() {
    const valorOriginal = parseFloat(document.getElementById('pag-valor-original').value);
    const valorPago = parseFloat(document.getElementById('pag-valor-pago').value) || 0;
    const desconto = valorOriginal - valorPago;
    
    document.getElementById('pag-desconto').value = desconto.toFixed(2);
    this.atualizarResumo();
  },

  calcularValorPago() {
    const valorOriginal = parseFloat(document.getElementById('pag-valor-original').value);
    const desconto = parseFloat(document.getElementById('pag-desconto').value) || 0;
    const valorPago = valorOriginal - desconto;
    
    document.getElementById('pag-valor-pago').value = valorPago.toFixed(2);
    this.atualizarResumo();
  },

  atualizarResumo() {
    const valorOriginal = parseFloat(document.getElementById('pag-valor-original').value);
    const valorPago = parseFloat(document.getElementById('pag-valor-pago').value) || 0;
    const desconto = parseFloat(document.getElementById('pag-desconto').value) || 0;
    const saldoRestante = valorOriginal - valorPago - desconto;
    
    document.getElementById('pag-resumo-original').textContent = Utils.formatCurrency(valorOriginal);
    document.getElementById('pag-resumo-desconto').textContent = Utils.formatCurrency(desconto);
    document.getElementById('pag-resumo-pago').textContent = Utils.formatCurrency(valorPago);
    document.getElementById('pag-resumo-restante').textContent = Utils.formatCurrency(Math.max(0, saldoRestante));
  },

  async submitPagamento(event) {
    event.preventDefault();
    
    const faturaId = document.getElementById('pag-fatura-id').value;
    const tipo = document.getElementById('pag-tipo').value;
    const data = document.getElementById('pag-data').value;
    const observacoes = document.getElementById('pag-observacoes').value;
    
    let dadosPagamento = {
      tipo,
      data,
      observacoes
    };
    
    // Adicionar dados específicos por tipo
    if (tipo === 'total') {
      dadosPagamento.valorPago = parseFloat(document.getElementById('pag-valor-original').value);
    } else if (tipo === 'parcial') {
      dadosPagamento.valorPago = parseFloat(document.getElementById('pag-valor-pago').value);
      dadosPagamento.desconto = parseFloat(document.getElementById('pag-desconto').value);
    } else if (tipo === 'vale') {
      dadosPagamento.valorVale = parseFloat(document.getElementById('pag-valor-vale').value);
      dadosPagamento.observacoesVale = document.getElementById('pag-obs-vale').value;
    } else if (tipo === 'haver') {
      dadosPagamento.valorHaver = parseFloat(document.getElementById('pag-valor-haver').value);
      dadosPagamento.observacoesHaver = document.getElementById('pag-obs-haver').value;
    }
    
    try {
      // Por enquanto, apenas marcar como pago
      // TODO: Implementar endpoint no backend para salvar detalhes do pagamento
      await api.updateFaturaStatus(faturaId, 'pago');
      
      Utils.showNotification('Pagamento registrado com sucesso!', 'success');
      this.closePagamentoModal();
      await this.loadListar();
    } catch (error) {
      Utils.showNotification('Erro ao registrar pagamento', 'error');
      console.error(error);
    }
  },

  async delete(id) {
    if (!Utils.confirm('Deseja realmente deletar esta fatura?')) return;

    try {
      await api.deleteFatura(id);
      Utils.showNotification('Fatura deletada com sucesso!', 'success');
      await this.loadListar();
    } catch (error) {
      Utils.showNotification('Erro ao deletar fatura', 'error');
      console.error(error);
    }
  }
};

// Event Listeners
document.getElementById('fatura-form')?.addEventListener('submit', (e) => Faturas.create(e));
document.getElementById('upload-form')?.addEventListener('submit', (e) => Faturas.upload(e));
