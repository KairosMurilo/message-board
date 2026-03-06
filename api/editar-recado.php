<?php
// ============================================================
// api/editar-recado.php
// ============================================================
require_once '../config/database.php';
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['success'=>false,'message'=>'Método inválido'],405);

requireAdmin();
$body   = getJsonBody();
$id     = (int)($body['id']     ?? 0);
$titulo = trim($body['titulo'] ?? '');
$texto  = trim($body['texto']  ?? '');

if (!$id)           jsonResponse(['success'=>false,'message'=>'ID inválido']);
if (empty($titulo)) jsonResponse(['success'=>false,'message'=>'Título é obrigatório']);
if (empty($texto))  jsonResponse(['success'=>false,'message'=>'Texto é obrigatório']);

$db = getDB();
$stmt = $db->prepare('UPDATE recados SET titulo=?, texto=? WHERE id=?');
$stmt->execute([$titulo, $texto, $id]);
if ($stmt->rowCount() === 0) jsonResponse(['success'=>false,'message'=>'Recado não encontrado'],404);

jsonResponse(['success'=>true]);
