<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../controllers/AuthController.php';

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Get the request path
    $request_uri = $_SERVER['REQUEST_URI'];
    $base_path = '/backend/api/';
    
    // Remove base path and query string
    $path = parse_url($request_uri, PHP_URL_PATH);
    $path = substr($path, strlen($base_path));
    $path = trim($path, '/');

    // Get request method
    $method = $_SERVER['REQUEST_METHOD'];

    error_log("Processing request: Method=$method, Path=$path");

    $authController = new AuthController();

    // Route the request
    switch ($path) {
        case 'auth/register':
            if ($method === 'POST') {
                $authController->register();
            } else {
                throw new Exception('Method not allowed');
            }
            break;

        case 'auth/login':
            if ($method === 'POST') {
                $authController->login();
            } else {
                throw new Exception('Method not allowed');
            }
            break;

        default:
            error_log("Route not found: $path");
            throw new Exception('Route not found');
    }
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    
    http_response_code(500);
    echo json_encode([
        'error' => $e->getMessage(),
        'path' => $path ?? 'unknown',
        'method' => $method ?? 'unknown'
    ]);
} 