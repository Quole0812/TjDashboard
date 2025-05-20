// import { Link } from 'react-router-dom';
// import './Sidebar.css';

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <nav className="sidebar-nav">
//         <ul>
//           <li>
//             <Link to="/courses">Courses</Link>
//           </li>
//           <li>
//             <Link to="/students">Student Directory</Link>
//           </li>
//           <li>
//             <Link to="/teachers">Teacher Directory</Link>
//           </li>
//           <li>
//             <Link to="/calendar">Event Calendar</Link>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;
import { Link } from 'react-router-dom';
//import TJLogo from '../assets/TJ-logo.jpg';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/">
          {/* <img src={TJLogo} alt="TJ Logo" className="sidebar-logo" /> */}
        </Link>
      </div>
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