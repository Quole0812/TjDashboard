import React, { useState } from "react";
import "./EditAtTJ.css";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FaPencilAlt } from "react-icons/fa";
export default function EditStudent({
  currentGrade,
  currentName,
  id,
  fetchStudents,
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState(currentName);
  const [gradeLevel, setGradeLevel] = useState(currentGrade);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !gradeLevel.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    if (name == currentName && gradeLevel == currentGrade) {
      alert("Please edit at least one field. Neither field can be empty.");
      return;
    }

    try {
      await updateDoc(doc(db, "students", id), {
        name: name.trim(),
        grade: gradeLevel.trim(),
      });
      console.log("Student saved:", { name, gradeLevel });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
    setShowPopup(false);
    setName("");
    setGradeLevel("");
    fetchStudents();
  };

  return (
    <>
      <button
        className="icon-button"
        onClick={() => {
          setName(currentName);
          setGradeLevel(currentGrade);
          setShowPopup(true);
        }}
      >
        <FaPencilAlt />
      </button>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Edit Student at Thomas Jefferson Elementary</h2>
            <form onSubmit={handleSubmit}>
              <div className="info-row">
                <label className="label">Name:</label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="info-row">
                <label className="label">Grade Level:</label>
                <input
                  type="number"
                  className="input-field"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}

                />
              </div>
              <button type="submit" className="add-button">
                Submit
              </button>
              <button
                type="button"
                className="add-button"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}