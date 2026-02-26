// Auth Module
const Auth = {
  async login(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('login-usuario').value;
    const senha = document.getElementById('login-senha').value;

    try {
      const data = await api.login(usuario, senha);
      api.setToken(data.token);
      
      // Salvar informação de admin
      localStorage.setItem('is_admin', data.usuario.is_admin);
      localStorage.setItem('usuario_nome', data.usuario.nome);
      
      this.showMainPage();
      Utils.showNotification(`Bem-vindo, ${data.usuario.nome}!`);
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  async registro(event) {
    event.preventDefault();
    
    const nome = document.getElementById('reg-nome').value;
    const usuario = document.getElementById('reg-usuario').value;
    const email = document.getElementById('reg-email').value;
    const senha = document.getElementById('reg-senha').value;

    try {
      await api.registro(nome, usuario, email, senha);
      Utils.showNotification('Conta criada com sucesso! Faça login.');
      this.showLogin();
    } catch (error) {
      Utils.showNotification(error.message, 'error');
    }
  },

  showLogin() {
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('registro-page').classList.add('hidden');
  },

  showRegistro() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('registro-page').classList.remove('hidden');
  },

  showMainPage() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('registro-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
    
    // Mostrar nome do usuário logado (apenas primeiro nome)
    const usuarioNome = localStorage.getItem('usuario_nome');
    const primeiroNome = usuarioNome ? usuarioNome.split(' ')[0] : 'Usuário';
    
    // Atualizar nome no desktop
    const usuarioLogadoEl = document.getElementById('usuario-logado');
    if (usuarioLogadoEl) {
      usuarioLogadoEl.textContent = `👤 ${primeiroNome}`;
    }
    
    // Atualizar nome no mobile
    const usuarioLogadoMobileEl = document.getElementById('usuario-logado-mobile');
    if (usuarioLogadoMobileEl) {
      usuarioLogadoMobileEl.textContent = `👤 ${primeiroNome}`;
      usuarioLogadoMobileEl.classList.remove('hidden');
    }
    
    // Mostrar menu de usuários apenas para admins
    const isAdmin = localStorage.getItem('is_admin');
    console.log('[Auth] is_admin no localStorage:', isAdmin);
    console.log('[Auth] Tipo:', typeof isAdmin);
    
    const navUsuarios = document.getElementById('nav-usuarios');
    console.log('[Auth] Elemento nav-usuarios:', navUsuarios);
    
    if (navUsuarios) {
      if (isAdmin === '1' || isAdmin === 1) {
        console.log('[Auth] Mostrando menu de usuários');
        navUsuarios.classList.remove('hidden');
      } else {
        console.log('[Auth] Escondendo menu de usuários');
        navUsuarios.classList.add('hidden');
      }
    } else {
      console.error('[Auth] Elemento nav-usuarios não encontrado!');
    }
    
    router.init();
  },

  logout() {
    if (!Utils.confirm('Deseja realmente sair?')) return;
    
    api.clearToken();
    location.reload();
  },

  checkAuth() {
    // Se tiver token, tentar validar fazendo uma requisição
    if (api.token) {
      // Tentar carregar dados para validar o token
      api.getClientes()
        .then(() => {
          this.showMainPage();
        })
        .catch(() => {
          // Token inválido, limpar e mostrar login
          api.clearToken();
          this.showLogin();
        });
    } else {
      this.showLogin();
    }
  }
};

// Event Listeners
document.getElementById('login-form')?.addEventListener('submit', (e) => Auth.login(e));
document.getElementById('registro-form')?.addEventListener('submit', (e) => Auth.registro(e));

// Check auth on load
Auth.checkAuth();
