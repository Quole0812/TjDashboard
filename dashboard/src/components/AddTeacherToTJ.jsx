import React, { useState } from "react";
import "./AddToTJ.css";
import { db } from "../../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { IoIosAdd } from "react-icons/io";
export default function AddTeachertoTJ({ fetchTeachers }) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [gradeLevel, setGradeLevel] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");

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
    if (!name.trim()) {
      alert("Please fill in the name field.");
      return;
    }
    if (!gradeLevel.trim()) {
      alert("Please fill in the grade field.");
      return;
    }
    if (!phoneNumber.trim()) {
      alert("Please fill in the phone number field.");
      return;
    }
    if (!email.trim()) {
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
      <button className="add-button-icon" onClick={() => setShowPopup(true)}>
        <IoIosAdd size={25} />
        Add Teacher
      </button>

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
