import React, { useState } from "react";
import "./AddToTJ.css";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { IoIosAdd } from "react-icons/io";

export default function AddStudentToTJ({fetchStudents}) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [academicGrade, setAcademicGrade] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if(!name.trim()){
      alert("Please fill in the name field.");
      return;
    }
    if (!gradeLevel.trim()) {
      alert("Please fill in the grade level field.");
      return;
    }
    if (!academicGrade.trim()) {
      alert("Please fill in the academic grade field.");
      return;
    }

    try {
      await addDoc(collection(db, "students"), {
        name: name.trim(),
        gradeLevel: gradeLevel.trim(),
        academicGrade: academicGrade.trim(),
      });
      console.log("Student saved:", { name, gradeLevel, academicGrade });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setShowPopup(false);
    setName("");
    setGradeLevel("");
    setAcademicGrade("");
    fetchStudents();
  };

  return (
    <>
      <button className="add-button" onClick={() => setShowPopup(true)}>
        <IoIosAdd className="add-icon" />
        Add Student
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Add New Student</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="gradeLevel">Grade Level:</label>
                <input
                  type="text"
                  id="gradeLevel"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  placeholder="Enter grade level (e.g., 9, 10, 11, 12)"
                />
              </div>
              <div className="form-group">
                <label htmlFor="academicGrade">Academic Grade:</label>
                <input
                  type="text"
                  id="academicGrade"
                  value={academicGrade}
                  onChange={(e) => setAcademicGrade(e.target.value)}
                  placeholder="Enter academic grade (e.g., A+, B-, C)"
                />
              </div>
              <div className="button-group">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowPopup(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
