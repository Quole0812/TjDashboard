import Sidebar from '../components/Sidebar';
import TeacherDashboard from './TeacherDashboard';
import './TeacherDash.css';

const TeacherDashboardPage = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <TeacherDashboard />
    </div>
  );
};

export default TeacherDashboardPage;
