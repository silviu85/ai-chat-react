// src/components/HistoryPage.jsx
import HistorySkeletonItem from './HistorySkeletonItem';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import { FaTrash } from 'react-icons/fa';

const HistoryPage = () => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await apiService('/conversations');
        setConversations(data);
      } catch (err) {
        setError('Failed to load history.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, []);

  /**
   * Handles the deletion of a conversation.
   * @param {number} id The ID of the conversation to delete.
   */
  const handleDelete = async (id) => {
    // A simple confirmation dialog to prevent accidental deletion.
    if (!window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      return;
    }

    try {
      // Call the API with the DELETE method.
      await apiService(`/conversations/${id}`, { method: 'DELETE' });

      // --- INSTANT UI UPDATE ---
      // Update the state to remove the deleted conversation from the list
      // without needing to refresh the page. This is called an "optimistic update".
      setConversations(prevConversations =>
        prevConversations.filter(convo => convo.id !== id)
      );

    } catch (err) {
      // If deletion fails, show an alert to the user.
      console.error('Failed to delete conversation:', err);
      alert('Could not delete the conversation. Please try again.');
    }
  };

   if (isLoading) {
    return (
      <div className="page-container">
        <h1>Conversation History</h1>
        <ul className="history-list">
          {/* Render 5 skeleton items as placeholders */}
          {Array.from({ length: 5 }, (_, index) => (
            <HistorySkeletonItem key={index} />
          ))}
        </ul>
      </div>
    );
  }
  if (error) return <div className="page-container"><h2>{error}</h2></div>;

  return (
    <div className="page-container">
      <h1>Conversation History</h1>
      <ul className="history-list">
        {conversations.length > 0 ? (
          conversations.map(convo => (
            <li key={convo.id}>
              <Link to={`/chat/${convo.id}`} className="history-link">
                <span className="history-title">{convo.title || `Chat from ${new Date(convo.created_at).toLocaleDateString()}`}</span>
                <span className="history-date">{new Date(convo.created_at).toLocaleString()}</span>
              </Link>
              <button
                className="delete-button"
                onClick={() => handleDelete(convo.id)}
                title="Delete Conversation"
              >
                <FaTrash />
              </button>
            </li>
          ))
        ) : (
          <p>No conversations yet.</p>
        )}
      </ul>
    </div>
  );
};

export default HistoryPage;