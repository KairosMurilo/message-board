-- ============================================================
-- MURAL DE RECADOS — Schema do banco de dados
-- Execute este arquivo para criar as tabelas necessárias
-- ============================================================

CREATE DATABASE IF NOT EXISTS mural_recados
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE mural_recados;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id             INT           NOT NULL AUTO_INCREMENT,
  nome           VARCHAR(100)  NOT NULL,
  email          VARCHAR(100)  NOT NULL,
  senha          VARCHAR(255)  NOT NULL,
  tipo           ENUM('admin','comum') NOT NULL DEFAULT 'comum',
  data_cadastro  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de recados
CREATE TABLE IF NOT EXISTS recados (
  id             INT           NOT NULL AUTO_INCREMENT,
  titulo         VARCHAR(200)  NOT NULL,
  texto          TEXT          NOT NULL,
  data_cadastro  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  autor_id       INT           NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_recados_autor
    FOREIGN KEY (autor_id) REFERENCES usuarios(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DADOS INICIAIS
-- Senha do admin: admin123 (já hasheada com bcrypt)
-- ============================================================
INSERT INTO usuarios (nome, email, senha, tipo) VALUES
  ('Administrador', 'admin@exemplo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- ATENÇÃO: troque a senha acima! O hash acima corresponde a "password" (senha de exemplo)
-- Para gerar um hash real no PHP: echo password_hash('sua_senha', PASSWORD_BCRYPT);
