// src/components/ChatPage.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const [typingIndicator, setTypingIndicator] = useState('.');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // This effect handles the typing indicator animation
useEffect(() => {
    let intervalId;

    if (isLoading) {
        // Start the animation when loading begins
        intervalId = setInterval(() => {
            setTypingIndicator(prev => {
                if (prev.length >= 3) {
                    return '.';
                }
                return prev + '.';
            });
        }, 400); // Change the speed of the animation here (in ms)
    }

    // This is the cleanup function. It runs when isLoading changes or the component unmounts.
    return () => {
        clearInterval(intervalId);
    };
}, [isLoading]); // This effect depends only on the isLoading state

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await apiService('/chat/ask', {
        method: 'POST',
        body: JSON.stringify({
          prompt: inputValue,
          conversation_id: conversationId,
        }),
      });

      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
      setConversationId(data.conversation_id);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-page">
      <button onClick={handleLogout} className="logout-button">Logout</button>
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}-message`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
  <div className="message assistant-message">
    Typing{typingIndicator}
  </div>
)}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          &#10148;
        </button>
      </form>
    </div>
  );
};

export default ChatPage;