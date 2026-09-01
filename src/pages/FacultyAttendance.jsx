import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FacultyAttendance({ faculty }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    async function fetchFacultyAttendance() {
      if (!faculty || !faculty.facultyId) {
        setErrorMessage("Select a faculty member from the Faculty page first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/attendance/faculty/${faculty.facultyId}`
        );
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Failed to retrieve attendance.");
          return;
        }

        setClasses(data.classes);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyAttendance();
  }, [faculty]);

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">📊 My Attendance</h1>
        <p className="mt-2 text-green-100">View attendance for your assigned classes.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">Loading attendance...</div>
      ) : errorMessage !== "" ? (
        <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">{errorMessage}</div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">You currently have no assigned classes.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {classes.map(function (item) {
            const classItem = item.class;
            const course = item.course;

            return (
              <div key={classItem._id} className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold">{course ? course.courseName : "Unknown Course"}</h2>
                <p className="text-gray-500 mt-1">{course ? course.courseCode : "-"}</p>
                <div className="flex gap-3 mt-3 text-sm">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">{classItem.batchId}</span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Semester {classItem.semester}</span>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Overall Attendance</span>
                    <span className="font-bold">{item.attendancePercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full" style={{ width: item.attendancePercentage + "%" }} />
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600">
                  Students: {item.enrolledStudents} · Present: {item.presentCount} · Absent: {item.absentCount}
                </p>
                <button
                  type="button"
                  onClick={function () {
                    navigate("/faculty/class-attendance?classId=" + classItem._id);
                  }}
                  className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  View Details
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default FacultyAttendance;
