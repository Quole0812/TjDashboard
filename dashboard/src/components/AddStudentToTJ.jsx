import React, { useState } from "react";
import "./AddToTJ.css";
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { IoIosAdd } from "react-icons/io";
export default function AddStudentToTJ({fetchStudents}) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if(!name.trim()){
      alert("Please fill in the name field.");
      return;
    }
    if (!gradeLevel.trim()) {
      alert("Please fill in the grade field.");
      return;
    }

    try {
      await addDoc(collection(db, "students"), {
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
      <button className="add-button-icon" onClick={() => setShowPopup(true)}>
        <IoIosAdd size={25} />
        Add Student
        
        </button>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Add Student to Thomas Jefferson Elementary</h2>
            <form onSubmit={handleSubmit}>
              <div className="info-row">
                <label className="label">Name:</label>
                <input
                  type="text"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="info-row">
                <label className="label">Grade Level:</label>
                <input
                  type="number"
                  className="input-field"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="add-button">
                Submit
              </button>
              <button type="button" className="add-button" onClick={() => setShowPopup(false)}>
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}