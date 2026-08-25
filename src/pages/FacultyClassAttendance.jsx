import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function FacultyClassAttendance({ faculty }) {
  const [searchParams] = useSearchParams();
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const classId = searchParams.get("classId");

  useEffect(function () {
    async function fetchClassAttendance() {
      if (!faculty || !faculty.facultyId) {
        setErrorMessage("Select a faculty member from the Faculty page first.");
        setLoading(false);
        return;
      }

      if (!classId) {
        setErrorMessage("No class was selected.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5000/api/attendance/faculty/" +
            faculty.facultyId +
            "/class/" +
            classId
        );
        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(
            data.message || "Failed to retrieve class attendance."
          );
          return;
        }

        setAttendanceData(data);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchClassAttendance();
  }, [faculty, classId]);

  return (
    <main className="p-5">
      <button
        type="button"
        onClick={function () {
          navigate("/faculty/attendance");
        }}
        className="mb-6 px-4 py-2 border rounded-lg"
      >
        ← Back to My Attendance
      </button>

      {loading ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
          Loading attendance...
        </div>
      ) : errorMessage !== "" ? (
        <div className="bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
            <h1 className="text-4xl font-bold">
              📚 {attendanceData.course
                ? attendanceData.course.courseName
                : "Unknown Course"}
            </h1>

            <p className="mt-2 text-green-100">
              {attendanceData.course ? attendanceData.course.courseCode : "-"}
              {" | "}
              {attendanceData.class.batchId}
              {" | Semester "}
              {attendanceData.class.semester}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-100">
              <h2 className="text-xl font-bold">Student Attendance</h2>
            </div>

            {attendanceData.students.length === 0 ? (
              <p className="p-6 text-gray-500">
                No students are enrolled in this class.
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Roll Number</th>
                    <th className="px-4 py-3 text-left">Present</th>
                    <th className="px-4 py-3 text-left">Absent</th>
                    <th className="px-4 py-3 text-left">Attendance</th>
                    <th className="px-4 py-3 text-left">
                      Attendance History
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {attendanceData.students.map(function (item) {
                    const studentKey = item.student
                      ? item.student._id
                      : item.attendance[0]?._id;

                    return (
                      <tr
                        key={studentKey}
                        className="border-t hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 font-medium">
                          {item.student
                            ? item.student.firstName + " " + item.student.lastName
                            : "Unknown Student"}
                        </td>

                        <td className="px-4 py-3">
                          {item.student ? item.student.rollNumber : "-"}
                        </td>

                        <td className="px-4 py-3 text-green-600 font-semibold">
                          {item.presentCount}
                        </td>

                        <td className="px-4 py-3 text-red-600 font-semibold">
                          {item.absentCount}
                        </td>

                        <td className="px-4 py-3 font-semibold">
                          {item.attendancePercentage}%
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-600">
                          {item.attendance.length === 0 ? (
                            "No attendance records"
                          ) : (
                            <ul className="space-y-1">
                              {item.attendance.map(function (record) {
                                return (
                                  <li key={record._id}>
                                    {new Date(record.date).toLocaleDateString()}
                                    {" — "}
                                    <span
                                      className={
                                        record.status === "present"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }
                                    >
                                      {record.status}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default FacultyClassAttendance;
