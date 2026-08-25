import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import Dashboard from "./pages/Dashboard.jsx";
import Students from "./pages/Students";
import EditStudent from "./pages/EditStudent";
import AddStudent from "./pages/AddStudent";
import ViewStudent from "./pages/ViewStudent";
import Faculty from "./pages/Faculty.jsx";
import AddFaculty from "./pages/AddFaculty.jsx";
import EditFaculty from "./pages/EditFaculty.jsx";
import ViewFaculty from "./pages/ViewFaculty.jsx";
import Courses from "./pages/Courses.jsx";
import AddCourse from "./pages/AddCourse.jsx";
import ViewCourse from "./pages/ViewCourse.jsx";
import FacultyCourses from "./pages/FacultyCourses.jsx";
import EnrollStudent from "./pages/EnrollStudent.jsx";
import Enrollments from "./pages/Enrollments.jsx";
import Attendance from "./pages/Attendance.jsx";
import AddClass from "./pages/AddClass.jsx";
import Classes from "./pages/Classes.jsx";
import ViewClass from "./pages/ViewClass.jsx";
import FacultyAttendance from "./pages/FacultyAttendance.jsx";
import FacultyClassAttendance from "./pages/FacultyClassAttendance.jsx";
import StudentAttendance from "./pages/StudentAttendance.jsx";

const paths = { students: "/students", addStudent: "/students/add", edit: "/students/edit", viewStudent: "/students/view", faculty: "/faculty", addFaculty: "/faculty/add", editFaculty: "/faculty/edit", viewFaculty: "/faculty/view", facultyCourses: "/faculty/courses", courses: "/courses", addCourse: "/courses/add", classes: "/classes", addClass: "/classes/add", enrollStudent: "/enrollments/add", enrollments: "/enrollments", attendance: "/attendance", facultyAttendance: "/faculty/attendance", facultyClassAttendance: "/faculty/class-attendance", studentAttendance: "/students/attendance" };

function AppContent() {
  const navigate = useNavigate();
  const go = (page) => navigate(paths[page] || "/dashboard");
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [courses, setCourses] = useState([]);
  const [classes, setClasses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (message, type) => setToast({ message, type });
  const updateStudent = (student) => { setStudents((items) => items.map((item) => item.studentId === student.studentId ? student : item)); go("students"); };
  const updateFaculty = (member) => { setFaculty((items) => items.map((item) => item.internalId === member.internalId ? member : item)); go("faculty"); };
  const studentProps = { students, setStudents, setPage: go, setSelectedStudent };

  return <><Navbar title="Student Management System" /><Routes>
    <Route path="/" element={<Dashboard />} /><Route path="/dashboard" element={<Dashboard />} />
    <Route path="/students" element={<Students {...studentProps} />} />
    <Route path="/students/add" element={<AddStudent setStudents={setStudents} setPage={go} />} />
    <Route path="/students/:studentId/edit" element={<EditStudent />} />
    <Route path="/students/view" element={<ViewStudent student={selectedStudent} setPage={go} />} />
    <Route path="/students/:studentId" element={<ViewStudent students={students} setPage={go} />} />
    <Route path="/students/attendance" element={<StudentAttendance student={selectedStudent} />} />
    <Route path="/faculty" element={<Faculty faculty={faculty} setFaculty={setFaculty} setPage={go} setSelectedFaculty={setSelectedFaculty} />} />
    <Route path="/faculty/add" element={<AddFaculty />} />
    <Route path="/faculty/:facultyId/edit" element={<EditFaculty />} />
    <Route path="/faculty/view" element={<ViewFaculty faculty={selectedFaculty} setPage={go} />} />
    <Route path="/faculty/courses" element={<FacultyCourses faculty={selectedFaculty} classes={classes} courses={courses} setPage={go} />} />
    <Route path="/faculty/attendance" element={<FacultyAttendance faculty={selectedFaculty} />} />
    <Route path="/faculty/class-attendance" element={<FacultyClassAttendance faculty={selectedFaculty} />} />
    <Route path="/faculty/:facultyId" element={<ViewFaculty />} />
    <Route path="/courses" element={<Courses courses={courses} setCourses={setCourses} showToast={showToast} />} />
    <Route path="/courses/add" element={<AddCourse showToast={showToast} />} />
    <Route path="/courses/:courseId" element={<ViewCourse />} />
    <Route path="/classes" element={<Classes classes={classes} courses={courses} faculty={faculty} setClasses={setClasses} setCourses={setCourses} setFaculty={setFaculty} showToast={showToast} />} />
    <Route path="/classes/add" element={<AddClass courses={courses} faculty={faculty} students={students} setCourses={setCourses} setFaculty={setFaculty} setStudents={setStudents} showToast={showToast} />} />
    <Route path="/classes/:classId" element={<ViewClass />} />
    <Route path="/enrollments" element={<Enrollments enrollments={enrollments} students={students} classes={classes} courses={courses} setEnrollments={setEnrollments} setPage={go} showToast={showToast} />} />
    <Route path="/enrollments/add" element={<EnrollStudent students={students} classes={classes} courses={courses} faculty={faculty} enrollments={enrollments} setEnrollments={setEnrollments} setPage={go} showToast={showToast} />} />
    <Route path="/attendance" element={<Attendance classes={classes} courses={courses} faculty={faculty} students={students} enrollments={enrollments} attendance={attendance} setAttendance={setAttendance} setPage={go} showToast={showToast} />} />
  </Routes>{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}</>;
}

function App() { return <BrowserRouter><AppContent /></BrowserRouter>; }
export default App;
