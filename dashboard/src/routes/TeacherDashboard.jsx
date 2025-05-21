import './TeacherDash.css';
import fetchStudents, { fetchTeachers, updateClassTeachers, updateClassStudents } from "../utils/students";

import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6'
import { useParams, Link } from 'react-router-dom';

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const TeacherDashboard = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [classTeachers, setClassTeachers] = useState([]);
  const [classStudents, setClassStudents] = useState([]);

  const [classData, setClassData] = useState(null);
  const [gradesData, setGradesData] = useState([]);

  const [error, setError] = useState('');

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editingTeacher, setEditingTeacher] = useState(null);
  
  const [studentSearch, setStudentSearch] = useState('');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]);

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
          setClassData(classDoc);
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

  // calculate grade average
  function calculateAverageGrade(gradesArray) {
    if (!gradesArray.length) return "N/A";

    const total = gradesArray.reduce((sum, grade) => {
      const gpa = gradeToGPA[grade] ?? 0;
      return sum + gpa;
    }, 0);

    const avgGPA = total / gradesArray.length;

    return avgGPA.toFixed(2); 
  }

  function gpaToLetter(gpa) {
    if (gpa >= 3.85) return "A";
    if (gpa >= 3.7) return "A-";
    if (gpa >= 3.3) return "B+";
    if (gpa >= 3.0) return "B";
    if (gpa >= 2.7) return "B-";
    if (gpa >= 2.3) return "C+";
    if (gpa >= 2.0) return "C";
    if (gpa >= 1.7) return "C-";
    if (gpa >= 1.3) return "D+";
    if (gpa >= 1.0) return "D";
    if (gpa >= 0.7) return "D-";
    return "F";
  }

  const letterGrades = gradesData.map((g) => g.grade);
  const avgGPA = calculateAverageGrade(letterGrades);
  const avgLetter = gpaToLetter(avgGPA);  

  // selecting students/ teachers for add func
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredTeachers = instructors.filter(teacher =>
    teacher.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    teacher.email.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  const handleStudentSelect = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleTeacherSelect = (teacherId) => {
    setSelectedTeachers(prev =>
      prev.includes(teacherId)
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleBulkAddStudents = async () => {
    setError('');
    try {
      for (const studentId of selectedStudents) {
        await updateClassStudents(id, studentId);
      }
      setClassStudents(prev => [...new Set([...prev, ...selectedStudents])]);
      setSelectedStudents([]);
      setShowStudentModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBulkAddTeachers = async () => {
    setError('');
    try {
      for (const teacherId of selectedTeachers) {
        await updateClassTeachers(id, teacherId);
      }
      setClassTeachers(prev => [...new Set([...prev, ...selectedTeachers])]);
      setSelectedTeachers([]);
      setShowTeacherModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseModal = (modalType) => {
    if (modalType === 'student') {
      setShowStudentModal(false);
      setSelectedStudents([]);
      setStudentSearch('');
    } else {
      setShowTeacherModal(false);
      setSelectedTeachers([]);
      setTeacherSearch('');
    }
  };

  // editing student/ teacher info
  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowEditStudentModal(true);
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setShowEditTeacherModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const studentRef = doc(db, "students", editingStudent.id);
      await updateDoc(studentRef, {
        name: editingStudent.name,
        id: editingStudent.id,
        grade: editingStudent.grade
      });
      
      setStudents(students.map(s => 
        s.id === editingStudent.id ? editingStudent : s
      ));
      
      setShowEditStudentModal(false);
      setEditingStudent(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTeacher = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const teacherRef = doc(db, "teachers", editingTeacher.id);
      await updateDoc(teacherRef, {
        name: editingTeacher.name,
        email: editingTeacher.email,
        phone: editingTeacher.phone
      });
      
      setInstructors(instructors.map(t => 
        t.id === editingTeacher.id ? editingTeacher : t
      ));
      
      setShowEditTeacherModal(false);
      setEditingTeacher(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const dashboardTeachers = instructors.filter(t => classTeachers.includes(t.id));
  const dashboardStudents = students.filter(s => classStudents.includes(s.id));

  return (
    <main className="main-content">
      {/* Edit Student Modal */}
      {showEditStudentModal && editingStudent && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Student</h3>
            <form onSubmit={handleUpdateStudent}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingStudent.name}
                  onChange={(e) => setEditingStudent({...editingStudent, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>ID:</label>
                <input
                  type="text"
                  value={editingStudent.id}
                  onChange={(e) => setEditingStudent({...editingStudent, id: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Grade:</label>
                <input
                  type="text"
                  value={editingStudent.grade}
                  onChange={(e) => setEditingStudent({...editingStudent, grade: e.target.value})}
                  required
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditStudentModal(false)}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditTeacherModal && editingTeacher && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Teacher</h3>
            <form onSubmit={handleUpdateTeacher}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editingTeacher.name}
                  onChange={(e) => setEditingTeacher({...editingTeacher, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editingTeacher.email}
                  onChange={(e) => setEditingTeacher({...editingTeacher, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={editingTeacher.phone}
                  onChange={(e) => setEditingTeacher({...editingTeacher, phone: e.target.value})}
                  required
                />
              </div>
              {error && <div className="form-error">{error}</div>}
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditTeacherModal(false)}>Cancel</button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {showTeacherModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Teachers to Add</h3>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search teachers..."
                value={teacherSearch}
                onChange={(e) => setTeacherSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <ul className="modal-list">
              {filteredTeachers.map((teacher) => (
                <li key={teacher.id} className="modal-list-item">
                  <div className="selectable-item">
                    <input
                      type="checkbox"
                      checked={selectedTeachers.includes(teacher.id)}
                      onChange={() => handleTeacherSelect(teacher.id)}
                      className="select-checkbox"
                    />
                    <span>{teacher.name} ({teacher.email})</span>
                  </div>
                </li>
              ))}
            </ul>
            {error && <div className="form-error">{error}</div>}
            <div className="modal-actions">
              <button type="button" onClick={() => handleCloseModal('teacher')}>Cancel</button>
              <button 
                type="button" 
                onClick={handleBulkAddTeachers}
                disabled={selectedTeachers.length === 0}
                className="add-selected-btn"
              >
                Add Selected ({selectedTeachers.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showStudentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select Students to Add</h3>
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <ul className="modal-list">
              {filteredStudents.map((student) => (
                <li key={student.id} className="modal-list-item">
                  <div className="selectable-item">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleStudentSelect(student.id)}
                      className="select-checkbox"
                    />
                    <span>{student.name} (ID: {student.id})</span>
                  </div>
                </li>
              ))}
            </ul>
            {error && <div className="form-error">{error}</div>}
            <div className="modal-actions">
              <button type="button" onClick={() => handleCloseModal('student')}>Cancel</button>
              <button 
                type="button" 
                onClick={handleBulkAddStudents}
                disabled={selectedStudents.length === 0}
                className="add-selected-btn"
              >
                Add Selected ({selectedStudents.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">{classData ? `${classData.name} Dashboard` : "Loading..."}</h1>
          <Link to={`/courses/${id}`}>
            <button className="class-btn">Class Page</button>
          </Link>      
        </div>
      <hr className="dashboard-divider" />

      {/* stat cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-title">Average Grade</div>
          <p className="stat-value">{avgLetter}</p>
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
              <th><FaEdit className="edit-icon" /></th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-gap-row">
              <td colSpan={5}></td>
            </tr>
            {dashboardTeachers.map((inst, idx) => (
              <tr key={inst.id || idx}>
                <td>{inst.name}</td>
                <td>{inst.email}</td>
                <td>{inst.phone}</td>
                <td><FaEdit className="edit-icon" onClick={() => handleEditTeacher(inst)} /></td>
                <td><FaDeleteLeft className="delete-icon" /></td>
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
              <td><FaEdit className="edit-icon" /></td> 
            </tr>
          </thead>
          <tbody>
            <tr className="table-gap-row">
              <td colSpan={5}></td>
            </tr>
            {dashboardStudents.map((student, idx) => (
              <tr key={student.id || idx}>
                <td>{student.name}</td>
                <td>{student.id}</td>
                <td>{student.grade}</td>
                <td><FaEdit className="edit-icon" onClick={() => handleEditStudent(student)} /></td>
                <td><FaDeleteLeft className="delete-icon" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TeacherDashboard;