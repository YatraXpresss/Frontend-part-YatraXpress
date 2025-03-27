<?php

class Ride extends Model {
    public function __construct() {
        parent::__construct();
        $this->createTable();
    }

    private function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS rides (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            pickup_location VARCHAR(255) NOT NULL,
            dropoff_location VARCHAR(255) NOT NULL,
            pickup_date DATE NOT NULL,
            pickup_time TIME NOT NULL,
            passengers INT NOT NULL DEFAULT 1,
            status ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
            rider_id INT,
            price DECIMAL(10,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (rider_id) REFERENCES riders(id)
        )";
        
        try {
            $this->db->exec($sql);
        } catch (PDOException $e) {
            error_log("Error creating rides table: " . $e->getMessage());
            throw $e;
        }
    }

    public function create($data) {
        try {
            $sql = "INSERT INTO rides (user_id, pickup_location, dropoff_location, pickup_date, pickup_time, passengers) 
                    VALUES (:user_id, :pickup_location, :dropoff_location, :pickup_date, :pickup_time, :passengers)";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':user_id' => $data['user_id'],
                ':pickup_location' => $data['pickup_location'],
                ':dropoff_location' => $data['dropoff_location'],
                ':pickup_date' => $data['pickup_date'],
                ':pickup_time' => $data['pickup_time'],
                ':passengers' => $data['passengers']
            ]);

            return $this->db->lastInsertId();
        } catch (PDOException $e) {
            error_log("Error creating ride: " . $e->getMessage());
            throw $e;
        }
    }

    public function findById($id) {
        try {
            $sql = "SELECT r.*, u.name as user_name, rd.name as rider_name 
                    FROM rides r 
                    LEFT JOIN users u ON r.user_id = u.id 
                    LEFT JOIN riders rd ON r.rider_id = rd.id 
                    WHERE r.id = :id";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':id' => $id]);
            
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error finding ride: " . $e->getMessage());
            throw $e;
        }
    }

    public function findByUserId($userId) {
        try {
            $sql = "SELECT r.*, rd.name as rider_name 
                    FROM rides r 
                    LEFT JOIN riders rd ON r.rider_id = rd.id 
                    WHERE r.user_id = :user_id 
                    ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute([':user_id' => $userId]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error finding user rides: " . $e->getMessage());
            throw $e;
        }
    }

    public function updateStatus($id, $status, $riderId = null, $price = null) {
        try {
            $sql = "UPDATE rides SET status = :status";
            $params = [':id' => $id, ':status' => $status];

            if ($riderId !== null) {
                $sql .= ", rider_id = :rider_id";
                $params[':rider_id'] = $riderId;
            }

            if ($price !== null) {
                $sql .= ", price = :price";
                $params[':price'] = $price;
            }

            $sql .= " WHERE id = :id";
            
            $stmt = $this->db->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log("Error updating ride status: " . $e->getMessage());
            throw $e;
        }
    }

    public function getAvailableRides() {
        try {
            $sql = "SELECT r.*, u.name as user_name 
                    FROM rides r 
                    JOIN users u ON r.user_id = u.id 
                    WHERE r.status = 'pending' 
                    ORDER BY r.created_at DESC";
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute();
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Error getting available rides: " . $e->getMessage());
            throw $e;
        }
    }
}