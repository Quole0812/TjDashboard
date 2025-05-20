// StudentDirectory.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { students } from "../data/liststudents";
import "./Student.css";
import AddStudent from "../components/AddStudentToTJ";
import EditStudent from "../components/EditStudent";

export default function StudentDirectory() {
  return (
    <div className="layout">
      <Sidebar />

      <div className="content">
        <div className="main-footer">
          <AddStudent />
        </div>

        <div className="scroll-container">
          {students.map((student, i) => (
            <div key={i} className="student-card">
              <h2 style={{ margin: 0 }}>{student.name}</h2>

              <div className="card-row">
                <p style={{ margin: 0 }}>ID: {student.id}</p>
                <button className="student-button">Delete Student</button>
              </div>

              <div className="card-row">
                <p style={{ margin: 0 }}>Grade: {student.grade}</p>
                <EditStudent name={student.name} id={student.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
