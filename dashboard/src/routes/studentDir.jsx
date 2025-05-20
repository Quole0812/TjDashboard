// StudentDirectory.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { students } from "../data/liststudents";
import "./directory.css";
import AddStudent from "../components/AddStudentToTJ";
import EditStudent from "../components/EditStudent";

export default function StudentDirectory() {
  return (
    <>
      <Sidebar />
      <div className="layout">
        <div className="content">
          <div className="main-footer">
            <AddStudent />
          </div>
          <div className="categories">
            <div className="student-card">
              
                <h2 style={{ margin: 0 }}>Name</h2>
                <h2 style={{ margin: 0 }}>ID</h2>
                <h2 style={{ margin: 0 }}>Grade</h2>
            </div>
          </div>

          <div className="scroll-container">
            {students.map((student, i) => (
              <div key={i} className="student-card">
                <h2 style={{ margin: 0 }}>{student.name}</h2>

                <div className="card-row">
                  <p style={{ margin: 0 }}>{student.id}</p>
                  <button className="student-button">Delete Student</button>
                </div>

                <div className="card-row">
                  <p style={{ margin: 0 }}>{student.grade}</p>
                  <EditStudent name={student.name} id={student.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
