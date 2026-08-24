import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    async function fetchCourse() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/courses/" + courseId
        );
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.message || "Course not found.");
          return;
        }
        setCourse(data.course);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return <div className="p-6"><div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto text-center">Loading course...</div></div>;
  }

  if (!course) {
    return <div className="p-6"><div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto text-center"><h1 className="text-2xl font-bold">Course not found</h1><p className="text-gray-500 mt-2">{errorMessage}</p><button type="button" onClick={function () { navigate("/courses"); }} className="mt-6 px-4 py-2 rounded-lg border border-gray-300">Back</button></div></div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Course Details</h1>
          <button type="button" onClick={function () { navigate("/courses"); }} className="px-4 py-2 rounded-lg border border-gray-300">Back</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-gray-500">Course Code</p><p className="font-semibold">{course.courseCode}</p></div>
          <div><p className="text-gray-500">Course Name</p><p className="font-semibold">{course.courseName}</p></div>
          <div><p className="text-gray-500">Credit Hours</p><p className="font-semibold">{course.creditHours}</p></div>
          <div><p className="text-gray-500">Department</p><p className="font-semibold">{course.department}</p></div>
          <div><p className="text-gray-500">Semester</p><p className="font-semibold">{course.semester || "Not provided"}</p></div>
          <div><p className="text-gray-500">Assigned Faculty</p><p className="font-semibold">{course.facultyName || "Not provided"}</p></div>
          <div><p className="text-gray-500">Course ID</p><p className="font-semibold">{course._id}</p></div>
        </div>
      </div>
    </div>
  );
}

export default ViewCourse;
