import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:8080', {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true,
    });

    // Socket event listeners
    newSocket.on('connect', () => {
      console.log('Connected to socket server');
      setConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
      setConnected(false);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from socket server');
      setConnected(false);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.removeAllListeners();
        newSocket.close();
      }
    };
  }, []);

  const value = {
    socket,
    connected,
    emit: (event, data) => {
      if (socket && socket.connected) {
        socket.emit(event, data);
      } else {
        console.warn('Socket is not connected. Message not sent:', { event, data });
      }
    },
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}; 