<?php
// ============================================================
// api/excluir-recado.php
// ============================================================
require_once '../config/database.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['success'=>false,'message'=>'Método inválido'],405);

requireAdmin();
$body = getJsonBody();
$id   = (int)($body['id'] ?? 0);

if (!$id) jsonResponse(['success'=>false,'message'=>'ID inválido']);

$db = getDB();
$stmt = $db->prepare('DELETE FROM recados WHERE id=?');
$stmt->execute([$id]);
if ($stmt->rowCount() === 0) jsonResponse(['success'=>false,'message'=>'Recado não encontrado'],404);

jsonResponse(['success'=>true]);
