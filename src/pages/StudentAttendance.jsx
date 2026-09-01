import { useEffect, useState } from "react";

function StudentAttendance({ student }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    async function fetchStudentAttendance() {
      if (!student || !student.studentId) {
        setErrorMessage("Select a student from the Students page first.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/attendance/student/${student.studentId}`
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

    fetchStudentAttendance();
  }, [student]);

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">📊 My Attendance</h1>

        <p className="mt-2 text-green-100">
          Track your attendance across enrolled courses.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
          Loading attendance...
        </div>
      ) : errorMessage !== "" ? (
        <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">
          {errorMessage}
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
          You are not enrolled in any classes yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map(function (item) {
            return (
              <div
                key={item.class._id}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h2 className="text-xl font-bold">
                  {item.course ? item.course.courseName : "Unknown Course"}
                </h2>

                <p className="text-gray-500 mt-1">
                  {item.course ? item.course.courseCode : "-"}
                </p>

                <div className="flex gap-3 mt-3">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {item.class.batchId}
                  </span>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    Semester {item.class.semester}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">Attendance</span>
                    <span className="font-bold">
                      {item.attendancePercentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={
                        item.attendancePercentage < 75
                          ? "bg-red-500 h-4 rounded-full"
                          : "bg-green-600 h-4 rounded-full"
                      }
                      style={{ width: item.attendancePercentage + "%" }}
                    />
                  </div>
                </div>

                <div className="flex justify-between mt-4 text-sm text-gray-600">
                  <span>
                    Present: {" "}
                    <strong className="text-green-600">
                      {item.presentCount}
                    </strong>
                  </span>

                  <span>
                    Absent: {" "}
                    <strong className="text-red-600">
                      {item.absentCount}
                    </strong>
                  </span>
                </div>

                <div className="mt-5 border-t pt-4">
                  <h3 className="font-semibold mb-2">Attendance History</h3>

                  {item.attendance.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No attendance records found.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {item.attendance.map(function (record) {
                        return (
                          <li
                            key={record._id}
                            className="flex justify-between text-gray-600"
                          >
                            <span>
                              {new Date(record.date).toLocaleDateString()}
                            </span>

                            <span
                              className={
                                record.status === "present"
                                  ? "text-green-600 font-medium"
                                  : "text-red-600 font-medium"
                              }
                            >
                              {record.status}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default StudentAttendance;
