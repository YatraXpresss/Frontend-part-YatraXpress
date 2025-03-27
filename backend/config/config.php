<?php

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'adlut_db');
define('DB_USER', 'root');
define('DB_PASS', '');

// JWT configuration
define('JWT_SECRET', 'your-secret-key-here');

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set default timezone
date_default_timezone_set('UTC'); 