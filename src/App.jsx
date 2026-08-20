import {BrowserRouter,Routes,Route} from "react-router-dom";
import { useEffect,useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard.jsx";
import Toast from "./components/Toast";
import Students from "./pages/Students";
import EditStudent from "./pages/EditStudent";
import AddStudent from "./pages/AddStudent"; 
import ViewStudent from "./pages/ViewStudent";
import { getStudents, saveStudents, getFaculty, saveFaculty } from "./utils/storage.js";
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
import FacultyAttendance from "./pages/FacultyAttendance.jsx";
import FacultyClassAttendance from "./pages/FacultyClassAttendance.jsx";
import StudentAttendance from "./pages/StudentAttendance.jsx";

function App() {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
const [enrollments, setEnrollments] = useState(function () {
  const savedEnrollments = localStorage.getItem("enrollments");

  if (savedEnrollments) {
    return JSON.parse(savedEnrollments);
  }

  return [];
});
const [attendance, setAttendance] = useState(function () {
  const savedAttendance = localStorage.getItem("attendance");

  if (savedAttendance) {
    return JSON.parse(savedAttendance);
  }

  return [];
});
  const [toast, setToast] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classes, setClasses] = useState(function () {
  const savedClasses = localStorage.getItem("classes");

  if (savedClasses) {
    return JSON.parse(savedClasses);
  }

  return [];
});
  const [selectedClass, setSelectedClass] = useState(null);
  const [students, setStudents] = useState(function () {
  const savedStudents = getStudents();

  if (savedStudents.length > 0) {
    return savedStudents;
  }

  return [
    {
      studentId: "STU-001",
      firstName: "Ahmed",
      lastName: "Shahid",
      batchId:"FA24-BCS",
      email: "ahmed@example.com",
      phoneNumber: "03001234567",
      rollNumber: "CS-101",
      registrationNumber: "REG-001",
      gender: "Male",
      dob: "2005-01-01",
      department: "Computer Science",
      city: "Lahore",
      country: "Pakistan",
      address: "Lahore",
      status: "active",
    },
    {
      studentId: "STU-002",
      firstName: "Ali",
      lastName: "Khan",
      batchId: "FA24-BCS",
      email: "ali@example.com",
      phoneNumber: "03001234568",
      rollNumber: "CS-102",
      registrationNumber: "REG-002",
      gender: "Male",
      dob: "2004-05-10",
      department: "Computer Science",
      city: "Islamabad",
      country: "Pakistan",
      address: "Islamabad",
      status: "active",
    },
  ];
});

useEffect(function () {
  localStorage.setItem("classes", JSON.stringify(classes));
}, [classes]);


useEffect(function () {
  saveStudents(students);
}, [students]);
const [page,setPage]=useState("students");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [faculty, setFaculty] = useState(function () {
  const savedFaculty = getFaculty();

  if (savedFaculty.length > 0) {
    return savedFaculty;
  }

  return [
    {
      facultyId: "FAC-001",
      firstName: "Usman",
      lastName: "Ahmed",
      email: "usman@example.com",
      phoneNumber: "03001234567",
      department: "Computer Science",
      designation: "Assistant Professor",
      qualification: "MS Computer Science",
      joiningDate: "2023-01-15",
      city: "Lahore",
      country: "Pakistan",
      address: "Lahore",
      status: "active",
    },
  ];
});
const [courses, setCourses] = useState(function () {
  const savedCourses = localStorage.getItem("courses");

  if (savedCourses) {
    return JSON.parse(savedCourses);
  }

  return [];
});
useEffect(function () {
  localStorage.setItem("courses", JSON.stringify(courses));
}, [courses]);
useEffect(function () {
  saveFaculty(faculty);
}, [faculty]);
function updateFaculty(updatedFaculty) {
  setFaculty(function (currentFaculty) {
    return currentFaculty.map(function (member) {
      if (member.internalId === updatedFaculty.internalId) {
        return updatedFaculty;
      }

      return member;
    });
  });

  setPage("faculty");
}
function showToast(message, type) {
  setToast({
    message: message,
    type: type,
  });
}

useEffect(function () {
  localStorage.setItem(
    "enrollments",
    JSON.stringify(enrollments)
  );
}, [enrollments]);
useEffect(function () {
  localStorage.setItem(
    "attendance",
    JSON.stringify(attendance)
  );
}, [attendance]);
  function updateStudent(updatedStudent) {
  setStudents(function (currentStudents) {
    return currentStudents.map(function (student) {
      if (student.studentId === updatedStudent.studentId) {
        return updatedStudent;
      }

      return student;
    });
  });

  setPage("students");
}

  return (
    
    <BrowserRouter>
           
    <Navbar title="Student Management System" />
    <Routes>
    <Route
    path="/students"
    element={<Students
      students={students}
      setStudents={setStudents}
      setPage={setPage}
      setSelectedStudent={setSelectedStudent}
    />}
  />

  <Route
    path="/faculty"
    element={<Faculty
      faculty={faculty}
      setFaculty={setFaculty}
      setPage={setPage}
      setSelectedFaculty={setSelectedFaculty}
    />}
  />

  <Route
    path="/courses"
    element={<Courses
      courses={courses}
      setPage={setPage}
      setSelectedCourse={setSelectedCourse}
      setCourses={setCourses}
      showToast={showToast}
    />}
  />
  {/* Dynamic Route */}
      <Route
  path="/students/:studentId"
  element={
    <ViewStudent
      students={students}
      setPage={setPage}
    />
  }
/>
<Route
  path="/"
  element={<Dashboard />}
/>

<Route
  path="/dashboard"
  element={<Dashboard />}
/>
</Routes>

  
    <div>
      {page === "edit" && (
        <EditStudent
          student={selectedStudent}
          updateStudent={updateStudent}
        />
      )}
      {page === "addStudent" && (
        <AddStudent setPage={setPage} />)}
      {page === "viewStudent" && (
        <ViewStudent
          student={selectedStudent}
          setPage={setPage}
        />
      )}
      {page === "addFaculty" && (
  <AddFaculty
    setPage={setPage}
    setFaculty={setFaculty}
  />
)}
{page === "editFaculty" && (
  <EditFaculty
    faculty={selectedFaculty}
    updateFaculty={updateFaculty}
  />
)}
{page === "viewFaculty" && (
  <ViewFaculty
    faculty={selectedFaculty}
    setPage={setPage}
  />
)}
{page === "classes" && (
  <Classes
    classes={classes}
    courses={courses}
    faculty={faculty}
    setPage={setPage}
    setSelectedClass={setSelectedClass}
    setClasses={setClasses}
    showToast={showToast}
  />
)}
{page === "addCourse" && (
  <AddCourse
    setCourses={setCourses}
    setPage={setPage}
    showToast={showToast}
  />
)}
{page === "addClass" && (
  <AddClass
    courses={courses}
    faculty={faculty}
    students={students}
    setClasses={setClasses}
    setPage={setPage}
    showToast={showToast}
  />
)}
{page === "viewCourse" && (
  <ViewCourse
    course={selectedCourse}
    setPage={setPage}
  />
)}
{page === "facultyCourses" && (
  <FacultyCourses
    faculty={selectedFaculty}
    classes={classes}
    courses={courses}
    setPage={setPage}
  />
)}
{page === "enrollStudent" && (
  <EnrollStudent
    students={students}
    classes={classes}
    courses={courses}
    faculty={faculty}
    enrollments={enrollments}
    setEnrollments={setEnrollments}
    setPage={setPage}
    showToast={showToast}
  />
)}
{page === "enrollments" && (
  <Enrollments
    enrollments={enrollments}
    students={students}
    classes={classes}
    courses={courses}
    setPage={setPage}
    setEnrollments={setEnrollments}
    showToast={showToast}
  />
)}
{page === "attendance" && (
  <Attendance
    classes={classes}
    courses={courses}
    faculty={faculty}
    students={students}
    enrollments={enrollments}
    attendance={attendance}
    setAttendance={setAttendance}
    setPage={setPage}
    showToast={showToast}
  />
)}
{page === "facultyAttendance" && (
  <FacultyAttendance
    faculty={selectedFaculty}
    classes={classes}
    courses={courses}
    attendance={attendance}
    setSelectedClass={setSelectedClass}
    setPage={setPage}
  />
)}

{page === "facultyClassAttendance" && (
  <FacultyClassAttendance
    selectedClass={selectedClass}
    courses={courses}
    students={students}
    enrollments={enrollments}
    attendance={attendance}
    setPage={setPage}
  />
)}

{page === "studentAttendance" && (
  <StudentAttendance
    student={selectedStudent}
    classes={classes}
    courses={courses}
    enrollments={enrollments}
    attendance={attendance}
  />
)}

{toast && (
  <Toast
    message={toast.message}
    type={toast.type}
    onClose={function () {
      setToast(null);
    }}
  />
)}
    </div>
    </BrowserRouter>
  );
}
export default App;