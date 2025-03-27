<?php

abstract class Controller {
    protected $db;

    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }

    protected function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }

    protected function validateRequest($requiredFields = []) {
        $data = json_decode(file_get_contents('php://input'), true);
        $errors = [];

        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || empty($data[$field])) {
                $errors[] = "$field is required";
            }
        }

        if (!empty($errors)) {
            $this->jsonResponse(['errors' => $errors], 400);
        }

        return $data;
    }
}