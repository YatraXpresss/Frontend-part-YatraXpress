<?php

require_once __DIR__ . '/../models/Rating.php';
require_once __DIR__ . '/../models/RatingReply.php';

class RatingController extends Controller {
    private $ratingModel;
    private $rideModel;
    private $replyModel;

    public function __construct() {
        parent::__construct();
        $this->ratingModel = new Rating();
        $this->rideModel = new Ride();
        $this->replyModel = new RatingReply();
    }

    public function create() {
        $data = $this->validateRequest(['ride_id', 'user_id', 'rating', 'comment']);

        $ride = $this->rideModel->findById($data['ride_id']);
        if (!$ride) {
            $this->jsonResponse(['error' => 'Ride not found'], 404);
            return;
        }

        if ($ride['status'] !== 'completed') {
            $this->jsonResponse(['error' => 'Can only rate completed rides'], 400);
            return;
        }

        try {
            $ratingId = $this->ratingModel->createRating($data);
            if ($ratingId) {
                $rating = $this->ratingModel->findById($ratingId);
                $this->jsonResponse(['rating' => $rating], 201);
            } else {
                $this->jsonResponse(['error' => 'Failed to create rating'], 500);
            }
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to create rating'], 500);
        }
    }

    public function getRideRating($rideId) {
        try {
            $rating = $this->ratingModel->getRideRating($rideId) ?? 0;
            $this->jsonResponse(['rating' => $rating]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to fetch ride rating'], 500);
        }
    }

    public function getRiderRatings($riderId) {
        try {
            $ratings = $this->ratingModel->getRiderRatings($riderId);
            
            if ($ratings) {
                foreach ($ratings as &$rating) {
                    $rating['replies'] = $this->replyModel->getRepliesForRating($rating['id']);
                }
            }
            
            $this->jsonResponse(['ratings' => $ratings ?: []]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to fetch rider ratings'], 500);
        }
    }

    public function createReply() {
        $data = $this->validateRequest(['rating_id', 'user_id', 'reply_text']);

        try {
            $replyId = $this->replyModel->createReply($data);
            if ($replyId) {
                $reply = $this->replyModel->getRepliesForRating($data['rating_id']);
                $this->jsonResponse(['reply' => $reply], 201);
            } else {
                $this->jsonResponse(['error' => 'Failed to create reply'], 500);
            }
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to create reply'], 500);
        }
    }

    public function deleteReply($replyId) {
        $userId = $this->getCurrentUserId();
        
        try {
            $success = $this->replyModel->deleteReply($replyId, $userId);
            if ($success) {
                $this->jsonResponse(['message' => 'Reply deleted successfully']);
            } else {
                $this->jsonResponse(['error' => 'Failed to delete reply'], 400);
            }
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to delete reply'], 500);
        }
    }
}
