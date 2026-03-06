<?php
/**
 * config/database.php
 * Configuração da conexão com o banco de dados MySQL
 */

define('DB_HOST', 'localhost');
define('DB_NAME', 'mural_recados');
define('DB_USER', 'root');        // ← altere para seu usuário
define('DB_PASS', '');            // ← altere para sua senha
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        try {
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados']);
            exit;
        }
    }
    return $pdo;
}

// Inicia sessão se ainda não iniciada
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Helper: retorna JSON e encerra
function jsonResponse(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Helper: verifica se usuário está logado
function requireAuth(): array {
    if (empty($_SESSION['user'])) {
        jsonResponse(['success' => false, 'message' => 'Não autenticado'], 401);
    }
    return $_SESSION['user'];
}

// Helper: verifica se usuário é admin
function requireAdmin(): array {
    $user = requireAuth();
    if ($user['tipo'] !== 'admin') {
        jsonResponse(['success' => false, 'message' => 'Acesso negado'], 403);
    }
    return $user;
}

// Helper: lê corpo JSON da requisição
function getJsonBody(): array {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}
