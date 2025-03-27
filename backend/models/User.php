<?php

class User extends Model {
    protected $table = 'users';

    public function findById($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT u.*, up.address, up.preferences
                FROM {$this->table} u
                LEFT JOIN user_profiles up ON u.id = up.user_id
                WHERE u.id = ?
            ");
            $stmt->execute([$id]);
            return $stmt->fetch();
        } catch (PDOException $e) {
            error_log("Database error in User::findById: " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    private $userCache = [];

    public function findByEmail($email) {
        try {
            // Check cache first
            $cacheKey = 'email_' . $email;
            if (isset($this->userCache[$cacheKey])) {
                return $this->userCache[$cacheKey];
            }

            $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE email = ?");
            $stmt->execute([$email]);
            $result = $stmt->fetch();

            // Cache the result
            if ($result) {
                $this->userCache[$cacheKey] = $result;
            }

            return $result;
        } catch (PDOException $e) {
            error_log("Database error in User::findByEmail: " . $e->getMessage());
            throw new Exception("Database error occurred");
        }
    }

    public function update($id, $data) {
        try {
            $fields = [];
            $values = [];
            
            foreach ($data as $key => $value) {
                if ($key !== 'id' && $key !== 'password') {
                    $fields[] = "{$key} = ?";
                    $values[] = $value;
                }
            }
            
            // Handle password update separately
            if (isset($data['password'])) {
                $fields[] = "password = ?";
                $values[] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            
            $values[] = $id;
            $fieldsStr = implode(', ', $fields);
            
            $sql = "UPDATE {$this->table} SET {$fieldsStr} WHERE id = ?";
            error_log("Executing update SQL: " . $sql);
            error_log("With values: " . print_r($values, true));
            
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute($values);
            
            if (!$result) {
                error_log("Failed to execute update SQL: " . print_r($stmt->errorInfo(), true));
                throw new Exception("Failed to update user");
            }
            
            return true;
        } catch (PDOException $e) {
            error_log("Database error in User::update: " . $e->getMessage());
            throw new Exception("Database error occurred");
        } catch (Exception $e) {
            error_log("Error in User::update: " . $e->getMessage());
            throw $e;
        }
    }

    public function create($data) {
        try {
            $this->db->beginTransaction();

            // Check if email already exists using index
            $existingUser = $this->findByEmail($data['email']);
            if ($existingUser) {
                $this->db->rollBack();
                error_log("Email already exists: " . $data['email']);
                throw new Exception("Email already registered");
            }

            // Hash password with cost factor optimization
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT, ['cost' => 10]);

            // Prepare SQL with specific fields and use prepared statement
            $sql = "INSERT INTO users (name, email, password, phone, user_type, created_at) 
                    VALUES (?, ?, ?, ?, ?, NOW())";
            
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(1, $data['name']);
            $stmt->bindParam(2, $data['email']);
            $stmt->bindParam(3, $data['password']);
            $stmt->bindParam(4, $data['phone'] ?? null);
            $stmt->bindParam(5, $data['user_type'] ?? 'customer');

            $result = $stmt->execute();

            if (!$result) {
                $this->db->rollBack();
                error_log("Failed to execute SQL: " . print_r($stmt->errorInfo(), true));
                throw new Exception("Failed to create user");
            }

            $userId = $this->db->lastInsertId();

            // Get the created user (without password) using cache
            $user = $this->findById($userId);
            if (!$user) {
                $this->db->rollBack();
                error_log("Failed to retrieve created user");
                throw new Exception("Failed to retrieve created user");
            }

            $this->db->commit();
            unset($user['password']);

            // Cache the new user
            $this->userCache['email_' . $data['email']] = $user;
            
            return $user;

        } catch (PDOException $e) {
            error_log("Database error in User::create: " . $e->getMessage());
            error_log("SQL State: " . $e->getCode());
            error_log("Error Info: " . print_r($e->errorInfo, true));
            throw new Exception("Database error occurred");
        } catch (Exception $e) {
            error_log("Error in User::create: " . $e->getMessage());
            throw $e;
        }
    }
}