// src/components/RegisterPage.jsx
import { useState } from 'react'; // <-- pal 1: import useState
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== password_confirmation) {
        setError('Passwords do not match.');
        return;
    }
    setIsLoading(true); 
    try {
      const data = await apiService('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });
      localStorage.setItem('authToken', data.token);
      navigate('/');
    } catch (err) {
      setError('Failed to register. The email might already be taken.');
      console.error(err);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <>
      <h1>Register</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"/>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="password"/>
        <input type="password" placeholder="Confirm Password" value={password_confirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required  autoComplete="password_confirmation"/>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </>
  );
};

export default RegisterPage;