<?php

class Rating extends Model {
    protected $table = 'ratings';

    // Create a new rating entry
    public function createRating($data) {
        return $this->create([
            'ride_id' => $data['ride_id'],
            'user_id' => $data['user_id'],
            'rating'  => $data['rating'],
            'comment' => $data['comment'] ?? null
        ]);
    }

    // Get average rating and total number of ratings for a ride
    public function getRideRating($rideId) {
        $stmt = $this->db->prepare("
            SELECT 
                IFNULL(ROUND(AVG(rating), 1), 0) AS average_rating, 
                COUNT(*) AS total_ratings 
            FROM {$this->table} 
            WHERE ride_id = ?
        ");
        $stmt->execute([$rideId]);
        $result = $stmt->fetch();

        // Return formatted result
        return [
            'average_rating' => $result['average_rating'],
            'total_ratings'  => $result['total_ratings']
        ];
    }

    // Get all ratings for a specific rider
    public function getRiderRatings($riderId) {
        $query = "SELECT r.*, r.comment, r.created_at,
                  u.name as user_name, u.profile_picture,
                  rd.pickup_location, rd.dropoff_location,
                  rd.pickup_time
                  FROM ratings r
                  JOIN rides rd ON rd.id = r.ride_id
                  JOIN riders ri ON ri.id = rd.rider_id
                  JOIN users u ON u.id = r.user_id
                  WHERE ri.id = ?
                  ORDER BY r.created_at DESC";
        
        return $this->query($query, [$riderId]);
    }

    // Get all ratings given by a specific user
    public function getUserRatings($userId) {
        $stmt = $this->db->prepare("
            SELECT rating, comment, created_at 
            FROM {$this->table} 
            WHERE user_id = ?
        ");
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }
}
