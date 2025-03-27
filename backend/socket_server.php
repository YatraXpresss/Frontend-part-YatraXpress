<?php
require 'vendor/autoload.php';

use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use React\EventLoop\Factory;
use React\Socket\Server;

class ChatServer implements \Ratchet\MessageComponentInterface {
    protected $clients;
    protected $chatRooms;

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->chatRooms = [];
    }

    public function onOpen(\Ratchet\ConnectionInterface $conn) {
        // Set CORS headers
        $conn->send(json_encode([
            'type' => 'system',
            'headers' => [
                'Access-Control-Allow-Origin' => 'http://localhost:5173',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type'
            ]
        ]));

        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";

        // Send connection acknowledgment
        $conn->send(json_encode([
            'type' => 'connection',
            'status' => 'connected',
            'id' => $conn->resourceId
        ]));
    }

    public function onMessage(\Ratchet\ConnectionInterface $from, $msg) {
        try {
            $data = json_decode($msg, true);
            
            if (!$data || !isset($data['event'])) {
                return;
            }

            switch ($data['event']) {
                case 'join_chat':
                    $roomId = $data['riderId'] . '_' . $data['userId'];
                    if (!isset($this->chatRooms[$roomId])) {
                        $this->chatRooms[$roomId] = [];
                    }
                    $this->chatRooms[$roomId][] = $from;
                    
                    // Acknowledge room join
                    $from->send(json_encode([
                        'event' => 'joined_chat',
                        'roomId' => $roomId
                    ]));
                    break;

                case 'send_message':
                    $roomId = $data['riderId'] . '_' . $data['userId'];
                    if (isset($this->chatRooms[$roomId])) {
                        foreach ($this->chatRooms[$roomId] as $client) {
                            $messageData = json_encode([
                                'event' => 'receive_message',
                                'data' => $data
                            ]);
                            $client->send($messageData);
                        }
                    }
                    break;

                case 'ping':
                    $from->send(json_encode([
                        'event' => 'pong'
                    ]));
                    break;
            }
        } catch (\Exception $e) {
            echo "Error processing message: " . $e->getMessage() . "\n";
        }
    }

    public function onClose(\Ratchet\ConnectionInterface $conn) {
        $this->clients->detach($conn);
        
        // Remove from chat rooms
        foreach ($this->chatRooms as $roomId => $clients) {
            $index = array_search($conn, $clients);
            if ($index !== false) {
                unset($this->chatRooms[$roomId][$index]);
                // Clean up empty rooms
                if (empty($this->chatRooms[$roomId])) {
                    unset($this->chatRooms[$roomId]);
                }
            }
        }
        
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(\Ratchet\ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }
}

// Allow cross-origin requests
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Create event loop and socket server
$loop = Factory::create();
$socket = new Server('0.0.0.0:8080', $loop);

// Set up the WebSocket server
$server = new IoServer(
    new HttpServer(
        new WsServer(
            new ChatServer()
        )
    ),
    $socket,
    $loop
);

echo "WebSocket server running on port 8080\n";
$loop->run(); 