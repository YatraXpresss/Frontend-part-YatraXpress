CREATE TABLE IF NOT EXISTS downloads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_platform ON downloads(platform);
CREATE INDEX idx_timestamp ON downloads(timestamp);