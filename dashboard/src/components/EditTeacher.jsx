import React, { useState } from "react";
import "./EditAtTJ.css";
import { db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { FaPencilAlt } from "react-icons/fa";
export default function EditTeacher({
  currentGrade,
  currentName,
  currentEmail,
  currentPhone,
  id,
  fetchTeachers
}) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState(currentName);
  const [gradeLevel, setGradeLevel] = useState(currentGrade);
  const [phoneNumber, setPhoneNumber] = useState(currentPhone);
  const [email, setEmail] = useState(currentEmail);
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 10); 
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return value;
    let result = "";
    if (match[1]) result += `(${match[1]}`;
    if (match[1] && match[1].length === 3) result += `) `;
    if (match[2]) result += match[2];
    if (match[2] && match[2].length === 3) result += `-`;
    if (match[3]) result += match[3];
    return result;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !gradeLevel.trim()|| !phoneNumber.trim() || !email.trim()) {
      alert("Please fill in all fields.");
      return;
    }
    if (name == currentName && gradeLevel == currentGrade && phoneNumber == currentPhone && email == currentEmail) {
      alert("Please edit at least one field. No field can be empty.");
      return;
    }

    try {
      await updateDoc(doc(db, "teachers", id), {
        name: name.trim(),
        grade: gradeLevel.trim(),
        phone: phoneNumber.trim(),
        email: email.trim(),
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setShowPopup(false);
    setName("");
    setGradeLevel("");
    setEmail("");
    setPhoneNumber("");
    fetchTeachers();
  };

  return (
    <>
      <button
        className="icon-button"
        onClick={() => {
          setName(currentName);
          setGradeLevel(currentGrade);
          setPhoneNumber(currentPhone);
          setEmail(currentEmail);
          setShowPopup(true);
        }}
      >
        <FaPencilAlt />
      </button>

      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Edit Teacher at Thomas Jefferson Elementary</h2>
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
                  type="text"
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
                  onChange={handlePhoneChange}
                  required
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