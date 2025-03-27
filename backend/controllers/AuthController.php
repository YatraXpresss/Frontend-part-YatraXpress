<?php

require_once __DIR__ . '/../models/User.php';

class AuthController extends Controller {
    private $userModel;

    public function __construct() {
        try {
            $this->userModel = new User($this->db);
        } catch (Exception $e) {
            error_log("AuthController constructor error: " . $e->getMessage());
            throw $e;
        }
    }

    public function register() {
        try {
            // Get and validate input data
            $input = file_get_contents('php://input');
            error_log("Received registration data: " . $input);
            
            $data = json_decode($input, true);
            
            if (!$data) {
                error_log("JSON decode error: " . json_last_error_msg());
                return $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
            }

            // Validate required fields
            $requiredFields = ['name', 'email', 'password'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    error_log("Missing required field: " . $field);
                    return $this->jsonResponse(['error' => ucfirst($field) . ' is required'], 400);
                }
            }

            // Validate email format
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                error_log("Invalid email format: " . $data['email']);
                return $this->jsonResponse(['error' => 'Invalid email format'], 400);
            }

            // Validate password length
            if (strlen($data['password']) < 6) {
                error_log("Password too short");
                return $this->jsonResponse(['error' => 'Password must be at least 6 characters long'], 400);
            }

            // Validate phone number if provided
            if (!empty($data['phone']) && !preg_match('/^[0-9]{10}$/', $data['phone'])) {
                error_log("Invalid phone format: " . $data['phone']);
                return $this->jsonResponse(['error' => 'Invalid phone number format'], 400);
            }

            // Set default user type if not provided
            if (!isset($data['user_type']) || !in_array($data['user_type'], ['customer', 'rider'])) {
                $data['user_type'] = 'customer';
            }

            // Create user
            error_log("Attempting to create user with email: " . $data['email']);
            $user = $this->userModel->create($data);

            // Generate JWT token
            $token = $this->generateToken($user['id']);

            error_log("User created successfully with ID: " . $user['id']);
            return $this->jsonResponse([
                'message' => 'Registration successful',
                'user' => $user,
                'token' => $token
            ], 201);

        } catch (Exception $e) {
            error_log("Registration error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            
            // Handle specific error cases
            if (strpos($e->getMessage(), 'Email already registered') !== false) {
                return $this->jsonResponse(['error' => 'Email already registered'], 400);
            }
            
            return $this->jsonResponse(['error' => 'Registration failed. Please try again.'], 500);
        }
    }

    public function login() {
        try {
            $data = json_decode(file_get_contents('php://input'), true);

            if (!$data) {
                return $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
            }

            if (empty($data['email']) || empty($data['password'])) {
                return $this->jsonResponse(['error' => 'Email and password are required'], 400);
            }

            $user = $this->userModel->findByEmail($data['email']);

            if (!$user) {
                return $this->jsonResponse(['error' => 'Invalid email or password'], 401);
            }

            if (!password_verify($data['password'], $user['password'])) {
                return $this->jsonResponse(['error' => 'Invalid email or password'], 401);
            }

            // Generate JWT token
            $token = $this->generateToken($user['id']);

            // Remove password from user data
            unset($user['password']);

            return $this->jsonResponse([
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token
            ]);

        } catch (Exception $e) {
            error_log("Login error: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Login failed. Please try again.'], 500);
        }
    }

    private function generateToken($userId) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode([
            'user_id' => $userId,
            'exp' => time() + (60 * 60 * 24) // 24 hours
        ]);

        $base64UrlHeader = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
        $base64UrlPayload = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
        $base64UrlSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }
}