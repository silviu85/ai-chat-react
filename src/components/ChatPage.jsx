// src/components/ChatPage.jsx

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const ChatPage = () => {
  // --- HOOKS: Called at the top level of the component ---
  const { conversationId: paramId } = useParams();
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [conversationId, setConversationId] = useState(paramId || null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingIndicator, setTypingIndicator] = useState('.');
  const [currentTitle, setCurrentTitle] = useState('New Chat');
  
  // --- REFS ---
  const messagesEndRef = useRef(null);

  // --- HELPER FUNCTIONS ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // --- EFFECTS ---

  // Effect to automatically scroll to the bottom when new messages are added.
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Effect to handle the animated "Typing..." indicator.
  useEffect(() => {
    let intervalId;
    if (isLoading) {
      intervalId = setInterval(() => {
        setTypingIndicator(prev => (prev.length >= 3 ? '.' : prev + '.'));
      }, 400);
    }
    // Cleanup function: this stops the interval when the effect is no longer needed.
    return () => clearInterval(intervalId);
  }, [isLoading]);

  // Effect to load an existing conversation or reset for a new chat when the URL changes.
  useEffect(() => {
    setConversationId(paramId || null);
    
    const loadConversation = async () => {
      if (paramId) {
        setIsLoading(true);
        try {
          const data = await apiService(`/conversations/${paramId}`);
          setMessages(data.messages || []);
          setCurrentTitle(data.title || 'Chat');
        } catch (err) {
          console.error("Failed to load conversation", err);
          navigate('/'); // Redirect to a new chat if the ID is invalid or fails to load.
        } finally {
          setIsLoading(false);
        }
      } else {
        // This is a new chat. Reset all relevant states.
        setMessages([]);
        setCurrentTitle('New Chat');
      }
    };
    
    loadConversation();
  }, [paramId, navigate]); // This effect re-runs whenever the conversation ID in the URL changes.

  // --- EVENT HANDLERS ---

  /**
   * Handles the submission of a new message.
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const data = await apiService('/chat/ask', {
        method: 'POST',
        body: JSON.stringify({
          prompt: currentInput,
          conversation_id: conversationId, 
        }),
      });

      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, assistantMessage]);

      // If this was the first message of a new chat...
      if (!conversationId) {
        // ...update the title locally for an instant UI update...
        const newTitle = currentInput.length > 50 ? currentInput.substring(0, 47) + '...' : currentInput;
        setCurrentTitle(newTitle);
        // ...and update the URL with the new conversation ID from the API.
        navigate(`/chat/${data.conversation_id}`, { replace: true });
      } else {
        // If it's an existing chat, just ensure the ID is up-to-date.
        setConversationId(data.conversation_id);
      }
      
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDER ---
  return (
    <div className="chat-page">
      <div className="chat-header">
        <h2>{currentTitle}</h2>
      </div>

      {messages.length === 0 && !isLoading && (
        <div className="welcome-message">
          <h1>Hello!</h1>
          <p>How can I help you today?</p>
        </div>
      )}
      
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