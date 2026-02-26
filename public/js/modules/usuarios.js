// Usuários Module (apenas para admins)
const Usuarios = {
  usuarios: [],
  editingId: null,

  async load() {
    console.log('[Usuarios] Carregando usuários...');
    try {
      this.usuarios = await api.getUsuarios();
      this.render();
    } catch (error) {
      console.error('[Usuarios] Erro ao carregar:', error);
      Utils.showNotification('Erro ao carregar usuários', 'error');
    }
  },

  render() {
    const tbody = document.querySelector('#usuarios-table tbody');
    
    if (!tbody) {
      console.error('[Usuarios] Elemento tbody não encontrado!');
      return;
    }
    
    if (this.usuarios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <p>Nenhum usuário cadastrado</p>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.usuarios.map(u => `
      <tr>
        <td><strong>${u.nome}</strong></td>
        <td>${u.usuario}</td>
        <td>${u.email || '-'}</td>
        <td>${u.is_admin ? '<span style="color: var(--secondary);">👑 Admin</span>' : 'Usuário'}</td>
        <td class="table-actions">
          <button class="btn btn-sm btn-primary" onclick="Usuarios.edit(${u.id})">✏️</button>
          ${!u.is_admin ? `<button class="btn btn-sm btn-danger" onclick="Usuarios.delete(${u.id})">🗑️</button>` : ''}
        </td>
      </tr>
    `).join('');
  },

  async save(event) {
    event.preventDefault();
    
    const data = {
      nome: document.getElementById('usuario-nome').value,
      usuario: document.getElementById('usuario-usuario').value,
      email: document.getElementById('usuario-email').value,
      senha: document.getElementById('usuario-senha').value,
      is_admin: document.getElementById('usuario-is-admin').checked ? 1 : 0
    };

    try {
      if (this.editingId) {
        // Se estiver editando e a senha estiver vazia, não enviar
        if (!data.senha) {
          delete data.senha;
        }
        await api.updateUsuario(this.editingId, data);
        Utils.showNotification('Usuário atualizado com sucesso!');
        this.editingId = null;
      } else {
        await api.createUsuario(data);
        Utils.showNotification('Usuário criado com sucesso!');
      }
      
      document.getElementById('usuario-form').reset();
      document.querySelector('#usuarios-section .card h3').textContent = 'Cadastrar Novo Usuário';
      this.load();
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  edit(id) {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) {
      console.error('[Usuarios] Usuário não encontrado:', id);
      return;
    }

    console.log('[Usuarios] Editando usuário:', usuario);
    
    this.editingId = id;
    
    // Preencher formulário
    document.getElementById('usuario-nome').value = usuario.nome || '';
    document.getElementById('usuario-usuario').value = usuario.usuario || '';
    document.getElementById('usuario-email').value = usuario.email || '';
    document.getElementById('usuario-senha').value = '';
    document.getElementById('usuario-senha').placeholder = 'Deixe em branco para manter a senha atual';
    document.getElementById('usuario-senha').required = false;
    document.getElementById('usuario-is-admin').checked = usuario.is_admin === 1;
    
    // Mudar título do formulário
    document.querySelector('#usuarios-section .card h3').textContent = 'Editar Usuário';
    
    // Mostrar botão cancelar
    document.getElementById('btn-cancelar-usuario').style.display = 'block';
    
    // Scroll para o formulário
    document.querySelector('#usuarios-section .card').scrollIntoView({ behavior: 'smooth' });
  },

  cancelEdit() {
    this.editingId = null;
    document.getElementById('usuario-form').reset();
    document.getElementById('usuario-senha').placeholder = '';
    document.getElementById('usuario-senha').required = true;
    document.querySelector('#usuarios-section .card h3').textContent = 'Cadastrar Novo Usuário';
    document.getElementById('btn-cancelar-usuario').style.display = 'none';
  },

  async delete(id) {
    if (!Utils.confirm('Deseja realmente deletar este usuário?')) return;

    try {
      await api.deleteUsuario(id);
      Utils.showNotification('Usuário deletado com sucesso!');
      this.load();
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  }
};

// Event Listeners
document.getElementById('usuario-form')?.addEventListener('submit', (e) => Usuarios.save(e));
