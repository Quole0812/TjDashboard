import Sidebar from '../components/Sidebar';
import TeacherDashboard from './TeacherDashboard';
import './TeacherDash.css';
import { useAuth } from '../components/AuthContext';
import { Navigate } from 'react-router-dom';

const TeacherDashboardPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="dashboard-layout" style={{backgroundColor: "#E4E4E4"}}>
      <Sidebar />
      <TeacherDashboard />
    </div>
  );
};

export default TeacherDashboardPage;
