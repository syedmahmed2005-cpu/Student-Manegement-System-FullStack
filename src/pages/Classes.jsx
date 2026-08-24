import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Classes({ classes, courses, faculty, setClasses, setCourses, setFaculty, showToast }) {
  const [deleteClass, setDeleteClass] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    async function fetchClassData() {
      try {
        const responses = await Promise.all([
          fetch("http://localhost:5000/api/classes"),
          fetch("http://localhost:5000/api/courses"),
          fetch("http://localhost:5000/api/faculty"),
        ]);
        const data = await Promise.all(responses.map(function (response) { return response.json(); }));
        if (!responses[0].ok || !responses[1].ok || !responses[2].ok) {
          setErrorMessage("Failed to retrieve class data.");
          return;
        }
        setClasses(data[0].classes);
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
  }, [setClasses, setCourses, setFaculty]);

  async function handleDelete() {
    try {
      const response = await fetch("http://localhost:5000/api/classes/" + deleteClass._id, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        showToast(data.message || "Failed to delete class.", "error");
        return;
      }
      setClasses(classes.filter(function (classItem) { return classItem._id !== deleteClass._id; }));
      setDeleteClass(null);
      showToast("Class deleted successfully.", "success");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to the server.", "error");
    }
  }

  return <main className="p-5">
    <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8"><h1 className="text-4xl font-bold">🏫 Classes</h1><p className="mt-2 text-green-100">Manage course offerings for different batches and faculty members.</p></div>
    <div className="flex justify-end mb-6"><button type="button" onClick={function () { navigate("/classes/add"); }} className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700">+ Add Class</button></div>
    {errorMessage !== "" && <div className="mb-5 bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">{errorMessage}</div>}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">{loading ? <p className="p-6 text-gray-500 text-center">Loading classes...</p> : <><table className="w-full"><thead className="bg-gray-100"><tr><th className="px-4 py-3 text-left">Class ID</th><th className="px-4 py-3 text-left">Course</th><th className="px-4 py-3 text-left">Faculty</th><th className="px-4 py-3 text-left">Batch</th><th className="px-4 py-3 text-left">Semester</th><th className="px-4 py-3 text-left">Actions</th></tr></thead><tbody>{classes.map(function (classItem) {
      const selectedCourse = courses.find(function (course) { return course.courseCode === classItem.courseId; });
      const selectedFaculty = faculty.find(function (member) { return member.facultyId === classItem.facultyId; });
      return <tr key={classItem._id} className="border-t hover:bg-gray-50"><td className="px-4 py-3 font-medium">{classItem._id}</td><td className="px-4 py-3">{selectedCourse ? selectedCourse.courseCode + " - " + selectedCourse.courseName : "Unknown Course"}</td><td className="px-4 py-3">{selectedFaculty ? selectedFaculty.firstName + " " + selectedFaculty.lastName : "Unknown Faculty"}</td><td className="px-4 py-3">{classItem.batchId}</td><td className="px-4 py-3">{classItem.semester}</td><td className="px-4 py-3"><div className="flex gap-2"><button type="button" className="bg-blue-500 text-white px-3 py-1 rounded" onClick={function () { navigate("/classes/" + classItem._id); }}>View</button><button type="button" className="bg-red-500 text-white px-3 py-1 rounded" onClick={function () { setDeleteClass(classItem); }}>Delete</button></div></td></tr>;
    })}</tbody></table>{classes.length === 0 && <p className="p-6 text-gray-500 text-center">No classes have been created yet.</p>}</>}</div>
    {deleteClass !== null && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl shadow-xl w-[400px] p-6"><h2 className="text-xl font-bold mb-3">Delete Class</h2><p className="text-gray-600 mb-6">Are you sure you want to delete this class?</p><div className="flex justify-end gap-3"><button type="button" className="px-4 py-2 rounded-lg border border-gray-300" onClick={function () { setDeleteClass(null); }}>Cancel</button><button type="button" className="px-4 py-2 rounded-lg bg-red-600 text-white" onClick={handleDelete}>Delete</button></div></div></div>}
  </main>;
}

export default Classes;
