import { useParams, Link } from "react-router-dom";
import Sidebar from '../components/Sidebar';
import { useEffect, useState } from "react";
import "./ClassPage.css";
import { doc, getDoc, getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../firebase";

export default function ClassPage() {
  const { id } = useParams();
  const gradeToGPA = {
    "A+": 4.0,
    "A": 4.0,
    "A-": 3.7,
    "B+": 3.3,
    "B": 3.0,
    "B-": 2.7,
    "C+": 2.3,
    "C": 2.0,
    "C-": 1.7,
    "D+": 1.3,
    "D": 1.0,
    "D-": 0.7,
    "F": 0.0
  };

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
          if (classSnap.data().studentIDs?.length) {
            const studentFetches = classSnap.data().studentIDs.map(async (ref) => {
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
              const studentRefIds = classSnap.data().studentIDs.map(ref => ref.id);
              const filteredGrades = gradeSnaps.docs
                .filter(g => studentRefIds.includes(g.data().studentIDs.id))
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
          if (classSnap.data().teacherIDs?.length) {
            const teacherFetches = classSnap.data().teacherIDs.map(async (ref) => {
              const snap2 = await getDoc(ref);
              return { id: ref.id, ...snap2.data() };
            });
            const allTeachers = await Promise.all(teacherFetches);
            setTeacherData(allTeachers);
            console.log("here is da teacher")
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

    function calculateAverageGrade(gradesArray) {
    if (!gradesArray.length) return "N/A";

    const total = gradesArray.reduce((sum, grade) => {
      const gpa = gradeToGPA[grade] ?? 0;
      return sum + gpa;
    }, 0);

    const avgGPA = total / gradesArray.length;

    return avgGPA.toFixed(2); 
  }

  function gpaToLetter(gpa) {
    if (gpa >= 3.85) return "A";
    if (gpa >= 3.7) return "A-";
    if (gpa >= 3.3) return "B+";
    if (gpa >= 3.0) return "B";
    if (gpa >= 2.7) return "B-";
    if (gpa >= 2.3) return "C+";
    if (gpa >= 2.0) return "C";
    if (gpa >= 1.7) return "C-";
    if (gpa >= 1.3) return "D+";
    if (gpa >= 1.0) return "D";
    if (gpa >= 0.7) return "D-";
    return "F";
  }

  const letterGrades = gradesData.map((g) => g.grade);
  const avgGPA = calculateAverageGrade(letterGrades);
  const avgLetter = gpaToLetter(avgGPA);  


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
            <Link to={`/teacherDash/${id}`}>
              <button className="dashboard-button">View Instructor Page</button>
            </Link>
        </div>

        <div className="stats-container">
            <div className="stat-card rcorners">
                <h3>Average Grade</h3>
                <p className="stat-value">{avgLetter}</p>
            </div>
            <div className="stat-card rcorners">
                <h3>
                  Student Enrolled
                </h3>
                <p className="stat-value">{studentData ? `${studentData.length}` : "Loading..."}</p>
            </div>
            <div className="stat-card rcorners">
                <h3>Contact Information</h3>
                {teacherData.length > 0 ? (
                  teacherData.map((teacher) => (
                    <div key={teacher.id}>
                      <p>{teacher.email}</p>
                      <p>{teacher.phone}</p> {/* fallback if phone not stored */}
                    </div>
                  ))
                ) : (
                  <p>Loading...</p>
                )}
            </div>
        </div>

        <div className="roster-container">
            <h2>Student Roster</h2>
            <div className="table-wrapper">
            <table className="roster-table">
              <thead>
                <tr>
                <th className="align-left">Student Name</th>
                <th className="align-center">Student ID</th>
                <th className="align-right">Overall Grade</th>
                </tr>
            </thead>
            </table>
            </div>
            <div className="table-wrapper">
            <table className="roster-table">
            
              {/* currently automating this part */}
                <tbody>
                  {studentData.map((student) => {
                    const gradeEntry = gradesData.find(
                 
                      (g) => g.studentIDs.id === student.id // match student by ID
                    );

                    return (
                      <tr key={student.id}>
                         <td className="align-left">{student.name}</td>
                          <td className="align-center">{student.id}</td>
                          <td className="align-right grade">
                            {gradeEntry ? gradeEntry.grade : "N/A"}
                          </td>
                      </tr>
                    );
                  })}
            </tbody>
            </table>
            </div>
        </div>

      </main>
    </div>
  );
}
