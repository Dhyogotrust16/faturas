// Empresa Module
const Empresa = {
  empresas: [],
  empresaAtual: null,

  /**
   * Carrega a página de cadastro com formulário vazio
   */
  async loadCadastrar() {
    console.log('[Empresa] Carregando página de cadastro (formulário vazio)');
    this.empresaAtual = null;
    this.clearForm();
  },

  /**
   * Carrega a página de edição com dados da empresa
   */
  async loadEditar(id) {
    console.log('[Empresa] Carregando página de edição (com dados)');
    
    // Se não foi passado ID, pega da URL hash
    if (!id) {
      const hash = window.location.hash;
      const match = hash.match(/empresa-editar\/(\d+)/);
      if (match) {
        id = parseInt(match[1]);
      }
    }
    
    if (!id) {
      Utils.showNotification('ID da empresa não especificado', 'error');
      router.navigate('empresa-listar');
      return;
    }
    
    try {
      this.empresaAtual = await api.getEmpresa(id);
      this.renderForm();
    } catch (error) {
      console.error('[Empresa] Erro ao carregar dados:', error);
      Utils.showNotification('Erro ao carregar dados da empresa', 'error');
      router.navigate('empresa-listar');
    }
  },

  /**
   * Carrega a página de visualização de todas as empresas
   */
  async loadListar() {
    console.log('[Empresa] Carregando página de listagem');
    try {
      this.empresas = await api.getEmpresas();
      this.renderLista();
    } catch (error) {
      console.error('[Empresa] Erro ao carregar dados:', error);
      Utils.showNotification('Erro ao carregar empresas', 'error');
      this.empresas = [];
      this.renderLista();
    }
  },

  /**
   * Preenche o formulário com os dados da empresa
   */
  renderForm() {
    console.log('[Empresa] Renderizando formulário com dados');
    
    if (this.empresaAtual && this.empresaAtual.id) {
      document.getElementById('empresa-nome').value = this.empresaAtual.nome || '';
      document.getElementById('empresa-razao').value = this.empresaAtual.razao_social || '';
      document.getElementById('empresa-cnpj').value = this.empresaAtual.cnpj || '';
      document.getElementById('empresa-ie').value = this.empresaAtual.inscricao_estadual || '';
      document.getElementById('empresa-telefone').value = this.empresaAtual.telefone || '';
      document.getElementById('empresa-email').value = this.empresaAtual.email || '';
      document.getElementById('empresa-endereco').value = this.empresaAtual.endereco || '';
    } else {
      this.clearForm();
    }
  },

  /**
   * Renderiza a lista de todas as empresas
   */
  renderLista() {
    console.log('[Empresa] Renderizando lista de empresas');
    
    const tbody = document.querySelector('#empresas-table tbody');
    if (!tbody) {
      console.error('[Empresa] Elemento tbody não encontrado!');
      return;
    }
    
    if (this.empresas.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <p>Nenhuma empresa cadastrada</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.empresas.map(e => `
      <tr>
        <td><strong>${e.nome}</strong></td>
        <td>${e.razao_social}</td>
        <td>${e.cnpj}</td>
        <td>${e.email || '-'}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-primary" onclick="Empresa.editar(${e.id})" title="Editar">✏️</button>
          <button class="btn btn-sm btn-danger" onclick="Empresa.delete(${e.id})" title="Deletar">🗑️</button>
        </td>
      </tr>
    `).join('');
  },

  /**
   * Limpa o formulário
   */
  clearForm() {
    document.getElementById('empresa-nome').value = '';
    document.getElementById('empresa-razao').value = '';
    document.getElementById('empresa-cnpj').value = '';
    document.getElementById('empresa-ie').value = '';
    document.getElementById('empresa-telefone').value = '';
    document.getElementById('empresa-email').value = '';
    document.getElementById('empresa-endereco').value = '';
  },

  /**
   * Navega para a página de edição de uma empresa específica
   */
  editar(id) {
    router.navigate(`empresa-editar/${id}`);
  },

  /**
   * Deleta uma empresa
   */
  async delete(id) {
    if (!Utils.confirm('Deseja realmente deletar esta empresa?')) return;

    try {
      await api.deleteEmpresa(id);
      Utils.showNotification('Empresa deletada com sucesso!', 'success');
      this.loadListar();
    } catch (error) {
      console.error('[Empresa] Erro ao deletar:', error);
      Utils.showNotification(error.message || 'Erro ao deletar empresa', 'error');
    }
  },

  /**
   * Salva os dados da empresa (criar ou atualizar)
   */
  async save(event) {
    event.preventDefault();
    console.log('[Empresa] Salvando dados');
    
    const data = {
      nome: document.getElementById('empresa-nome').value,
      razao_social: document.getElementById('empresa-razao').value,
      cnpj: document.getElementById('empresa-cnpj').value.replace(/\D/g, ''),
      inscricao_estadual: document.getElementById('empresa-ie').value,
      telefone: document.getElementById('empresa-telefone').value.replace(/\D/g, ''),
      email: document.getElementById('empresa-email').value,
      endereco: document.getElementById('empresa-endereco').value
    };

    if (!data.nome || !data.razao_social || !data.cnpj) {
      Utils.showNotification('Preencha os campos obrigatórios: Nome Fantasia, Razão Social e CNPJ', 'error');
      return;
    }

    try {
      if (this.empresaAtual && this.empresaAtual.id) {
        // Atualizar empresa existente
        await api.updateEmpresa(this.empresaAtual.id, data);
        Utils.showNotification('Empresa atualizada com sucesso!', 'success');
      } else {
        // Criar nova empresa
        await api.createEmpresa(data);
        Utils.showNotification('Empresa criada com sucesso!', 'success');
      }
      
      // Navega para a página de listagem após salvar
      router.navigate('empresa-listar');
    } catch (error) {
      console.error('[Empresa] Erro ao salvar:', error);
      Utils.showNotification(error.message || 'Erro ao salvar dados da empresa', 'error');
    }
  }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  const empresaForm = document.getElementById('empresa-form');
  if (empresaForm) {
    empresaForm.addEventListener('submit', (e) => Empresa.save(e));
  }
  
  const empresaEditForm = document.getElementById('empresa-edit-form');
  if (empresaEditForm) {
    empresaEditForm.addEventListener('submit', (e) => Empresa.save(e));
  }
});
