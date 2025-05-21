import { collection, getDocs, addDoc, updateDoc, doc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase.js";

const fetchStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
export default fetchStudents;

export const fetchTeachers = async () => {
    const snapshot = await getDocs(collection(db, "teachers"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const addStudent = async ({ name, id, grade }) => {
    if (!name || !id || !grade) throw new Error('Missing student fields');
    try {
        const docRef = await addDoc(collection(db, "students"), {
            name,
            id,
            grade
        });
        return docRef;
    } catch (e) {
        throw new Error('Failed to add student: ' + e.message);
    }
};

export const addTeacher = async ({ name, email, phone }) => {
    if (!name || !email || !phone) throw new Error('Missing teacher fields');
    try {
        const docRef = await addDoc(collection(db, "teachers"), {
            name,
            email,
            phone
        });
        return docRef;
    } catch (e) {
        throw new Error('Failed to add teacher: ' + e.message);
    }
};

export const updateClassTeachers = async (classId, teacherId) => {
    const classRef = doc(db, "Classes", classId);
    return await updateDoc(classRef, {
        teacherIDs: arrayUnion(teacherId)
    });
};

export const updateClassStudents = async (classId, studentId) => {
    const classRef = doc(db, "Classes", classId);
    return await updateDoc(classRef, {
        studentIDs: arrayUnion(studentId)
    });
};

export const editStudent = async (id, { name, grade }) => {
    const optionRef = doc(db, "students", id);
    return await updateDoc(optionRef, {
        name,
        grade
    });
};
