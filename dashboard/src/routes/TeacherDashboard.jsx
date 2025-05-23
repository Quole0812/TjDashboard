import './TeacherDash.css';
import fetchStudents, { fetchTeachers, updateClassTeachers, updateClassStudents } from "../utils/students";

import React, { useEffect, useState } from 'react';
import { FaEdit, FaTimes, FaPlus, FaSearch } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6'
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';

import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { query, getDocs, collection, where, addDoc } from "firebase/firestore";

const TeacherDashboard = () => {
  const { currentUser } = useAuth();
  const { id } = useParams();
  
  // Redirect if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const gradeToGPA = {
    "A+": 4.0, "A": 4.0, "A-": 3.7,
    "B+": 3.3, "B": 3.0, "B-": 2.7,
    "C+": 2.3, "C": 2.0, "C-": 1.7,
    "D+": 1.3, "D": 1.0, "D-": 0.7,
    "F": 0.0
  };

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

  const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

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

          setClassTeachers(classDoc.teacherIDs?.map(ref => ref.id) || []);
          setClassStudents(classDoc.studentIDs?.map(ref => ref.id) || []);

          // Fetch grades for all students in this class
          const gradesQuery = query(
            collection(db, "grades"),
            where("classID", "==", classRef)
          );
          const gradesSnapshot = await getDocs(gradesQuery);
          const gradesData = gradesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setGradesData(gradesData);

          // Update students with their grades
          const updatedStudents = studentsData.map(student => {
            const studentRef = doc(db, "students", student.id);
            const studentGrade = gradesData.find(
              grade => grade.studentID.id === studentRef.id
            );
            return {
              ...student,
              academicGrade: studentGrade?.grade || ""
            };
          });
          setStudents(updatedStudents);
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
  const handleEditStudent = async (student) => {
    try {
      // Fetch the student's grade for this class
      const studentRef = doc(db, "students", student.id);
      const gradesQuery = query(
        collection(db, "grades"),
        where("studentID", "==", studentRef),
        where("classID", "==", doc(db, "classes", id))
      );
      const gradeSnapshot = await getDocs(gradesQuery);
      
      const currentGrade = gradeSnapshot.empty ? "" : gradeSnapshot.docs[0].data().grade;
      
      setEditingStudent({
        ...student,
        academicGrade: currentGrade
      });
      setShowEditStudentModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setShowEditTeacherModal(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // update student's basic info
      const studentRef = doc(db, "students", editingStudent.id);
      await updateDoc(studentRef, {
        name: editingStudent.name,
        gradeLevel: editingStudent.gradeLevel
      });

      //handle grade update in Grades collection
      const studentGradeQuery = query(
        collection(db, "grades"),
        where("studentID", "==", studentRef),
        where("classID", "==", doc(db, "classes", id))
      );
      const gradeSnapshot = await getDocs(studentGradeQuery);

      if (!gradeSnapshot.empty) {
        // update existing grade doc
        const gradeDoc = gradeSnapshot.docs[0];
        await updateDoc(doc(db, "grades", gradeDoc.id), {
          grade: editingStudent.academicGrade
        });
      } else {
        // create new grade doc
        await addDoc(collection(db, "grades"), {
          studentID: studentRef,
          classID: doc(db, "classes", id),
          grade: editingStudent.academicGrade
        });
      }
      
      // refresh data
      const [studentsData, teachersData] = await Promise.all([
        fetchStudents(),
        fetchTeachers()
      ]);

      // fetch updated grades
      const classRef = doc(db, "classes", id);
      const classGradesQuery = query(
        collection(db, "grades"),
        where("classID", "==", classRef)
      );
      const gradesSnapshot = await getDocs(classGradesQuery);
      const gradesData = gradesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGradesData(gradesData);

      // update students w/ their grades
      const updatedStudents = studentsData.map(student => {
        const studentRef = doc(db, "students", student.id);
        const studentGrade = gradesData.find(
          grade => grade.studentID.id === studentRef.id
        );
        return {
          ...student,
          academicGrade: studentGrade?.grade || ""
        };
      });
      setStudents(updatedStudents);
      setInstructors(teachersData);
      
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

  const deleteStudent = async (e, studentId) => {
    e.preventDefault();
    setError('');
    try {
      // delete student from class
      const classRef = doc(db, "classes", id);
      const studentRef = doc(db, "students", studentId);
      const updatedStudentIds = classStudents.filter(id => id !== studentId);
      await updateDoc(classRef, {
        studentIDs: updatedStudentIds.map(id => doc(db, "students", id))
      });

      // Delete the student's grade document from the grades collection
      const gradeQuery = query(
        collection(db, "grades"),
        where("studentID", "==", studentRef),
        where("classID", "==", classRef)
      );
      const gradeSnapshot = await getDocs(gradeQuery);
      if (!gradeSnapshot.empty) {
        const gradeDocId = gradeSnapshot.docs[0].id;
        await deleteDoc(doc(db, "grades", gradeDocId));
      }
      
      // update state
      setClassStudents(updatedStudentIds);
      // Update gradesData state
      setGradesData(prevGrades => prevGrades.filter(grade => grade.studentID.id !== studentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTeacher = async (e, teacherId) => {
    e.preventDefault();
    setError('');
    try {
      // delete teacher from class
      const classRef = doc(db, "classes", id);
      const teacherRef = doc(db, "teachers", teacherId);
      const updatedTeacherIds = classTeachers.filter(id => id !== teacherId);
      await updateDoc(classRef, {
        teacherIDs: updatedTeacherIds.map(id => doc(db, "teachers", id))
      });
      
      // update state
      setClassTeachers(updatedTeacherIds);
    } catch (err) {
      setError(err.message);
    }
  };

  const dashboardTeachers = instructors.filter(t => classTeachers.includes(t.id));
  const dashboardStudents = students.filter(s => classStudents.includes(s.id));

  const calculateClassAverage = (students) => {
    const validGrades = students
      .filter(student => student.academicGrade && gradeToGPA[student.academicGrade] !== undefined)
      .map(student => gradeToGPA[student.academicGrade]);

    if (validGrades.length === 0) return "N/A";

    const average = validGrades.reduce((sum, grade) => sum + grade, 0) / validGrades.length;
    return average.toFixed(2);
  };

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
                <label>Grade Level:</label>
                <input
                  type="text"
                  value={editingStudent.gradeLevel}
                  onChange={(e) => setEditingStudent({...editingStudent, gradeLevel: e.target.value})}
                  placeholder="Enter grade level (e.g., 9, 10, 11, 12)"
                  required
                />
              </div>
              <div className="form-group">
                <label>Academic Grade:</label>
                <select
                  value={editingStudent.academicGrade || ""}
                  onChange={(e) => setEditingStudent({...editingStudent, academicGrade: e.target.value})}
                  required
                >
                  <option value="">Select a grade</option>
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
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
          <button className="class-btn" >Class Page</button>
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
          <div className="stat-contact">
            {dashboardTeachers.length > 0 ? (
              dashboardTeachers.map((teacher, index) => (
                <div key={teacher.id} className="teacher-contact">
                  <strong>{teacher.name}</strong><br/>
                  {teacher.email}<br/>
                  {teacher.phone}
                  {index < dashboardTeachers.length - 1 && <hr className="contact-divider" />}
                </div>
              ))
            ) : (
              <div>No instructors assigned</div>
            )}
          </div>
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
              <th style={{width: "30%"}}>Instructor Name</th>
              <th style={{width: "30%"}}>Email</th>
              <th style={{width: "20%"}}>Phone Number</th>
              <th style={{width: "10%"}}>Actions</th>
              <th style={{width: "10%"}}></th>
            </tr>
          </thead>
          </table>
          <table className="dashboard-table">
          <tbody>
            {/* <tr className="table-gap-row">
              <td colSpan={5}></td>
            </tr> */}
            {dashboardTeachers.map((inst, idx) => (
              <tr key={inst.id || idx}>
                <td style={{width: "30%"}}>{inst.name}</td>
                <td style={{width: "30%"}}>{inst.email}</td>
                <td style={{width: "20%"}}>{inst.phone}</td>
                <td style={{width: "10%"}}>
                  <div className="tooltip">
                    <FaEdit className="edit-icon" onClick={() => handleEditTeacher(inst)} />
                    <span className="tooltiptext">Edit Teacher</span>
                  </div>
                </td>
                <td style={{width: "10%"}}>
                  <div className="tooltip">
                    <FaDeleteLeft className="delete-icon-heading" onClick={(e) => deleteTeacher(e, inst.id)} />
                    <span className="tooltiptext">Delete Teacher</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* student roster */}
      <div className="section">
        <div className="section-header">
          <div className="section-title">Student Roster</div>
          <button className="add-student-btn" onClick={() => setShowStudentModal(true)}>
            <FaPlus className="add-icon" /> Add Student
          </button>
        </div>
        
        <table className="dashboard-table">
          <thead>
            <tr>
              <th style={{width: "22%"}}>Student Name</th>
              <th style={{width: "20%"}}>ID</th>
              <th style={{width: "15%"}}>Grade Level</th>
              <th style={{width: "18%"}}>Academic Grade</th>
              <th style={{width: "12.5%"}}>Actions</th>
              <th style={{width: "12.5%"}}></th>
            </tr>
          </thead>
          </table>
          <table className="dashboard-table">
          <tbody>
            {/* <tr className="table-gap-row">
              <td colSpan={6}></td>
            </tr> */}
            {dashboardStudents.map((student, idx) => (
              <tr key={student.id || idx}>
                <td style={{width: "22%"}}>{student.name}</td>
                <td style={{width: "20%"}}>{student.id}</td>
                <td style={{width: "15%"}}>{student.gradeLevel}</td>
                <td style={{width: "18%"}}>{student.academicGrade}</td>
                <td style={{width: "12.5%"}}>
                  <div className="tooltip">
                    <FaEdit 
                      className="edit-icon" 
                      onClick={() => handleEditStudent(student)} 
                    />
                    <span className="tooltiptext">Edit Student</span>
                  </div>
                </td>
                <td style={{width: "12.5%"}}>
                  <div className="tooltip">
                    <FaDeleteLeft 
                      className="delete-icon" 
                      onClick={(e) => deleteStudent(e, student.id)} 
                    />
                    <span className="tooltiptext">Delete Student</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default TeacherDashboard;