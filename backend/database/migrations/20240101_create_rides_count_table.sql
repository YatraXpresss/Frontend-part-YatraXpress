-- Create rides_count table
CREATE TABLE IF NOT EXISTS rides_count (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_type VARCHAR(50) NOT NULL,
    completed_rides INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_vehicle_type (vehicle_type)
);

-- Insert initial records for existing vehicle types
INSERT INTO rides_count (vehicle_type, completed_rides) VALUES
('bolero', 0),
('bike', 0);

-- Create trigger to update rides_count when a ride is completed
DELIMITER //
CREATE TRIGGER update_rides_count AFTER UPDATE ON rides
FOR EACH ROW
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE rides_count
        SET completed_rides = completed_rides + 1
        WHERE vehicle_type = (SELECT vehicle_type FROM riders WHERE id = NEW.rider_id);
    END IF;
END //
DELIMITER ;