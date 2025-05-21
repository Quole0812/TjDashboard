import './TeacherDash.css';
import { FaEdit, FaTimes, FaPlus } from 'react-icons/fa';
import fetchStudents, { fetchTeachers, updateClassTeachers, updateClassStudents } from "../utils/students";
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const TeacherDashboard = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [classStudents, setClassStudents] = useState([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [error, setError] = useState('');

  // fetch all students, teachers, and class data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsData, teachersData] = await Promise.all([
          fetchStudents(),
          fetchTeachers()
        ]);
        setStudents(studentsData);
        setInstructors(teachersData);

        // fetch class doc
        const classRef = doc(db, "classes", id);
        const classSnap = await getDoc(classRef);

        if (classSnap.exists()) {
          const classDoc = classSnap.data();
          setClassTeachers(classDoc.teacherIDs || []);
          setClassStudents(classDoc.studentIDs || []);
        } else {
          console.warn("No such class document.");
        }
      } catch (error) {
        console.error("Could not fetch students, teachers, or class", error);
      }
    };
    fetchData();
  }, [id]);

  // add Teacher to class
  const handleAddTeacherToClass = async (teacherId) => {
    setError('');
    try {
      await updateClassTeachers(id, teacherId);
      setClassTeachers((prev) => [...new Set([...prev, teacherId])]);
      setShowTeacherModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // add Student to class
  const handleAddStudentToClass = async (studentId) => {
    setError('');
    try {
      await updateClassStudents(id, studentId);
      setClassStudents((prev) => [...new Set([...prev, studentId])]);
      setShowStudentModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // filtered lists for dashboard display
  const dashboardTeachers = instructors.filter(t => classTeachers.includes(t.id));
  const dashboardStudents = students.filter(s => classStudents.includes(s.id));

  return (
    <main className="main-content">
      {/* Add Teacher Modal */}
      {showTeacherModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Teacher to Add</h3>
            <ul className="modal-list">
              {instructors.map((teacher) => (
                <li key={teacher.id} className="modal-list-item">
                  <span>{teacher.name} ({teacher.email})</span>
                  <button onClick={() => handleAddTeacherToClass(teacher.id)} className="modal-select-btn">Add</button>
                </li>
              ))}
            </ul>
            {error && <div className="form-error">{error}</div>}
            <div className="modal-actions">
              <button type="button" onClick={() => setShowTeacherModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* add student modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Student to Add</h3>
            <ul className="modal-list">
              {students.map((student) => (
                <li key={student.id} className="modal-list-item">
                  <span>{student.name} (ID: {student.id})</span>
                  <button onClick={() => handleAddStudentToClass(student.id)} className="modal-select-btn">Add</button>
                </li>
              ))}
            </ul>
            {error && <div className="form-error">{error}</div>}
            <div className="modal-actions">
              <button type="button" onClick={() => setShowStudentModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Class Dashboard</h1>
        <button className="dashboard-btn">Teacher Dashboard</button>
      </div>
      <hr className="dashboard-divider" />

      {/* stat cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Average Grade</div>
          <div className="stat-value">B+</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Students Enrolled</div>
          <div className="stat-value">{dashboardStudents.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Contact Information</div>
          <div className="stat-contact">s.johnson@gmail.com<br/>(111) 111-1111</div>
        </div>
      </div>

      {/* active instructors */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">Active Instructors</div>
          <button className="add-teacher-btn" onClick={() => setShowTeacherModal(true)}><FaPlus className="add-icon" /> Add Teacher</button>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Instructor Name</th>
              <th>Email</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-gap-row">
              <td colSpan={3}></td>
            </tr>
            {dashboardTeachers.map((inst, idx) => (
              <tr key={inst.id || idx}>
                <td>{inst.name}</td>
                <td>{inst.email}</td>
                <td>{inst.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* student roster */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">Student Roster</div>
          <button className="add-student-btn" onClick={() => setShowStudentModal(true)}><FaPlus className="add-icon" /> Add Student</button>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>ID</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-gap-row">
              <td colSpan={3}></td>
            </tr>
            {dashboardStudents.map((student, idx) => (
              <tr key={student.id || idx}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td>{student.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TeacherDashboard;