import React, { useState } from "react";
import "./AddToTJ.css";
import { db } from "../../firebase";
import { collection, addDoc, getDocs,  } from "firebase/firestore";

export default function AddTeachertoTJ({fetchTeachers}) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

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
    if(!phoneNumber.trim()) {
      alert("Please fill in the phone number field.");
      return;
    }
    if(!email.trim()) {
      alert("Please fill in the email field.");
      return;
    }

    try {
      await addDoc(collection(db, "teachers"), {
        name: name.trim(),
        grade: gradeLevel.trim(),
        phone: phoneNumber.trim(),
        email: email.trim(),
      });
      console.log("Teacher saved:", { name, gradeLevel });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setShowPopup(false);
    setName("");
    setGradeLevel("");
    setPhoneNumber("");
    setEmail("");
    fetchTeachers();
  };

  return (
    <>
      <button className="add-button" onClick={() => setShowPopup(true)}>Add Teacher</button>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Add Teacher to Thomas Jefferson Elementary</h2>
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
              <div className="info-row">
                <label className="label">Email:</label>
                <input
                  type="email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="info-row">
                <label className="label">Phone Number:</label>
                <input
                  type="text"
                  className="input-field"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
