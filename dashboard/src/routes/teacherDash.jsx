import Sidebar from '../components/Sidebar';
import TeacherDashboard from './TeacherDashboard';
import './TeacherDash.css';

const TeacherDashboardPage = () => {
  return (
    <div className="dashboard-layout" style={{backgroundColor: "#E4E4E4"}}>
      <Sidebar />
      <TeacherDashboard />
    </div>
  );
};

export default TeacherDashboardPage;
