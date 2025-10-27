// src/components/ProfilePage.jsx
import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

const ProfilePage = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ password: '', password_confirmation: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    apiService('/user').then(data => {
      setFormData({ name: data.name, email: data.email });
    });
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback({ message: '', type: '' });

    const payload = { ...formData };
    if (passwordData.password) {
      if (passwordData.password !== passwordData.password_confirmation) {
        setFeedback({ message: 'Passwords do not match.', type: 'error' });
        setIsLoading(false);
        return;
      }
      payload.password = passwordData.password;
      payload.password_confirmation = passwordData.password_confirmation;
    }

    try {
      await apiService('/user/profile', { method: 'PUT', body: JSON.stringify(payload) });
      setFeedback({ message: 'Profile updated successfully!', type: 'success' });
      setPasswordData({ password: '', password_confirmation: '' });
    } catch (err) {
      setFeedback({ message: 'Failed to update profile.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        
        <h2 className="form-divider">Change Password (optional)</h2>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <input type="password" id="password" name="password" value={passwordData.password} onChange={handlePasswordChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password_confirmation">Confirm New Password</label>
          <input type="password" id="password_confirmation" name="password_confirmation" value={passwordData.password_confirmation} onChange={handlePasswordChange} />
        </div>

        <button type="submit" disabled={isLoading} className="profile-submit-btn">
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
        {feedback.message && <p className={`feedback ${feedback.type}`}>{feedback.message}</p>}
      </form>
    </div>
  );
};

export default ProfilePage;