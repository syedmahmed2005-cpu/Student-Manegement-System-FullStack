import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Courses({ courses, setCourses, showToast }) {
  const [searchText, setSearchText] = useState("");
  const [deleteCourse, setDeleteCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    async function fetchCourses() {
      try {
        const response = await fetch("http://localhost:5000/api/courses");
        const data = await response.json();
        if (!response.ok) {
          setErrorMessage(data.message || "Failed to retrieve courses.");
          return;
        }
        setCourses(data.courses);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [setCourses]);

  async function handleDelete() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/courses/" + deleteCourse._id,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.message || "Failed to delete course.");
        return;
      }

      setCourses(courses.filter(function (course) {
        return course._id !== deleteCourse._id;
      }));
      setDeleteCourse(null);
      showToast("Course deleted successfully.", "success");
    } catch (error) {
      console.log(error);
      setErrorMessage("Unable to connect to the server.");
    }
  }

  const filteredCourses = courses.filter(function (course) {
    return (
      course.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
      course.courseCode.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">📚 Courses</h1>
        <p className="mt-2 text-green-100">Manage all courses in the system.</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <input type="text" placeholder="Search courses..." value={searchText} onChange={function (event) { setSearchText(event.target.value); }} className="border rounded-lg px-4 py-2 w-80" />
        <button onClick={function () { navigate("/courses/add"); }} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">+ Add Course</button>
      </div>

      {errorMessage !== "" && <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">{errorMessage}</div>}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {loading ? <div className="p-8 text-center text-gray-500">Loading courses...</div> : filteredCourses.length === 0 ? <div className="p-8 text-center text-gray-500">No courses found.</div> : <table className="w-full"><thead className="bg-gray-100"><tr><th className="px-4 py-3 text-left">Course Code</th><th className="px-4 py-3 text-left">Course Name</th><th className="px-4 py-3 text-left">Credit Hours</th><th className="px-4 py-3 text-left">Department</th><th className="px-4 py-3 text-left">Actions</th></tr></thead><tbody>{filteredCourses.map(function (course) { return <tr key={course._id} className="border-t hover:bg-gray-50"><td className="px-4 py-3">{course.courseCode}</td><td className="px-4 py-3 font-medium">{course.courseName}</td><td className="px-4 py-3">{course.creditHours}</td><td className="px-4 py-3">{course.department}</td><td className="px-4 py-3"><button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={function () { navigate("/courses/" + course._id); }}>View</button><button className="bg-red-500 text-white px-3 py-1 rounded ml-2" onClick={function () { setDeleteCourse(course); }}>Delete</button></td></tr>; })}</tbody></table>}
      </div>

      {deleteCourse !== null && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl shadow-xl w-[400px] p-6"><h2 className="text-xl font-bold mb-3">Delete Course</h2><p className="text-gray-600 mb-6">Are you sure you want to delete this course?</p><div className="flex justify-end gap-3"><button className="px-4 py-2 rounded-lg border border-gray-300" onClick={function () { setDeleteCourse(null); }}>Cancel</button><button className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={handleDelete}>Delete</button></div></div></div>}
    </main>
  );
}

export default Courses;
