<?php

require_once __DIR__ . '/../models/RideCount.php';

class RideCountController extends Controller {
    private $rideCountModel;

    public function __construct() {
        parent::__construct();
        $this->rideCountModel = new RideCount();
    }

    public function getRideCounts() {
        try {
            $rideCounts = $this->rideCountModel->findAll();
            $formattedCounts = [];
            
            foreach ($rideCounts as $count) {
                $formattedCounts[$count['vehicle_type']] = [
                    'completed_rides' => (int)$count['completed_rides']
                ];
            }
            
            $this->jsonResponse(['counts' => $formattedCounts]);
        } catch (Exception $e) {
            $this->jsonResponse(['error' => 'Failed to fetch ride counts'], 500);
        }
    }
}