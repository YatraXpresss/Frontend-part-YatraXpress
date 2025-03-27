-- Create rating_replies table
CREATE TABLE IF NOT EXISTS rating_replies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating_id INT NOT NULL,
    user_id INT NOT NULL,
    reply_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rating_id) REFERENCES ratings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Add profile_picture column to users table if not exists
ALTER TABLE users
ADD COLUMN IF NOT EXISTS profile_picture VARCHAR(255) DEFAULT NULL;