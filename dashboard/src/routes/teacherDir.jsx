import React from "react";
import Sidebar from "../components/Sidebar";
import { teachers } from "../data/listteachers";
import { useState, useEffect } from "react";
import "./teacher.css";
import AddTeacherToTJ from "../components/AddTeacherToTJ";
import EditTeacher from "../components/EditTeacher";
import { VscError } from "react-icons/vsc";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
export default function TeacherDirectory() {
  const [teachers, setTeachers] = useState([]);
  const [noTeachers, setNoTeachers] = useState(false);
  const deleteTeacher = async (id) => {
    try {
      await deleteDoc(doc(db, "teachers", id));
      fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher: ", error);
    }
  };
  const fetchTeachers = async () => {
    try {
      console.log("Fetching teachers...");
      const teacherSnapshot = await getDocs(collection(db, "teachers"));
      const teacherList = teacherSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (teacherList.length === 0) {
        setNoTeachers(true);
      } else {
        setNoTeachers(false);
        console.log("Teacher List: ", teacherList);
        setTeachers(teacherList);
      }
    } catch (error) {
      console.error("Error fetching Teachers: ", error);
    }
  };
  useEffect(() => {
    fetchTeachers();
  }, []);
  return (
    <>
      <Sidebar />
      <div className="layout">
        <div className="content">
          <div className="main-footer">
            <AddTeacherToTJ fetchTeachers={fetchTeachers} />
          </div>
          <div className="categories">
            <div className="teacher-header">
              <p>Name</p>
              <p>Grade</p>
              <p>Phone Number</p>
              <p>Email</p>
              <p>Actions</p>
            </div>
          </div>

          <div className="scroll-container">
            {teachers.map((teacher, i) => (
              <div key={i} className="teacher-entry">
                <p>{teacher.name}</p>
                <p>{teacher.grade}</p>
                <p>{teacher.phone}</p>
                <p>{teacher.email}</p>
                <div className="teacher-actions">
                  <EditTeacher
                    currentName={teacher.name}
                    currentGrade={teacher.grade}
                    currentEmail={teacher.email}
                    currentPhone={teacher.phone}
                    id={teacher.id}
                    fetchStudents={fetchTeachers}
                  />
                  <button
                    className="icon-button"
                    onClick={() => deleteTeacher(teacher.id)}
                  >
                    <VscError />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
