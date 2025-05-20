import { Link, useLocation } from 'react-router-dom';
import { FaBook, FaCalendarAlt, FaChalkboardTeacher, FaUserGraduate } from 'react-icons/fa';
import TJLogo from '../assets/TJ-logo.jpg';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
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
    </div>
  );
};

export default Sidebar;
