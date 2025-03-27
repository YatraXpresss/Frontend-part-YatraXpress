<?php

require_once __DIR__ . '/../core/Model.php';

class Rider extends Model {
    protected $table = 'riders';

    public function __construct() {
        parent::__construct();
        $this->createTable();
    }

    private function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS riders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            email VARCHAR(255),
            vehicle_type ENUM('Bike', 'Car', 'Scooter') NOT NULL,
            license_number VARCHAR(50),
            experience_years INT DEFAULT 0,
            rating DECIMAL(3,2) DEFAULT 0.00,
            total_rides INT DEFAULT 0,
            is_available BOOLEAN DEFAULT true,
            profile_image VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";

        try {
            $this->db->exec($sql);
        } catch (PDOException $e) {
            error_log("Error creating riders table: " . $e->getMessage());
            throw new Exception("Could not create riders table");
        }
    }

    public function findAll() {
        try {
            $stmt = $this->db->query("
                SELECT * FROM {$this->table}
                ORDER BY rating DESC, total_rides DESC
            ");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error fetching riders: " . $e->getMessage());
            throw new Exception("Could not fetch riders");
        }
    }

    public function findById($id) {
        try {
            $stmt = $this->db->prepare("
                SELECT * FROM {$this->table}
                WHERE id = ?
            ");
            $stmt->execute([$id]);
            $rider = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$rider) {
                return null;
            }

            return $rider;
        } catch (PDOException $e) {
            error_log("Error fetching rider: " . $e->getMessage());
            throw new Exception("Could not fetch rider details");
        }
    }

    public function create($data) {
        try {
            $requiredFields = ['name', 'vehicle_type'];
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    throw new Exception("$field is required");
                }
            }

            return parent::create($data);
        } catch (Exception $e) {
            error_log("Error creating rider: " . $e->getMessage());
            throw new Exception("Could not create rider");
        }
    }

    public function updateRating($id) {
        try {
            $stmt = $this->db->prepare("
                UPDATE {$this->table}
                SET rating = (
                    SELECT AVG(rating)
                    FROM ride_ratings
                    WHERE rider_id = ?
                )
                WHERE id = ?
            ");
            return $stmt->execute([$id, $id]);
        } catch (PDOException $e) {
            error_log("Error updating rider rating: " . $e->getMessage());
            throw new Exception("Could not update rider rating");
        }
    }
}