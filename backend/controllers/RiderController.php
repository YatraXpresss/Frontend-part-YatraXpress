<?php

require_once __DIR__ . '/../models/Rider.php';
require_once __DIR__ . '/../models/Rating.php';
require_once __DIR__ . '/../models/Ride.php';
require_once __DIR__ . '/../core/Controller.php';

class RiderController extends Controller {
    private $riderModel;
    private $ratingModel;
    private $rideModel;

    public function __construct() {
        try {
            parent::__construct();
            $this->riderModel = new Rider();
            $this->ratingModel = new Rating();
            $this->rideModel = new Ride();
        } catch (Exception $e) {
            error_log("Error initializing RiderController: " . $e->getMessage());
            header('HTTP/1.1 503 Service Unavailable');
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Service temporarily unavailable']);
            exit;
        }
    }

    public function index() {
        try {
            $riders = $this->riderModel->findAll();
            header('Content-Type: application/json');
            echo json_encode($riders);
            exit;
        } catch (Exception $e) {
            error_log("Error in RiderController->index: " . $e->getMessage());
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Failed to fetch riders. Please try again later.',
                'debug_message' => $e->getMessage()
            ]);
            exit;
        }
    }

    public function show() {
        try {
            $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            $parts = explode('/', trim($path, '/'));
            $id = end($parts);

            if (!$id) {
                header('HTTP/1.1 400 Bad Request');
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Rider ID is required']);
                exit;
            }

            $rider = $this->riderModel->findById($id);
            
            if (!$rider) {
                header('HTTP/1.1 404 Not Found');
                header('Content-Type: application/json');
                echo json_encode(['error' => 'Rider not found']);
                exit;
            }

            header('Content-Type: application/json');
            echo json_encode(['rider' => $rider]);
            exit;
        } catch (Exception $e) {
            error_log("Error in RiderController->show: " . $e->getMessage());
            header('HTTP/1.1 500 Internal Server Error');
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Failed to fetch rider details']);
            exit;
        }
    }

    public function getRiderStats() {
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        $parts = explode('/', trim($path, '/'));
        $id = end($parts);

        if (!$id) {
            $this->jsonResponse(['error' => 'Rider ID is required'], 400);
        }

        try {
            // Get completed rides count
            $completedRides = $this->rideModel->getCompletedRidesCount($id);
            
            // Get average rating and total ratings
            $ratings = $this->ratingModel->getRiderRatings($id);
            $totalRatings = count($ratings);
            $averageRating = $totalRatings > 0 
                ? array_reduce($ratings, function($carry, $item) {
                    return $carry + $item['rating'];
                }, 0) / $totalRatings
                : 0;

            $this->jsonResponse([
                'completed_rides' => $completedRides,
                'total_ratings' => $totalRatings,
                'average_rating' => $averageRating
            ]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to fetch rider statistics'], 500);
        }
    }
}