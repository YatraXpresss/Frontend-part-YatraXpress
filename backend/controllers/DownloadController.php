<?php

namespace Controllers;

class DownloadController extends Controller {
    public function trackDownload() {
        try {
            // Get request data
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['platform']) || !isset($data['version']) || !isset($data['timestamp'])) {
                return $this->error('Missing required fields', 400);
            }

            // Connect to database
            $db = $this->db->getConnection();
            
            // Insert download record
            $stmt = $db->prepare(
                'INSERT INTO downloads (platform, version, timestamp) VALUES (?, ?, ?);'
            );
            
            $stmt->execute([
                $data['platform'],
                $data['version'],
                $data['timestamp']
            ]);

            return $this->success(['message' => 'Download tracked successfully']);
            
        } catch (\Exception $e) {
            return $this->error('Failed to track download: ' . $e->getMessage(), 500);
        }
    }
}