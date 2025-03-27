-- Add user_type column to users table
ALTER TABLE users
ADD COLUMN IF NOT EXISTS user_type ENUM('customer', 'rider') NOT NULL DEFAULT 'customer',
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS availability TEXT DEFAULT NULL;

-- Create user_profiles table for additional profile information
CREATE TABLE IF NOT EXISTS user_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address TEXT DEFAULT NULL,
    preferences JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);