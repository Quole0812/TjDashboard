import React from "react";
import Sidebar from "../components/Sidebar";
import { students } from "../data/liststudents";
import "../components/Sidebar.css"; 
import AddStudent from "../components/AddStudentToTJ";
import EditStudent from "../components/EditStudent";
export default function StudentDirectory() {
  return (
    <>
      <Sidebar />

      <main>
        {/*scrollable list */}
        <div className="main-list">
          {students.map((student, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                marginBottom: "12px",
                width: "79vw",
                backgroundColor: "#333",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                color: "white",
              }}
            >
              <h2 style={{ margin: 0 }}>{student.name}</h2>
              <span
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
              >
                <p style={{ margin: "4px 0" }}>ID: {student.id}</p>
                <button style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
                  Delete Student
                </button>
              </span>
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ margin: 0 }}>Grade: {student.grade}</p>
                <EditStudent name={student.name} id={student.id}/>
              </span>
            </div>
          ))}
        </div>

        {/* footer*/}
        <div className="main-footer">
          <AddStudent/>
        </div>
      </main>
    </>
  );
}
