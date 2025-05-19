import React from "react";
import Sidebar from "../components/Sidebar";
import { teachers } from "../data/listteachers";
import "../components/Sidebar.css"; // ensure the CSS (including main/.main-list/.main-footer) is loaded
import AddTeacher from "../components/AddTeacherToTJ";
import EditTeacher from "../components/EditTeacher";

export default function TeacherDirectory() {
  return (
    <>
      <Sidebar />

      <main>
        {/* 1) scrollable list */}
        <div className="main-list">
          {teachers.map((teacher, i) => (
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
              <h2 style={{ margin: 0 }}>{teacher.name}</h2>
              <span
                style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}
              >
                <p style={{ margin: "4px 0" }}>ID: {teacher.id}</p>
                <button style={{ padding: "0.5rem 1rem", fontSize: "1rem" }}>
                  Delete Teacher
                </button>
              </span>
              <span
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <p style={{ margin: 0 }}>Grade: {teacher.grade}</p>
                <EditTeacher name={teacher.name} id={teacher.id}/>
              </span>
            </div>
          ))}
        </div>

        {/* 2) footer with always‐visible button */}
        <div className="main-footer">
          <AddTeacher/>
        </div>
      </main>
    </>
  );
}
