import { useParams } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import "./ClassPage.css";

export default function ClassPage() {
  const { id } = useParams();

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="content">
        {/* <h2 className="h2classpage">Class page for {id}</h2> */}
        {/* gonna make placeholder now  */}
          <div className="classpage-header">
            <h1 className="class-title">Mrs. Johnson Class.</h1>
            <button className="dashboard-button">Teacher Dashboard</button>
        </div>

        <div className="stats-container">
            <div className="stat-card">
                <h3>Average Grade</h3>
                <p className="stat-value">B+</p>
            </div>
            <div className="stat-card">
                <h3>Student Enrolled</h3>
                <p className="stat-value">22</p>
            </div>
            <div className="stat-card">
                <h3>Contact Information</h3>
                <p>s.johnson@gmail.com</p>
                <p>(111) 111-1111</p>
            </div>
        </div>

        <div className="roster-container">
            <h2>Student Roster</h2>
            <table className="roster-table">
            <thead>
                <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Overall Grade</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>John Doe</td>
                <td>87654321</td>
                <td className="grade">A+</td>
                </tr>
                <tr>
                <td>Jane Avery</td>
                <td>87654322</td>
                <td className="grade">A</td>
                </tr>
            </tbody>
            </table>
        </div>

      </main>
    </div>
  );
}
