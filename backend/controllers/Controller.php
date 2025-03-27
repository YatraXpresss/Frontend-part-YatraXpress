<?php

class Controller {
    protected $db;

    public function __construct() {
        try {
            require_once __DIR__ . '/../config/config.php';
            require_once __DIR__ . '/../config/database.php';
            $this->db = Database::getInstance()->getConnection();
        } catch (Exception $e) {
            error_log("Controller constructor error: " . $e->getMessage());
            throw $e;
        }
    }

    protected function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }
} 