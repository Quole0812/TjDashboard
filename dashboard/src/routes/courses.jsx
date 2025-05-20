{/* import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import './courses.css';

const Courses = () => {

  const courseCards = Array(6).fill({
    teacher: "Mrs. Johnson’s Class",
    teacherId: "4444444444",
    gradeLevel: "2"
  });

  const rows = [];
  for (let i = 0; i < courseCards.length; i += 3) {
    const row = courseCards.slice(i, i + 3);
    while (row.length < 3) {
      row.push(null); 
    }
    rows.push(row);
  }

  return (
    <div class="courses-container">
      <Sidebar />
      <main class="main-content">
        <h1 className="courses-title">Courses</h1>
        <button className="add-course-btn">+ Add Courses</button>

        <div className="courses-wrapper">
          {rows.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((course, colIndex) => (
                <div className="column" key={colIndex}>
                  {course && (
                    <Link to={`/courses/${rowIndex * 3 + colIndex}`} className="card-link">
                      <div className="course-card">
                        <div className="card-header">
                          <h2>{course.teacher}</h2>
                          
                        </div>
                        <p className="label">Teacher ID</p>
                        <p className="value">{course.teacherId}</p>
                        <p className="label">Grade Level</p>
                        <p className="value">{course.gradeLevel}</p>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Courses;
*/}

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import './courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([
    { teacher: 'Mrs. Johnson’s Class', teacherId: '4444444444', gradeLevel: '2' },
    { teacher: 'Mrs. Johnson’s Class', teacherId: '4444444444', gradeLevel: '2' },
    { teacher: 'Mrs. Johnson’s Class', teacherId: '4444444444', gradeLevel: '2' }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', grade: '' });

  // Group into rows of 3
  const rows = [];
  for (let i = 0; i < courses.length; i += 3) {
    const row = courses.slice(i, i + 3);
    while (row.length < 3) row.push(null); // fill to maintain 3 columns
    rows.push(row);
  }

  const handleAddCourseClick = () => setModalOpen(true);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.grade) {
      const courseToAdd = {
        teacher: newCourse.name,
        teacherId: Math.floor(100000000 + Math.random() * 900000000).toString(), // Random ID
        gradeLevel: newCourse.grade
      };
      setCourses([...courses, courseToAdd]);
      setModalOpen(false);
      setNewCourse({ name: '', grade: '' });
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

        <div className="courses-wrapper">
          {rows.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((course, colIndex) => (
                <div className="column" key={colIndex}>
                  {course && (
                    <Link class="card-link"
                      to={`/courses/${course.teacherId}`}
                      className="card-link"
                    >
                      <div className="course-card">
                        <div className="card-header">
                          <h2>{course.teacher}</h2>
                        </div>
                        <p className="label">Teacher ID</p>
                        <p className="value">{course.teacherId}</p>
                        <p className="label">Grade Level</p>
                        <p className="value">{course.gradeLevel}</p>
                      </div>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
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
