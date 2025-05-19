import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/courses">Courses</Link>
          </li>
          <li>
            <Link to="/students">Student Directory</Link>
          </li>
          <li>
            <Link to="/teachers">Teacher Directory</Link>
          </li>
          <li>
            <Link to="/calendar">Event Calendar</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
