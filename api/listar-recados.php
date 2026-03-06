<?php
// ============================================================
// api/listar-recados.php
// ============================================================
require_once '../config/database.php';
header('Content-Type: application/json');

requireAuth(); // somente usuários logados

$db = getDB();
$stmt = $db->query(
    'SELECT r.id, r.titulo, r.texto, r.data_cadastro, r.autor_id, u.nome AS autor_nome
     FROM recados r
     LEFT JOIN usuarios u ON r.autor_id = u.id
     ORDER BY r.data_cadastro DESC'
);
$recados = $stmt->fetchAll();

jsonResponse(['success'=>true,'recados'=>$recados]);
