import DashboardWidget from '../components/DashboardWidget';
import schoolImg from '../assets/TJ-school.jpg';
import '../components/home.css';
import TJLogo from '../assets/TJ-logo.jpg';

const Home = () => (
  <div className="home-root" style={{ backgroundImage: `url(${schoolImg})` }}>
    <div className="home-header">
      <img
        src={TJLogo}
        alt="School Mascot is Thomas Jefferson with sunglasses."
        className="home-avatar"
      />
      <div>
        <h1 className="home-school-name">Thomas Jefferson Elementary School</h1>
      </div>
    </div>
    <h2 className="home-dashboard-title-align">School Admin Dashboard</h2>
    <div className="home-widgets">
      <DashboardWidget title="Courses" to="/courses" />
      <DashboardWidget title="Event Calendar" to="/calendar" />
      <DashboardWidget title="Student Directory" to="/students" />
      <DashboardWidget title="Teacher Directory" to="/teachers" />
    </div>
  </div>
);

export default Home;