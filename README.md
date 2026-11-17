<h1 align="center">Mural de Recados</h1>

<p align="center">
  Sistema web de recados com login e dois níveis de acesso, feito em equipe na FATEC Campinas
</p>

<p align="center">
  <img alt="PHP" src="https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white"/>
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white"/>
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"/>
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"/>
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"/>
</p>

---

### O que faz

O administrador adiciona, edita e exclui recados. O usuário comum só visualiza. O layout se adapta ao celular.

### Testar sem servidor

Abra o `login.html` direto no navegador. Nesse modo, os dados ficam salvos no `localStorage` do próprio navegador, sem banco.

| E-mail | Senha | Perfil |
|---|---|---|
| admin@demo.com | admin123 | Administrador |
| user@demo.com | user123 | Usuário |

### Rodar com PHP e MySQL

Precisa de PHP 8.0+, MySQL 5.7+ ou MariaDB 10+ e um servidor local como XAMPP, WAMP ou Laragon.

1. Crie o banco rodando o `database.sql` no phpMyAdmin ou no terminal do MySQL.
2. Coloque seus dados de acesso em `config/database.php`:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'mural_recados');
   define('DB_USER', 'seu_usuario');
   define('DB_PASS', 'sua_senha');
   ```
3. No `script.js`, troque `USE_MOCK_API` para `false`.
4. Copie a pasta `mural-recados/` para o `htdocs` (XAMPP) ou `www` (WAMP) e acesse `http://localhost/mural-recados/login.html`.

### Estrutura

```
mural-recados/
├── index.html        mural principal
├── login.html
├── cadastro.html
├── style.css
├── script.js         autenticação, chamadas à API e funções auxiliares
├── database.sql      criação das tabelas
├── api/              login, cadastro, logout e CRUD dos recados
└── config/
    └── database.php  conexão com o banco
```

### Segurança

- Senhas com `password_hash` (bcrypt)
- Prepared statements contra SQL injection
- Validação no front-end e no back-end
- Sessão PHP e checagem de permissão em cada rota de admin
- Escape de HTML no JavaScript contra XSS
