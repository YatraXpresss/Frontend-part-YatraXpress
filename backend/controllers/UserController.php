<?php

require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Rider.php';

class UserController extends Controller {
    private $userModel;
    private $riderModel;

    public function __construct() {
        parent::__construct();
        $this->userModel = new User();
        $this->riderModel = new Rider();
    }

    public function getProfile($id) {
        try {
            $user = $this->userModel->findById($id);
            if (!$user) {
                $this->jsonResponse(['error' => 'User not found'], 404);
            }

            // Remove sensitive information
            unset($user['password']);

            // If user is a rider, get additional rider information
            if ($user['user_type'] === 'rider') {
                $rider = $this->riderModel->findByUserId($id);
                if ($rider) {
                    $user = array_merge($user, $rider);
                }
            }

            $this->jsonResponse($user);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function getStats($id) {
        try {
            $user = $this->userModel->findById($id);
            if (!$user) {
                $this->jsonResponse(['error' => 'User not found'], 404);
            }

            $stats = [
                'completed_rides' => 0,
                'total_ratings' => 0,
                'average_rating' => 0
            ];

            if ($user['user_type'] === 'rider') {
                $riderStats = $this->riderModel->getStats($id);
                if ($riderStats) {
                    $stats = $riderStats;
                }
            }

            $this->jsonResponse($stats);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }

    public function updateProfile($id) {
        try {
            $data = $this->getRequestData();
            $user = $this->userModel->findById($id);

            if (!$user) {
                $this->jsonResponse(['error' => 'User not found'], 404);
            }

            // Validate and sanitize input
            $allowedFields = ['name', 'bio', 'availability', 'profile_picture'];
            $updateData = array_intersect_key($data, array_flip($allowedFields));

            if (empty($updateData)) {
                $this->jsonResponse(['error' => 'No valid fields to update'], 400);
            }

            $success = $this->userModel->update($id, $updateData);

            if ($success) {
                $this->jsonResponse(['message' => 'Profile updated successfully']);
            } else {
                $this->jsonResponse(['error' => 'Failed to update profile'], 500);
            }
        } catch (Exception $e) {
            $this->jsonResponse(['error' => $e->getMessage()], 500);
        }
    }
}