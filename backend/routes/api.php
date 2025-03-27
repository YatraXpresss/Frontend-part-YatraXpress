<?php

// User routes
$router->post('/api/auth/register', function() {
    require_once __DIR__ . '/../controllers/AuthController.php';
    $controller = new AuthController();
    $controller->register();
});

$router->post('/api/auth/login', function() {
    require_once __DIR__ . '/../controllers/AuthController.php';
    $controller = new AuthController();
    $controller->login();
});

// Rider routes
$router->get('/api/riders', function() {
    require_once __DIR__ . '/../controllers/RiderController.php';
    $controller = new RiderController();
    $controller->index();
});

$router->get('/api/riders/:id', function() {
    require_once __DIR__ . '/../controllers/RiderController.php';
    $controller = new RiderController();
    $controller->show();
});

$router->get('/api/riders/:id/stats', function() {
    require_once __DIR__ . '/../controllers/RiderController.php';
    $controller = new RiderController();
    $controller->getRiderStats();
});

// Ride routes
$router->get('/api/rides', function() {
    require_once __DIR__ . '/../controllers/RideController.php';
    $controller = new RideController();
    $controller->index();
});

$router->post('/api/rides', function() {
    require_once __DIR__ . '/../controllers/RideController.php';
    $controller = new RideController();
    $controller->create();
});

$router->get('/api/rides/:id', function() {
    require_once __DIR__ . '/../controllers/RideController.php';
    $controller = new RideController();
    $controller->show();
});

// Rating routes
$router->post('/api/ratings', function() {
    require_once __DIR__ . '/../controllers/RatingController.php';
    $controller = new RatingController();
    $controller->create();
});

$router->get('/api/rides/:id/rating', function() {
    require_once __DIR__ . '/../controllers/RatingController.php';
    $controller = new RatingController();
    $controller->getRideRating();
});

// Ride Count routes
$router->get('/api/rides/counts', function() {
    require_once __DIR__ . '/../controllers/RideCountController.php';
    $controller = new RideCountController();
    $controller->getRideCounts();
});

$router->get('/api/riders/:id/ratings', function() {
    require_once __DIR__ . '/../controllers/RatingController.php';
    $controller = new RatingController();
    $controller->getRiderRatings();
});

// 404 Handler
$router->setNotFoundHandler(function() {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => 'Endpoint not found']);
});