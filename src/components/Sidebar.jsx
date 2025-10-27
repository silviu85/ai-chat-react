// src/components/Sidebar.jsx (Versiunea Corectată și Finală)
import { NavLink, useNavigate } from 'react-router-dom';
// Aici este importul corectat, care include FaPlusCircle
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
        {/* Acum, FaPlusCircle este definit și poate fi folosit aici */}
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