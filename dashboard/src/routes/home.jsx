import DashboardWidget from '../components/DashboardWidget';
import schoolImg from '../assets/TJ-school.jpg';
import '../components/home.css';
import TJLogo from '../assets/TJ-logo.jpg';
import { IoCalendarOutline } from "react-icons/io5";
import { GoFile, GoFileDirectory } from "react-icons/go";
import { PiStudent } from "react-icons/pi";
import { FaChalkboardTeacher } from "react-icons/fa";
import { LuNotebook } from "react-icons/lu";

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
      <DashboardWidget title="Courses" to="/courses" icons={[<LuNotebook />]}/>
      <DashboardWidget title="Event Calendar" to="/calendar" icons={[<IoCalendarOutline />]}/>
      <DashboardWidget title="Student Directory" to="/students" icons={[<PiStudent />, <GoFileDirectory />]}/>
      <DashboardWidget title="Teacher Directory" to="/teachers" icons={[<FaChalkboardTeacher />, <GoFileDirectory />]}/>
    </div>
  </div>
);

export default Home;