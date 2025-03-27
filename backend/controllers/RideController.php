<?php

require_once __DIR__ . '/../models/Ride.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/Controller.php';

class RideController extends Controller {
    private $rideModel;
    private $userModel;

    public function __construct() {
        parent::__construct();
        $this->rideModel = new Ride();
        $this->userModel = new User();
    }

    public function index() {
        try {
            $rides = $this->rideModel->findAll();
            $this->jsonResponse(['rides' => $rides]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to fetch rides'], 500);
        }
    }

    public function show() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));
        $id = end($parts);

        if (!$id) {
            $this->jsonResponse(['error' => 'Ride ID is required'], 400);
        }

        try {
            $ride = $this->rideModel->findById($id);
            
            if (!$ride) {
                $this->jsonResponse(['error' => 'Ride not found'], 404);
            }

            $this->jsonResponse(['ride' => $ride]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to fetch ride details'], 500);
        }
    }

    public function findAvailableRiders() {
        try {
            // Get request data
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                return $this->jsonResponse(['error' => 'Invalid request data'], 400);
            }

            // Validate required fields
            if (!isset($data['pickup_location']) || !isset($data['passengers'])) {
                return $this->jsonResponse(['error' => 'Pickup location and number of passengers are required'], 400);
            }

            // Find available riders
            $availableRiders = $this->rideModel->findAvailableRiders(
                $data['pickup_location'],
                $data['passengers']
            );

            return $this->jsonResponse([
                'available_riders' => $availableRiders
            ]);

        } catch (Exception $e) {
            error_log("Error finding available riders: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to find available riders'], 500);
        }
    }

    public function getRiderProfile($riderId) {
        try {
            if (!$riderId) {
                return $this->jsonResponse(['error' => 'Rider ID is required'], 400);
            }

            $riderProfile = $this->rideModel->getRiderProfile($riderId);
            if (!$riderProfile) {
                return $this->jsonResponse(['error' => 'Rider not found'], 404);
            }

            return $this->jsonResponse([
                'rider_profile' => $riderProfile
            ]);

        } catch (Exception $e) {
            error_log("Error getting rider profile: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to get rider profile'], 500);
        }
    }

    public function create() {
        try {
            // Get user from token
            $userId = $this->getUserIdFromToken();
            if (!$userId) {
                return $this->jsonResponse(['error' => 'Unauthorized'], 401);
            }

            // Get request data
            $data = json_decode(file_get_contents('php://input'), true);
            if (!$data) {
                return $this->jsonResponse(['error' => 'Invalid request data'], 400);
            }

            // Validate required fields
            $requiredFields = ['pickup_location', 'dropoff_location', 'pickup_date', 'pickup_time', 'passengers'];
            foreach ($requiredFields as $field) {
                if (!isset($data[$field]) || empty($data[$field])) {
                    return $this->jsonResponse(['error' => "Missing required field: {$field}"], 400);
                }
            }

            // Find available riders
            $availableRiders = $this->rideModel->findAvailableRiders(
                $data['pickup_location'],
                $data['passengers']
            );

            // Add user_id to data
            $data['user_id'] = $userId;

            // Create ride
            $rideId = $this->rideModel->create($data);

            // Get created ride details
            $ride = $this->rideModel->findById($rideId);

            return $this->jsonResponse([
                'message' => 'Ride booked successfully',
                'ride' => $ride,
                'available_riders' => $availableRiders
            ], 201);

        } catch (Exception $e) {
            error_log("Error creating ride: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to create ride'], 500);
        }
    }

    public function getRide($id) {
        try {
            $ride = $this->rideModel->findById($id);
            if (!$ride) {
                return $this->jsonResponse(['error' => 'Ride not found'], 404);
            }

            return $this->jsonResponse(['ride' => $ride]);

        } catch (Exception $e) {
            error_log("Error getting ride: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to get ride details'], 500);
        }
    }

    public function getUserRides() {
        $userId = $this->getUserIdFromToken();
        $filter = $_GET['filter'] ?? 'all';

        $sql = "SELECT r.*, 
                u.name as rider_name, 
                u.vehicle_type,
                u.rating
                FROM rides r 
                LEFT JOIN users u ON r.rider_id = u.id 
                WHERE r.user_id = ?";

        // Apply filter if specified
        if ($filter !== 'all') {
            $sql .= " AND r.status = ?";
        }

        $sql .= " ORDER BY r.created_at DESC";

        $stmt = $this->db->prepare($sql);

        if ($filter !== 'all') {
            $stmt->bind_param("is", $userId, $filter);
        } else {
            $stmt->bind_param("i", $userId);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $rides = [];
        while ($row = $result->fetch_assoc()) {
            // Format rider information
            if ($row['rider_id']) {
                $row['rider'] = [
                    'name' => $row['rider_name'],
                    'vehicle_type' => $row['vehicle_type'],
                    'rating' => $row['rating']
                ];
            }
            unset($row['rider_name'], $row['vehicle_type'], $row['rating']);
            $rides[] = $row;
        }

        return json_encode([
            'success' => true,
            'rides' => $rides
        ]);
    }

    public function updateRideStatus($id) {
        try {
            // Get user from token
            $userId = $this->getUserIdFromToken();
            if (!$userId) {
                return $this->jsonResponse(['error' => 'Unauthorized'], 401);
            }

            // Get request data
            $data = json_decode(file_get_contents('php://input'), true);
            if (!isset($data['status'])) {
                return $this->jsonResponse(['error' => 'Status is required'], 400);
            }

            // Validate status
            $validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
            if (!in_array($data['status'], $validStatuses)) {
                return $this->jsonResponse(['error' => 'Invalid status'], 400);
            }

            // Update ride status
            $success = $this->rideModel->updateStatus(
                $id,
                $data['status'],
                $data['rider_id'] ?? null,
                $data['price'] ?? null
            );

            if (!$success) {
                return $this->jsonResponse(['error' => 'Failed to update ride status'], 500);
            }

            // Get updated ride details
            $ride = $this->rideModel->findById($id);

            return $this->jsonResponse([
                'message' => 'Ride status updated successfully',
                'ride' => $ride
            ]);

        } catch (Exception $e) {
            error_log("Error updating ride status: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to update ride status'], 500);
        }
    }

    public function getAvailableRides() {
        try {
            $rides = $this->rideModel->getAvailableRides();
            return $this->jsonResponse(['rides' => $rides]);

        } catch (Exception $e) {
            error_log("Error getting available rides: " . $e->getMessage());
            return $this->jsonResponse(['error' => 'Failed to get available rides'], 500);
        }
    }

    private function getUserIdFromToken() {
        $headers = getallheaders();
        if (!isset($headers['Authorization'])) {
            return null;
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        try {
            $decoded = JWT::decode($token, JWT_SECRET_KEY, array('HS256'));
            return $decoded->user_id;
        } catch (Exception $e) {
            return null;
        }
    }
}