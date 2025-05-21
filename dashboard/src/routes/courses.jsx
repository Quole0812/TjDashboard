import { useState } from 'react';
import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import './courses.css';
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.js"; 
import { FaTrash } from 'react-icons/fa';

const Courses = () => {

  const [courses, setCourses] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', grade: '' });

  
  useEffect(() => {
  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, 'classes'));
    const courseList = querySnapshot.docs.map(doc => ({
      id: doc.id, 
      ...doc.data()
    }));
    setCourses(courseList);
  };

  fetchCourses();
}, []);



  const handleAddCourseClick = () => setModalOpen(true);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };


const handleAddCourse = async () => {
  if (newCourse.name && newCourse.grade) {
    try {
      const docRef = await addDoc(collection(db, 'classes'), {
        name: newCourse.name,
        gradeLevel: newCourse.grade,
        teacherID: 'placeholder-teacher-id'
      });

      const querySnapshot = await getDocs(collection(db, 'classes'));
      const courseList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCourses(courseList);

      setNewCourse({ name: '', grade: '' });
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
};


const handleDeleteCourse = async (courseId) => {
  try {
    // delete from Firestore
    await deleteDoc(doc(db, 'classes', courseId));

    // update local state (NOT WORKING)
    setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
  } catch (err) {
    console.error('Error deleting course:', err);
  }
};


  return (
    <div className="courses-container">
      <Sidebar />
      <main className={`main-content ${modalOpen ? 'blurred' : ''}`}>
        <h1 className="courses-title">Courses</h1>
        <button className="add-course-btn" onClick={handleAddCourseClick}>
          + Add Courses
        </button>

        <div className="courses-grid">
          {courses.map((course) => (
            <div className="column" key={course.id}>
              <Link className="card-link" to={`/courses/${course.id}`}>
                <div className="course-card">
                  <div className="card-header">
                    <h2>{course.name}</h2>
                    <FaTrash
                      className="icon delete-icon"
                      title="Delete Course"
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleDeleteCourse(course.id);
                      }}
                    />
                  </div>
                  <p className="label">Teacher ID</p>
                  <p className="value">
                    {course.teacherID
                      ? typeof course.teacherID === 'object'
                        ? course.teacherID.id
                        : course.teacherID
                      : 'Not assigned'}
                  </p>
                  <p className="label">Grade Level</p>
                  <p className="value">{course.gradeLevel}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>


      {modalOpen && (
  <div
    className="modal-overlay"
    onClick={() => setModalOpen(false)} 
  >
    <div
      className="modal-box"
      onClick={(e) => e.stopPropagation()} 
    >
      <h2>Add Course</h2>
      <div className="modal-field">
        <label>Class Name:</label>
        <input
          type="text"
          name="name"
          value={newCourse.name}
          onChange={handleFormChange}
        />
      </div>
      <div className="modal-field">
        <label>Grade Level:</label>
        <input
          type="text"
          name="grade"
          value={newCourse.grade}
          onChange={handleFormChange}
        />
      </div>
      <button className="add-course-modal-btn" onClick={handleAddCourse}>
        + Add Course
      </button>
    </div>
  </div>
)}

    </div>
  );
};

export default Courses;
