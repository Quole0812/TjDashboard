import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export default fetchStudents;

export const addStudent = async ({ studentName, studentId, studentGrade }) => {
    return await addDoc(collection(db, "students"), {
        name: studentName,
        id: studentId,
        grade: studentGrade
    });
};

export const addTeacher = async ({ teacherName, teacherId, teacherGrade }) => {
    return await addDoc(collection(db, "teachers"), {
        name: teacherName,
        id: teacherId,
        grade: teacherGrade
    });
};

export const editStudent = async (id, { studentName, studentId, studentGrade }) => {
    const optionRef = doc(db, "students", id);
    return await updateDoc(optionRef, {
        name: studentName,
        id: studentId,
        grade: studentGrade
    });
};
