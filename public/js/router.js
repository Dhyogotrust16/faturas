// Router - Gerencia navegação entre páginas
class Router {
  constructor() {
    this.routes = {
      'dashboard': {
        element: 'dashboard-section',
        navIndex: 0,
        onLoad: () => Dashboard.load()
      },
      'empresa-cadastrar': {
        element: 'empresa-cadastrar-section',
        navIndex: 1,
        onLoad: () => Empresa.loadCadastrar()
      },
      'empresa-editar': {
        element: 'empresa-cadastrar-section',
        navIndex: 1,
        onLoad: () => Empresa.loadEditar()
      },
      'empresa-listar': {
        element: 'empresa-listar-section',
        navIndex: 1,
        onLoad: () => Empresa.loadListar()
      },
      'clientes-cadastrar': {
        element: 'clientes-cadastrar-section',
        navIndex: 2,
        onLoad: () => Clientes.loadCadastrar()
      },
      'clientes-listar': {
        element: 'clientes-listar-section',
        navIndex: 2,
        onLoad: () => Clientes.loadListar()
      },
      'faturas-cadastrar': {
        element: 'faturas-cadastrar-section',
        navIndex: 3,
        onLoad: () => Faturas.loadCadastrar()
      },
      'faturas-listar': {
        element: 'faturas-listar-section',
        navIndex: 3,
        onLoad: () => Faturas.loadListar()
      },
      'faturas-upload': {
        element: 'faturas-upload-section',
        navIndex: 3,
        onLoad: () => Faturas.loadUpload()
      },
      'consultar-prazo': {
        element: 'consultar-prazo-section',
        navIndex: 4,
        onLoad: () => ConsultarPrazo.load()
      },
      'usuarios': {
        element: 'usuarios-section',
        navIndex: 5,
        onLoad: () => Usuarios.load()
      }
    };
    this.currentRoute = null;
  }

  navigate(routeName) {
    console.log(`[Router] Navegando para: ${routeName}`);
    
    const route = this.routes[routeName];
    if (!route) {
      console.error(`[Router] Rota não encontrada: ${routeName}`);
      Utils.showNotification(`Página não encontrada: ${routeName}`, 'error');
      return;
    }

    // Verificar se é rota de usuários e se o usuário é admin
    if (routeName === 'usuarios') {
      const isAdmin = localStorage.getItem('is_admin');
      if (isAdmin !== '1' && isAdmin !== 1) {
        console.warn('[Router] Acesso negado à página de usuários');
        Utils.showNotification('Acesso negado. Apenas administradores.', 'error');
        this.navigate('dashboard');
        return;
      }
    }

    // Atualizar URL com hash
    window.location.hash = routeName;

    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(s => {
      s.classList.add('hidden');
      s.classList.remove('fade-in');
    });
    
    // Remover active de todos os links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
    });
    
    // Mostrar seção atual
    const element = document.getElementById(route.element);
    if (element) {
      console.log(`[Router] Mostrando seção: ${route.element}`);
      element.classList.remove('hidden');
      element.classList.add('fade-in');
    } else {
      console.error(`[Router] Elemento não encontrado: ${route.element}`);
      Utils.showNotification('Erro ao carregar página', 'error');
      return;
    }
    
    // Ativar link do menu
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks[route.navIndex]) {
      navLinks[route.navIndex].classList.add('active');
    }
    
    // Executar callback de carregamento
    if (route.onLoad) {
      try {
        route.onLoad();
      } catch (error) {
        console.error(`[Router] Erro no onLoad:`, error);
        Utils.showNotification('Erro ao carregar conteúdo da página', 'error');
      }
    }
    
    this.currentRoute = routeName;
  }

  init() {
    console.log('Router.init() chamado');
    
    // Verificar se há hash na URL
    const hash = window.location.hash.substring(1); // Remove o #
    
    if (hash && this.routes[hash]) {
      console.log(`[Router] Restaurando rota do hash: ${hash}`);
      this.navigate(hash);
    } else {
      console.log('[Router] Nenhum hash válido, navegando para dashboard');
      this.navigate('dashboard');
    }

    // Listener para mudanças no hash
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash.substring(1);
      if (newHash && this.routes[newHash] && newHash !== this.currentRoute) {
        console.log(`[Router] Hash mudou para: ${newHash}`);
        this.navigate(newHash);
      }
    });
  }
}

const router = new Router();
