import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Enrollments({ showToast }) {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    async function fetchEnrollmentData() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:5000/api/enrollments"),
          fetch("http://localhost:5000/api/students"),
          fetch("http://localhost:5000/api/classes"),
          fetch("http://localhost:5000/api/courses"),
        ]);
        const data = await Promise.all(responses.map(function (response) { return response.json(); }));
        if (!responses[0].ok || !responses[1].ok || !responses[2].ok || !responses[3].ok) {
          setErrorMessage("Failed to retrieve enrollment data.");
          return;
        }
        setEnrollments(data[0].enrollments);
        setStudents(data[1].students);
        setClasses(data[2].classes);
        setCourses(data[3].courses);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }
    fetchEnrollmentData();
  }, []);

  async function removeEnrollment(enrollment) {
    try {
      const response = await fetch("/api/enrollments/" + enrollment._id, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) { showToast(data.message || "Failed to remove enrollment.", "error"); return; }
      setEnrollments(enrollments.filter(function (item) { return item._id !== enrollment._id; }));
      showToast("Enrollment removed successfully.", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to the server.", "error");
    }
  }

  function getStudent(studentId) { return students.find(function (student) { return (student.studentId || student._id) === studentId; }); }
  function getClass(classId) { return classes.find(function (classItem) { return classItem._id === classId; }); }
  function getCourse(courseId) { return courses.find(function (course) { return course.courseCode === courseId; }); }

  return <main className="p-5"><div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8"><h1 className="text-4xl font-bold">🎓 Enrollments</h1><p className="mt-2 text-green-100">View all student course enrollments.</p></div><div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Enrollment Records</h2><button type="button" onClick={function () { navigate("/enrollments/add"); }} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">+ Enroll Student</button></div>{errorMessage !== "" && <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">{errorMessage}</div>}<div className="bg-white rounded-xl shadow-lg overflow-hidden">{loading ? <p className="p-6 text-gray-500">Loading enrollments...</p> : enrollments.length === 0 ? <p className="p-6 text-gray-500">No enrollment records found.</p> : <table className="w-full"><thead className="bg-gray-100"><tr><th className="px-4 py-3 text-left">Student</th><th className="px-4 py-3 text-left">Roll Number</th><th className="px-4 py-3 text-left">Course Name</th><th className="px-4 py-3 text-left">Course Code</th><th className="px-4 py-3 text-left">Actions</th></tr></thead><tbody>{enrollments.map(function (enrollment) { const student = getStudent(enrollment.studentId); const classItem = getClass(enrollment.classId); const course = classItem ? getCourse(classItem.courseId) : null; return <tr key={enrollment._id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-medium">{student ? student.firstName + " " + student.lastName : "Unknown Student"}</td><td className="px-4 py-3">{student ? student.rollNumber : "-"}</td><td className="px-4 py-3 font-medium">{course ? course.courseName : "Unknown Course"}</td><td className="px-4 py-3">{course ? course.courseCode : "-"}</td><td className="px-4 py-3"><button type="button" className="bg-red-500 text-white px-3 py-1 rounded" onClick={function () { removeEnrollment(enrollment); }}>Remove</button></td></tr>; })}</tbody></table>}</div></main>;
}

export default Enrollments;
