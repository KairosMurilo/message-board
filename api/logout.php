<?php
// ============================================================
// api/logout.php
// ============================================================
require_once '../config/database.php';
session_destroy();
jsonResponse(['success'=>true]);
