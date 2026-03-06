<?php
/**
 * api/login.php
 * Autentica o usuário e inicia a sessão
 */

require_once '../config/database.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Método não permitido'], 405);
}

$body = getJsonBody();
$email = trim($body['email'] ?? '');
$senha = $body['senha'] ?? '';

// Validações básicas
if (empty($email) || empty($senha)) {
    jsonResponse(['success' => false, 'message' => 'E-mail e senha são obrigatórios']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'E-mail inválido']);
}

// Busca usuário no banco
$db = getDB();
$stmt = $db->prepare('SELECT id, nome, email, senha, tipo FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($senha, $user['senha'])) {
    jsonResponse(['success' => false, 'message' => 'E-mail ou senha incorretos']);
}

// Salva sessão
unset($user['senha']); // nunca retornar a senha
$_SESSION['user'] = $user;

jsonResponse(['success' => true, 'user' => $user]);
