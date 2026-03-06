<?php
// ============================================================
// api/adicionar-recado.php
// ============================================================
require_once '../config/database.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['success'=>false,'message'=>'Método inválido'],405);

$user  = requireAdmin();
$body  = getJsonBody();
$titulo = trim($body['titulo'] ?? '');
$texto  = trim($body['texto']  ?? '');

if (empty($titulo)) jsonResponse(['success'=>false,'message'=>'Título é obrigatório']);
if (empty($texto))  jsonResponse(['success'=>false,'message'=>'Texto é obrigatório']);

$db = getDB();
$stmt = $db->prepare('INSERT INTO recados (titulo, texto, autor_id) VALUES (?, ?, ?)');
$stmt->execute([$titulo, $texto, $user['id']]);
$id = $db->lastInsertId();

$rec = $db->prepare('SELECT r.*, u.nome AS autor_nome FROM recados r LEFT JOIN usuarios u ON r.autor_id=u.id WHERE r.id=?');
$rec->execute([$id]);
jsonResponse(['success'=>true,'recado'=>$rec->fetch()]);
