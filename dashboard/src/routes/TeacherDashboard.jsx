import './TeacherDash.css';
import { FaEdit, FaTimes } from 'react-icons/fa';

const instructors = [
  { name: 'Jane Johnson', email: 'jane.smith@school.edu', phone: '(222) 222-2222' },
];

const students = [
  { id: '87654321', name: 'Joe', grade: 'A+' },
  { id: '87654321', name: 'Joseph', grade: 'A+' },
];

const TeacherDashboard = () => {
  return (
    <main className="main-content">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Mrs. Johnson Class.</h1>
        <button className="dashboard-btn">Teacher Dashboard</button>
      </div>
      <hr className="dashboard-divider" />

      {/* Stat Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Average Grade</div>
          <div className="stat-value">B+</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Students Enrolled</div>
          <div className="stat-value">22</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Contact Information</div>
          <div className="stat-contact">s.johnson@gmail.com<br/>(111) 111-1111</div>
        </div>
      </div>

      {/* Active Instructors */}
      <div className="section">
        <div className="section-title">Active Instructors</div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Instructor Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map((inst, idx) => (
              <tr key={idx}>
                <td>{inst.name}</td>
                <td>{inst.email}</td>
                <td>{inst.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Roster */}
      <div className="section">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>ID</th>
              <th>Grade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, idx) => (
              <tr key={idx}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td>{student.grade}</td>
                <td className="action-icons">
                  <button className="icon-btn" title="Edit"><FaEdit /></button>
                  <button className="icon-btn" title="Delete"><FaTimes /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TeacherDashboard;