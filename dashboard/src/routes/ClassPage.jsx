import { useParams } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from "react";
import "./ClassPage.css";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function ClassPage() {
  const { id } = useParams();

  const[classData, setClassData] = useState(null);
  const[studentData, setStudentData] = useState([]);
  const[teacherData, setTeacherData] = useState([]);
  const [gradesData, setGradesData] = useState([]);

  
  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classRef = doc(db, "classes", id);
        const classSnap = await getDoc(classRef);

        if (classSnap.exists()) {
          setClassData(classSnap.data());
          console.log(classSnap.data());
        //student list 
        try {
          console.log("bruh")
          if (classSnap.data().studentID?.length) {
            const studentFetches = classSnap.data().studentID.map(async (ref) => {
              const snap = await getDoc(ref);
              return { id: ref.id, ...snap.data() };
            });
            const allStudents = await Promise.all(studentFetches);
            setStudentData(allStudents);
            try {
              const gradesQuery = query(
                collection(db, "grades"),
                where("classID", "==", classRef) //match ref here
              );
              const gradeSnaps = await getDocs(gradesQuery);

              // match grade for the student in da class
              const studentRefIds = classSnap.data().studentID.map(ref => ref.id);
              const filteredGrades = gradeSnaps.docs
                .filter(g => studentRefIds.includes(g.data().studentID.id))
                .map(g => ({ id: g.id, ...g.data() }));

              setGradesData(filteredGrades);
              console.log(filteredGrades);
            } catch (e3) {
              console.error("Error fetching grades:", e3);
            }
            console.log(allStudents)
          }
        } catch (e2) {
          console.error("Error fetching student:", e2);
        }
        //teacher list 
        try {
          console.log("bruh 2")
          if (classSnap.data().teacherID?.length) {
            const teacherFetches = classSnap.data().teacherID.map(async (ref) => {
              const snap2 = await getDoc(ref);
              return { id: ref.id, ...snap2.data() };
            });
            const allTeachers = await Promise.all(teacherFetches);
            setTeacherData(allTeachers);
            console.log(allTeachers);
          }
        } catch (e2) {
          console.error("Error fetching teacher:", e2);
        }

        //getting grades

        } else {
          console.log("no class bruh");
        }
      } catch (error) {
        console.error("Error fetching class:", error);
      }
    };

    fetchClassData();
  }, [id]);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="content">
        {/* <h2 className="h2classpage">Class page for {id}</h2> */}
        {/* gonna make placeholder now  */}
          <div className="classpage-header">
            <h1 className="class-title">
              {classData ? `${classData.name} Class` : "Loading..."}
            </h1>
            <button className="dashboard-button">Teacher Dashboard</button>
        </div>

        <div className="stats-container">
            <div className="stat-card">
                <h3>Average Grade</h3>
                <p className="stat-value">B+</p>
            </div>
            <div className="stat-card">
                <h3>Student Enrolled</h3>
                <p className="stat-value">22</p>
            </div>
            <div className="stat-card">
                <h3>Contact Information</h3>
                <p>s.johnson@gmail.com</p>
                <p>(111) 111-1111</p>
            </div>
        </div>

        <div className="roster-container">
            <h2>Student Roster</h2>
            <table className="roster-table">
            <thead>
                <tr>
                <th>Student Name</th>
                <th>Student ID</th>
                <th>Overall Grade</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                <td>John Doe</td>
                <td>87654321</td>
                <td className="grade">A+</td>
                </tr>
                <tr>
                <td>Jane Avery</td>
                <td>87654322</td>
                <td className="grade">A</td>
                </tr>
            </tbody>
            </table>
        </div>

      </main>
    </div>
  );
}
