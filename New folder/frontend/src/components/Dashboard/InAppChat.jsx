import React, { useState, useRef, useEffect } from 'react';
import { Send, Tractor, ShoppingCart } from 'lucide-react';

const InAppChat = ({
  currentUser = 'farmer',
  partnerName = 'Amina Traders',
  partnerRole = 'Buyer',
  productName = 'Fresh Tomatoes (50kg)'
}) => {
  const [messages, setMessages] = useState([
    { 
      id: '1', 
      text: "Hi, I'm interested in your tomatoes. Are they still available?", 
      sender: 'buyer', 
      timestamp: new Date(Date.now() - 1000 * 60 * 30) 
    },
    { 
      id: '2', 
      text: "Yes, they are fresh from the farm today. 50kg batch.", 
      sender: 'farmer', 
      timestamp: new Date(Date.now() - 1000 * 60 * 25) 
    },
    { 
      id: '3', 
      text: "Great! What's your best price per kg?", 
      sender: 'buyer', 
      timestamp: new Date(Date.now() - 1000 * 60 * 20) 
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: currentUser,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulated reply from the other person
    setTimeout(() => {
      const replies = [
        "Sounds good! When can you deliver?",
        "Can you send some photos of the produce?",
        "I'll take the full 50kg. Let's finalize.",
        "Thank you! Looking forward to more business.",
      ];
      
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: randomReply,
        sender: currentUser === 'farmer' ? 'buyer' : 'farmer',
        timestamp: new Date(),
      }]);
    }, 1200);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="chat-container">
      {/* Header */}
      <div className="chat-header">
        <div className="header-avatar">
          {currentUser === 'farmer' ? <ShoppingCart size={20} /> : <Tractor size={20} />}
        </div>
        <div className="header-info">
          <div className="partner-name">{partnerName}</div>
          <div className="partner-status">
            <span className="status-dot"></span> Online • {partnerRole}
          </div>
        </div>
        {productName && <div className="product-tag">{productName}</div>}
      </div>

      {/* Messages Area */}
      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message-wrapper ${message.sender === currentUser ? 'message-sent' : 'message-received'}`}
          >
            <div className="message-bubble">
              <p className="message-text">{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-area">
        <form onSubmit={handleSendMessage} className="input-form">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()} 
            className="send-button"
          >
            <Send size={20} />
          </button>
        </form>
        <div className="footer-text">Messages are end-to-end encrypted • AgriConnect</div>
      </div>

      <style jsx>{`
        .chat-container {
          width: 100%;
          max-width: 420px;
          height: 100vh;
          max-height: 700px;
          margin: 0 auto;
          background: #f8f9fa;
          border: 1px solid #ddd;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background: #166534;
          color: white;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-avatar {
          width: 48px;
          height: 48px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-info {
          flex: 1;
        }

        .partner-name {
          font-weight: 600;
          font-size: 16px;
        }

        .partner-status {
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #4ade80;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .product-tag {
          font-size: 12px;
          background: rgba(255,255,255,0.15);
          padding: 4px 10px;
          border-radius: 12px;
        }

        .messages-container {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          background: radial-gradient(#e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .message-wrapper {
          margin-bottom: 16px;
          display: flex;
        }

        .message-sent {
          justify-content: flex-end;
        }

        .message-received {
          justify-content: flex-start;
        }

        .message-bubble {
          max-width: 75%;
          padding: 12px 16px;
          border-radius: 18px;
          position: relative;
        }

        .message-sent .message-bubble {
          background: #166534;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-received .message-bubble {
          background: white;
          border: 1px solid #e5e7eb;
          border-bottom-left-radius: 4px;
        }

        .message-text {
          margin: 0 0 6px 0;
          font-size: 15px;
          line-height: 1.4;
        }

        .message-time {
          font-size: 11px;
          opacity: 0.7;
          display: block;
          text-align: right;
        }

        .input-area {
          border-top: 1px solid #ddd;
          background: white;
          padding: 16px;
        }

        .input-form {
          display: flex;
          gap: 8px;
        }

        .message-input {
          flex: 1;
          padding: 14px 20px;
          border: 1px solid #ccc;
          border-radius: 9999px;
          font-size: 15px;
          outline: none;
        }

        .message-input:focus {
          border-color: #166534;
        }

        .send-button {
          width: 52px;
          height: 52px;
          background: #166534;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .send-button:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .footer-text {
          text-align: center;
          font-size: 11px;
          color: #888;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};

export default InAppChat;