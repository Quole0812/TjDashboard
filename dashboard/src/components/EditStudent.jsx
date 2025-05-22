import React, { useState } from "react";
import "./EditAtTJ.css";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FaPencilAlt } from "react-icons/fa";

export default function EditStudent({
  currentGradeLevel,
  currentAcademicGrade,
  currentName,
  id,
  fetchStudents,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState(currentName);
  const [gradeLevel, setGradeLevel] = useState(currentGradeLevel);
  const [academicGrade, setAcademicGrade] = useState(currentAcademicGrade);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !gradeLevel.trim() || !academicGrade.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    if (name === currentName && gradeLevel === currentGradeLevel && academicGrade === currentAcademicGrade) {
      alert("Please edit at least one field. No fields can be empty.");
      return;
    }

    try {
      await updateDoc(doc(db, "students", id), {
        name: name.trim(),
        gradeLevel: gradeLevel.trim(),
        academicGrade: academicGrade.trim(),
      });
      console.log("Student updated:", { name, gradeLevel, academicGrade });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
    setShowPopup(false);
    setName("");
    setGradeLevel("");
    setAcademicGrade("");
    fetchStudents();
  };

  return (
    <>
      <button className="edit-button" onClick={() => setShowPopup(true)}>
        <FaPencilAlt className="edit-icon" />
      </button>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>Edit Student</h2>
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
                <button type="submit">Update</button>
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
