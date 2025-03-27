<?php

require_once __DIR__ . '/Model.php';

class RatingReply extends Model {
    protected $table = 'rating_replies';

    public function createReply($data) {
        return $this->insert([
            'rating_id' => $data['rating_id'],
            'user_id'   => $data['user_id'],
            'reply_text' => $data['reply_text']
        ]);
    }

    public function getRepliesForRating($ratingId) {
        $query = "SELECT rr.*, u.name, u.profile_picture 
                  FROM rating_replies rr
                  JOIN users u ON u.id = rr.user_id
                  WHERE rr.rating_id = ?
                  ORDER BY rr.created_at ASC";
        
        return $this->query($query, [$ratingId]);
    }

    public function deleteReply($replyId, $userId) {
        return $this->delete([
            'id' => $replyId,
            'user_id' => $userId
        ]);
    }
}