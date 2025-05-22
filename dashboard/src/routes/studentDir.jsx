// StudentDirectory.jsx
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { VscError } from "react-icons/vsc";
// import { students } from "../data/liststudents";
import "./directory.css";
import AddStudentToTJ from "../components/AddStudentToTJ";
// import AddToTJ from "../components/AddToTJ";
import EditStudent from "../components/EditStudent";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function StudentDirectory() {
  const [students, setStudents] = useState([]);
  const [noStudents, setNoStudents] = useState(false);

  const deleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student: ", error);
    }
  };
  const fetchStudents = async () => {
    try {
      console.log("Fetching students...");
      const studentSnapshot = await getDocs(collection(db, "students"));
      const studentList = studentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (studentList.length === 0) {
        setNoStudents(true);
      } else {
        setNoStudents(false);
        console.log("Student List: ", studentList);
        setStudents(studentList);
      }
    } catch (error) {
      console.error("Error fetching students: ", error);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <Sidebar />
      <div className="layout">
        <div className="content">
          <div className="main-footer">
            <div className="header-row">
              <h1>Student Directory</h1>
              <AddStudentToTJ fetchStudents={fetchStudents} />
            </div>
          </div>
          <div className="categories">
            <div className="student-header">
              <p className="header-cell">Name</p>
              <p className="header-cell">ID</p>
              <p className="header-cell">Grade</p>
              <p className="header-cell">Actions</p>
            </div>
          </div>

          <div className="scroll-container">
            {!noStudents &&
              students.map((student, i) => (
                <div key={i} className="student-card student-entry">
                  <p>{student.name}</p>
                  <p>{student.id}</p>
                  <p>{student.grade}</p>

                  <div className="student-actions">
                    <div className="tooltip">
                      <EditStudent
                        currentName={student.name}
                        currentGrade={student.grade}
                        id={student.id}
                        fetchStudents={fetchStudents}
                      />
                      <span className="tooltiptext">Edit Student</span>
                    </div>
                    <div className="tooltip">
                      <button
                        className="icon-button"
                        onClick={() => deleteStudent(student.id)}
                      >
                        <VscError />
                      </button>
                      <span className="tooltiptext">Delete Student</span>
                    </div>
                  </div>
                </div>
              ))}
            {noStudents && (
              <div className="no-students">
                <h2>No students found.</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}