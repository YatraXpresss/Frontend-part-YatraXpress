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

    private $registrationCache = [];
    private $registrationCacheExpiry = 300; // 5 minutes in seconds

    public function register() {
        try {
            // Get and validate input data
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);
            
            if (!$data) {
                return $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
            }

            // Check registration cache to prevent duplicate submissions
            $cacheKey = md5($input);
            if (isset($this->registrationCache[$cacheKey]) && 
                (time() - $this->registrationCache[$cacheKey]['timestamp']) < $this->registrationCacheExpiry) {
                return $this->registrationCache[$cacheKey]['response'];
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

            // Create user with optimized database transaction
            $user = $this->userModel->create($data);
            $token = $this->generateToken($user['id']);

            $response = [
                'message' => 'Registration successful',
                'user' => $user,
                'token' => $token
            ];

            // Cache the successful registration
            $this->registrationCache[$cacheKey] = [
                'timestamp' => time(),
                'response' => $this->jsonResponse($response, 201)
            ];

            return $this->registrationCache[$cacheKey]['response'];

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

    private $loginAttempts = [];
    private $maxAttempts = 5;
    private $lockoutTime = 900; // 15 minutes in seconds

    public function updateNotificationToken() {
        try {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            if (!$data || !isset($data['onesignal_token'])) {
                return $this->jsonResponse(['error' => 'OneSignal token is required'], 400);
            }

            $userId = $this->getUserIdFromToken();
            if (!$userId) {
                return $this->jsonResponse(['error' => 'Unauthorized'], 401);
            }

            $result = $this->userModel->update($userId, [
                'onesignal_token' => $data['onesignal_token']
            ]);

            if ($result) {
                return $this->jsonResponse(['message' => 'Notification token updated successfully']);
            }

            return $this->jsonResponse(['error' => 'Failed to update notification token'], 500);
        } catch (Exception $e) {
            error_log("Update notification token error: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to update notification token'], 500);
        }
    }

    public function toggleNotifications() {
        try {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            if (!$data || !isset($data['enabled'])) {
                return $this->jsonResponse(['error' => 'Notification status is required'], 400);
            }

            $userId = $this->getUserIdFromToken();
            if (!$userId) {
                return $this->jsonResponse(['error' => 'Unauthorized'], 401);
            }

            $result = $this->userModel->update($userId, [
                'notification_enabled' => $data['enabled'] ? 1 : 0
            ]);

            if ($result) {
                return $this->jsonResponse(['message' => 'Notification settings updated successfully']);
            }

            return $this->jsonResponse(['error' => 'Failed to update notification settings'], 500);
        } catch (Exception $e) {
            error_log("Toggle notifications error: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to update notification settings'], 500);
        }
    }

    private function checkRateLimit($email) {
        $now = time();
        if (isset($this->loginAttempts[$email])) {
            $attempts = array_filter($this->loginAttempts[$email], function($timestamp) use ($now) {
                return $now - $timestamp < $this->lockoutTime;
            });
            $this->loginAttempts[$email] = $attempts;
            
            if (count($attempts) >= $this->maxAttempts) {
                $timeLeft = $this->lockoutTime - ($now - min($attempts));
                throw new Exception("Too many login attempts. Please try again in " . ceil($timeLeft / 60) . " minutes.");
            }
        }
    }

    private function recordLoginAttempt($email) {
        if (!isset($this->loginAttempts[$email])) {
            $this->loginAttempts[$email] = [];
        }
        $this->loginAttempts[$email][] = time();
    }

    public function login() {
        try {
            $input = file_get_contents('php://input');
            $data = json_decode($input, true);

            if (!$data) {
                return $this->jsonResponse(['error' => 'Invalid JSON data'], 400);
            }

            if (empty($data['email']) || empty($data['password'])) {
                return $this->jsonResponse(['error' => 'Email and password are required'], 400);
            }

            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                return $this->jsonResponse(['error' => 'Invalid email format'], 400);
            }

            // Check rate limiting
            try {
                $this->checkRateLimit($data['email']);
            } catch (Exception $e) {
                return $this->jsonResponse(['error' => $e->getMessage()], 429);
            }

            $user = $this->userModel->findByEmail($data['email']);
            
            if (!$user || !password_verify($data['password'], $user['password'])) {
                $this->recordLoginAttempt($data['email']);
                return $this->jsonResponse(['error' => 'Invalid email or password'], 401);
            }

            // Generate JWT token with shorter expiration
            $token = $this->generateToken($user['id']);
            unset($user['password']);

            // Clear login attempts on successful login
            unset($this->loginAttempts[$data['email']]);

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
        try {
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
        } catch (Exception $e) {
            error_log("Token generation error: " . $e->getMessage());
            throw new Exception("Failed to generate token");
        }
    }
}