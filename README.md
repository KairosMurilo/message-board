# 📋 Mural de Recados

Sistema de mural de recados com autenticação, dois níveis de acesso (admin e usuário) e design responsivo.

---

## 🚀 Como rodar localmente (Demo — sem servidor)

Abra o arquivo `login.html` diretamente no navegador.  
O modo demo usa `localStorage` para simular o banco de dados.

**Contas de demonstração:**
| E-mail           | Senha    | Tipo         |
|------------------|----------|--------------|
| admin@demo.com   | admin123 | Administrador|
| user@demo.com    | user123  | Usuário      |

> O admin pode adicionar, editar e excluir recados.  
> O usuário comum apenas visualiza.

---

## 🖥️ Como rodar com backend PHP + MySQL

### 1. Pré-requisitos
- PHP 8.0+
- MySQL 5.7+ ou MariaDB 10+
- Servidor local: XAMPP, WAMP, Laragon, ou similar

### 2. Configurar o banco de dados
```sql
-- No terminal MySQL ou phpMyAdmin, execute:
source /caminho/para/database.sql
```

### 3. Configurar conexão
Edite o arquivo `config/database.php`:
```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'mural_recados');
define('DB_USER', 'seu_usuario');
define('DB_PASS', 'sua_senha');
```

### 4. Ativar o backend real
Em `script.js`, mude a linha:
```js
const USE_MOCK_API = true;   // ← mude para false
```

### 5. Iniciar o servidor
- Copie a pasta `mural-recados/` para o diretório `htdocs` (XAMPP) ou `www` (WAMP)
- Acesse: `http://localhost/mural-recados/login.html`

---

## 📁 Estrutura de arquivos

```
mural-recados/
├── index.html          # Mural principal
├── login.html          # Tela de login
├── cadastro.html       # Tela de cadastro
├── style.css           # Estilos
├── script.js           # JS (Auth, API, helpers)
├── database.sql        # Schema do banco
│
├── api/
│   ├── login.php
│   ├── cadastro.php
│   ├── logout.php
│   ├── listar-recados.php
│   ├── adicionar-recado.php
│   ├── editar-recado.php
│   └── excluir-recado.php
│
└── config/
    └── database.php    # Conexão MySQL
```

---

## 🔒 Segurança implementada

- Senhas hasheadas com `password_hash` (bcrypt)
- Prepared statements (proteção contra SQL injection)
- Validação no frontend e no backend
- Controle de sessão PHP
- Proteção XSS via `escapeHtml()` no JS
- Verificação de permissão em cada endpoint (`requireAdmin()`)

---

## ✏️ Personalização

- Cores e tipografia: edite as variáveis CSS no topo de `style.css`
- Para tornar novos usuários admin automaticamente: altere a rota `api/cadastro.php`
- Para adicionar campos aos recados: ajuste as tabelas SQL e os formulários HTML
