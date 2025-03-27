import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { FaPaperPlane, FaSpinner } from 'react-icons/fa';

const Chat = ({ riderId, riderName, userId, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket, connected, emit } = useSocket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket) return;

    // Join chat room
    emit('join_chat', { riderId, userId });

    // Listen for incoming messages
    socket.on('receive_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for chat history
    socket.on('chat_history', (history) => {
      setMessages(history);
    });

    return () => {
      socket.off('receive_message');
      socket.off('chat_history');
    };
  }, [socket, riderId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !connected) return;

    setIsLoading(true);
    const messageData = {
      riderId,
      userId,
      sender: userId,
      senderName: userName,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    emit('send_message', messageData);
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-xl shadow-lg">
      {/* Chat Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-xl">
        <h3 className="text-lg font-semibold text-gray-900">
          Chat with {riderName}
        </h3>
        <div className="flex items-center mt-1">
          <div className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  msg.sender === userId
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <span className="text-xs mt-1 block opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            disabled={!connected || isLoading}
          />
          <button
            type="submit"
            disabled={!connected || isLoading}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 