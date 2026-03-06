<?php
// ============================================================
// api/cadastro.php
// ============================================================
require_once '../config/database.php';
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['success'=>false,'message'=>'Método não permitido'],405);

$body = getJsonBody();
$nome  = trim($body['nome']  ?? '');
$email = trim($body['email'] ?? '');
$senha = $body['senha'] ?? '';

if (empty($nome) || strlen($nome) < 2)         jsonResponse(['success'=>false,'message'=>'Nome inválido']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) jsonResponse(['success'=>false,'message'=>'E-mail inválido']);
if (strlen($senha) < 6)                         jsonResponse(['success'=>false,'message'=>'Senha deve ter pelo menos 6 caracteres']);

$db = getDB();

// Verifica duplicidade
$stmt = $db->prepare('SELECT id FROM usuarios WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) jsonResponse(['success'=>false,'message'=>'Este e-mail já está em uso']);

// Insere usuário
$hash = password_hash($senha, PASSWORD_BCRYPT);
$stmt = $db->prepare('INSERT INTO usuarios (nome, email, senha, tipo) VALUES (?, ?, ?, "comum")');
$stmt->execute([$nome, $email, $hash]);

jsonResponse(['success'=>true,'message'=>'Conta criada com sucesso']);
