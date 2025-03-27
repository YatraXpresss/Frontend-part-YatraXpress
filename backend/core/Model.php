<?php

abstract class Model {
    protected $db;
    protected $table;

    public function __construct() {
        try {
            require_once __DIR__ . '/../config/database.php';
            $config = require __DIR__ . '/../config/database.php';
            
            $dsn = "mysql:host={$config['host']};dbname={$config['dbname']};charset={$config['charset']}";
            $this->db = new PDO($dsn, $config['username'], $config['password'], $config['options']);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Failed to connect to database");
        }
    }

    protected function checkTableExists() {
        try {
            $stmt = $this->db->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$this->table]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            error_log("Error checking table {$this->table}: " . $e->getMessage());
            return false;
        }
    }

    protected function createRidersTable() {
        if ($this->table === 'riders') {
            try {
                $sql = "CREATE TABLE IF NOT EXISTS riders (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT,
                    name VARCHAR(255),
                    vehicle_type VARCHAR(50),
                    experience VARCHAR(100),
                    is_available BOOLEAN DEFAULT false,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )";
                $this->db->exec($sql);
                return true;
            } catch (PDOException $e) {
                error_log("Error creating riders table: " . $e->getMessage());
                return false;
            }
        }
        return false;
    }

    public function findAll() {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $columns = implode(', ', array_keys($data));
        $values = implode(', ', array_fill(0, count($data), '?'));
        
        $stmt = $this->db->prepare("INSERT INTO {$this->table} ($columns) VALUES ($values)");
        $stmt->execute(array_values($data));
        
        return $this->db->lastInsertId();
    }

    public function update($id, $data) {
        $sets = implode(' = ?, ', array_keys($data)) . ' = ?';
        
        $stmt = $this->db->prepare("UPDATE {$this->table} SET $sets WHERE id = ?");
        $values = array_values($data);
        $values[] = $id;
        
        return $stmt->execute($values);
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }
}