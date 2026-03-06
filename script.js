/**
 * MURAL DE RECADOS — script.js
 * Contém: Auth, API (mock com localStorage + integração real via fetch), e helpers de UI
 * 
 * Para usar com backend PHP real, substitua as funções em API_REAL
 * e defina USE_MOCK_API = false
 */

// ============================================================
//  CONFIGURAÇÃO
// ============================================================
const USE_MOCK_API = true; // false = usa backend PHP em /api/

// ============================================================
//  MÓDULO DE AUTENTICAÇÃO
// ============================================================
const Auth = {
  _key: 'mural_user',

  isLoggedIn() {
    return !!this.getUser();
  },

  getUser() {
    try {
      const raw = sessionStorage.getItem(this._key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  setUser(user) {
    sessionStorage.setItem(this._key, JSON.stringify(user));
  },

  logout() {
    sessionStorage.removeItem(this._key);
  },

  requireLogin() {
    const user = this.getUser();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    return user;
  }
};

// ============================================================
//  DADOS MOCK (armazenados no localStorage para persistência demo)
// ============================================================
const MockDB = {
  init() {
    if (!localStorage.getItem('mural_usuarios')) {
      const usuarios = [
        { id: 1, nome: 'Admin Demo', email: 'admin@demo.com', senha: 'admin123', tipo: 'admin', data_cadastro: new Date().toISOString() },
        { id: 2, nome: 'Usuário Demo', email: 'user@demo.com', senha: 'user123', tipo: 'comum', data_cadastro: new Date().toISOString() }
      ];
      localStorage.setItem('mural_usuarios', JSON.stringify(usuarios));
    }

    if (!localStorage.getItem('mural_recados')) {
      const hoje = new Date().toISOString();
      const ontem = new Date(Date.now() - 86400000).toISOString();
      const recados = [
        { id: 1, titulo: 'Bem-vindo ao Mural!', texto: 'Este é o mural de recados da equipe. Aqui você poderá ver avisos, informações importantes e mensagens para todos.\n\nFique à vontade para explorar!', data_cadastro: hoje, autor_id: 1, autor_nome: 'Admin Demo' },
        { id: 2, titulo: 'Reunião semanal', texto: 'Lembramos que toda segunda-feira às 09h temos nossa reunião de alinhamento semanal. A participação é importante para todos!', data_cadastro: ontem, autor_id: 1, autor_nome: 'Admin Demo' },
      ];
      localStorage.setItem('mural_recados', JSON.stringify(recados));
    }
  },

  getUsuarios() {
    return JSON.parse(localStorage.getItem('mural_usuarios') || '[]');
  },
  setUsuarios(arr) {
    localStorage.setItem('mural_usuarios', JSON.stringify(arr));
  },

  getRecados() {
    return JSON.parse(localStorage.getItem('mural_recados') || '[]');
  },
  setRecados(arr) {
    localStorage.setItem('mural_recados', JSON.stringify(arr));
  },

  nextId(arr) {
    return arr.length ? Math.max(...arr.map(x => x.id)) + 1 : 1;
  }
};

// Inicializa banco mock
MockDB.init();

// ============================================================
//  API — MOCK
// ============================================================
const API_MOCK = {
  async login(email, senha) {
    await delay(400);
    const usuarios = MockDB.getUsuarios();
    const user = usuarios.find(u => u.email === email && u.senha === senha);
    if (user) {
      const { senha: _, ...publicUser } = user;
      return { success: true, user: publicUser };
    }
    return { success: false, message: 'E-mail ou senha incorretos' };
  },

  async cadastro(nome, email, senha) {
    await delay(500);
    const usuarios = MockDB.getUsuarios();
    if (usuarios.find(u => u.email === email)) {
      return { success: false, message: 'Este e-mail já está em uso' };
    }
    const novoUsuario = {
      id: MockDB.nextId(usuarios),
      nome, email, senha,
      tipo: 'comum',
      data_cadastro: new Date().toISOString()
    };
    usuarios.push(novoUsuario);
    MockDB.setUsuarios(usuarios);
    return { success: true };
  },

  async listarRecados() {
    await delay(300);
    const recados = MockDB.getRecados();
    recados.sort((a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro));
    return { success: true, recados };
  },

  async adicionarRecado(titulo, texto, autorId, autorNome) {
    await delay(400);
    const recados = MockDB.getRecados();
    const novo = {
      id: MockDB.nextId(recados),
      titulo, texto,
      data_cadastro: new Date().toISOString(),
      autor_id: autorId,
      autor_nome: autorNome
    };
    recados.push(novo);
    MockDB.setRecados(recados);
    return { success: true, recado: novo };
  },

  async editarRecado(id, titulo, texto) {
    await delay(400);
    const recados = MockDB.getRecados();
    const idx = recados.findIndex(r => r.id == id);
    if (idx === -1) return { success: false, message: 'Recado não encontrado' };
    recados[idx].titulo = titulo;
    recados[idx].texto = texto;
    MockDB.setRecados(recados);
    return { success: true };
  },

  async excluirRecado(id) {
    await delay(350);
    const recados = MockDB.getRecados();
    const novos = recados.filter(r => r.id != id);
    if (novos.length === recados.length) return { success: false, message: 'Recado não encontrado' };
    MockDB.setRecados(novos);
    return { success: true };
  }
};

// ============================================================
//  API — REAL (backend PHP)
// ============================================================
const API_REAL = {
  async login(email, senha) {
    const res = await fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });
    return res.json();
  },

  async cadastro(nome, email, senha) {
    const res = await fetch('api/cadastro.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });
    return res.json();
  },

  async listarRecados() {
    const res = await fetch('api/listar-recados.php');
    return res.json();
  },

  async adicionarRecado(titulo, texto, autorId, autorNome) {
    const res = await fetch('api/adicionar-recado.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, texto })
    });
    return res.json();
  },

  async editarRecado(id, titulo, texto) {
    const res = await fetch('api/editar-recado.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, titulo, texto })
    });
    return res.json();
  },

  async excluirRecado(id) {
    const res = await fetch('api/excluir-recado.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    return res.json();
  }
};

// Seleciona API baseado na configuração
const API = USE_MOCK_API ? API_MOCK : API_REAL;

// ============================================================
//  HELPERS DE UI
// ============================================================

/** Formata data ISO para dd/mm/aaaa */
function formatarData(isoString) {
  try {
    const d = new Date(isoString);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${h}:${m}`;
  } catch {
    return isoString;
  }
}

/** Escapa HTML para evitar XSS */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Escapa para usar em atributos JS inline */
function escapeAttr(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/** Atraso simulado */
function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/** Mostra erro em campo */
function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

/** Limpa todos os erros de campo */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
}

/** Exibe mensagem global */
function showMsg(id, text) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = text;
    el.classList.remove('hidden');
  }
}

/** Controla loading do botão */
function setBtnLoading(id, loading) {
  const btn = document.getElementById(id);
  if (!btn) return;
  const txt = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (txt) txt.style.display = loading ? 'none' : '';
  if (loader) loader.style.display = loading ? 'flex' : 'none';
}

/** Alterna visibilidade de senha */
function toggleSenha(fieldId) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

/** Abre modal */
function abrirModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

/** Fecha modal */
function fecharModal(id) {
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    document.body.style.overflow = '';
  }
}

/** Fecha modal ao clicar no overlay */
function fecharModalOverlay(event, id) {
  if (event.target === event.currentTarget) fecharModal(id);
}

// Fecha modais com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(m => {
      m.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }
});
