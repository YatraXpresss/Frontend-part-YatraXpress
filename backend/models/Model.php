<?php

require_once __DIR__ . '/../config/database.php';

class Model {
    protected $db;
    protected $table;

    public function __construct($db = null) {
        try {
            if ($db === null) {
                $this->db = Database::getInstance()->getConnection();
            } else {
                $this->db = $db;
            }
        } catch (Exception $e) {
            error_log("Model constructor error: " . $e->getMessage());
            throw $e;
        }
    }
} 