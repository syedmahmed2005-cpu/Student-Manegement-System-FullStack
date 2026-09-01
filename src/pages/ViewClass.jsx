import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ViewClass() {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classItem, setClassItem] = useState(null);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    async function fetchClassData() {
      try {
        const responses = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/classes/${classId}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/courses`),
          fetch(`${import.meta.env.VITE_API_URL}/api/faculty`),
        ]);
        const data = await Promise.all(responses.map(function (response) { return response.json(); }));
        if (!responses[0].ok) {
          setErrorMessage(data[0].message || "Class not found.");
          return;
        }
        if (!responses[1].ok || !responses[2].ok) {
          setErrorMessage("Failed to retrieve class details.");
          return;
        }
        setClassItem(data[0].class);
        setCourses(data[1].courses);
        setFaculty(data[2].faculty);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }
    fetchClassData();
  }, [classId]);

  if (loading) return <div className="p-6"><div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto text-center">Loading class...</div></div>;
  if (!classItem) return <div className="p-6"><div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto text-center"><h1 className="text-2xl font-bold">Class not found</h1><p className="text-gray-500 mt-2">{errorMessage}</p><button type="button" onClick={function () { navigate("/classes"); }} className="mt-6 px-4 py-2 rounded-lg border border-gray-300">Back</button></div></div>;

  const course = courses.find(function (item) { return item.courseCode === classItem.courseId; });
  const facultyMember = faculty.find(function (item) { return item.facultyId === classItem.facultyId; });

  return <div className="p-6"><div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto"><div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Class Details</h1><button type="button" onClick={function () { navigate("/classes"); }} className="px-4 py-2 rounded-lg border border-gray-300">Back</button></div><div className="grid grid-cols-2 gap-4"><div><p className="text-gray-500">Class ID</p><p className="font-semibold">{classItem._id}</p></div><div><p className="text-gray-500">Course</p><p className="font-semibold">{course ? course.courseCode + " - " + course.courseName : "Unknown Course"}</p></div><div><p className="text-gray-500">Faculty</p><p className="font-semibold">{facultyMember ? facultyMember.firstName + " " + facultyMember.lastName : "Unknown Faculty"}</p></div><div><p className="text-gray-500">Batch</p><p className="font-semibold">{classItem.batchId}</p></div><div><p className="text-gray-500">Semester</p><p className="font-semibold">{classItem.semester}</p></div></div></div></div>;
}

export default ViewClass;
