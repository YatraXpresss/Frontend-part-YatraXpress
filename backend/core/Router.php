<?php

class Router {
    private $routes = [];
    private $notFoundHandler;

    public function addRoute($method, $path, $handler) {
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler
        ];
    }

    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }

    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }

    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }

    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }

    public function setNotFoundHandler($handler) {
        $this->notFoundHandler = $handler;
    }

    private function matchRoute($method, $path) {
        foreach ($this->routes as $route) {
            if ($route['method'] === $method && $this->matchPath($route['path'], $path)) {
                return $route;
            }
        }
        return null;
    }

    private function matchPath($routePath, $requestPath) {
        $routeParts = explode('/', trim($routePath, '/'));
        $requestParts = explode('/', trim($requestPath, '/'));

        if (count($routeParts) !== count($requestParts)) {
            return false;
        }

        $params = [];
        for ($i = 0; $i < count($routeParts); $i++) {
            if (strpos($routeParts[$i], ':') === 0) {
                $params[substr($routeParts[$i], 1)] = $requestParts[$i];
            } elseif ($routeParts[$i] !== $requestParts[$i]) {
                return false;
            }
        }

        return true;
    }

    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $route = $this->matchRoute($method, $path);

        if ($route) {
            call_user_func($route['handler']);
        } elseif ($this->notFoundHandler) {
            call_user_func($this->notFoundHandler);
        } else {
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['error' => 'Not Found']);
        }
    }
}