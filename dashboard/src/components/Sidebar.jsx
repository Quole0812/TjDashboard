import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBook, FaCalendarAlt, FaChalkboardTeacher, FaUserGraduate, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import TJLogo from '../assets/TJ-logo.jpg';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/">
          <img src={TJLogo} alt="TJ Logo" className="sidebar-logo" />
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/courses" className={isActive('/courses') ? 'active' : ''}>
              <FaBook /> Courses
            </Link>
          </li>
          <li>
            <Link to="/students" className={isActive('/students') ? 'active' : ''}>
              <FaUserGraduate /> Student Directory
            </Link>
          </li>
          <li>
            <Link to="/teachers" className={isActive('/teachers') ? 'active' : ''}>
              <FaChalkboardTeacher /> Teacher Directory
            </Link>
          </li>
          <li>
            <Link to="/calendar" className={isActive('/calendar') ? 'active' : ''}>
              <FaCalendarAlt /> Event Calendar
            </Link>
          </li>
        </ul>
      </nav>
      <div className="auth-buttons">
        {currentUser ? (
          <>
            <div className="welcome-message">
              Welcome, {currentUser.displayName || currentUser.email}
            </div>
            <button onClick={handleLogout} className="logout-button">
              <FaSignOutAlt /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-button">
              <FaSignInAlt /> Login
            </Link>
            <Link to="/signup" className="signup-button">
              <FaUserPlus /> Sign Up
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
