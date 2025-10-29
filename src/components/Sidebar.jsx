// src/components/Sidebar.jsx 
import { NavLink, useNavigate } from 'react-router-dom';
import { FaPlusCircle, FaHistory, FaUserCog, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>AI Chat</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" end>
          <FaPlusCircle className="sidebar-icon" /> New Chat
        </NavLink>
        <NavLink to="/history">
          <FaHistory className="sidebar-icon" /> History
        </NavLink>
        <NavLink to="/profile">
          <FaUserCog className="sidebar-icon" /> Profile
        </NavLink>
      </nav>
      <button onClick={handleLogout} className="logout-button-sidebar">
        <FaSignOutAlt className="sidebar-icon" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;