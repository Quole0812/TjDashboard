
import React from "react";
import Sidebar from "../components/Sidebar";
import { teachers } from "../data/listteachers";
import "./directory.css";
import AddTeacher from "../components/AddTeacherToTJ";
import EditTeacher from "../components/EditTeacher";

export default function TeacherDirectory() {
  return (
    <>
      <Sidebar />
      <div className="layout">
        <div className="content">
          <div className="main-footer">
            <AddTeacher />
          </div>
          <div className="categories">
            <div className="student-card">
              
                <h2 style={{ margin: 0 }}>Name</h2>
                <h2 style={{ margin: 0 }}>ID</h2>
                <h2 style={{ margin: 0 }}>Grade</h2>
            </div>
          </div>

          <div className="scroll-container">
            {teachers.map((teacher, i) => (
              <div key={i} className="student-card">
                <h2 style={{ margin: 0 }}>{teacher.name}</h2>

                <div className="card-row">
                  <p style={{ margin: 0 }}>{teacher.id}</p>
                  <button className="student-button">Delete Teacher</button>
                </div>

                <div className="card-row">
                  <p style={{ margin: 0 }}>{teacher.grade}</p>
                  <EditTeacher name={teacher.name} id={teacher.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
