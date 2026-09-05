import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

function FacultyClassAttendance({ faculty }) {
  const [searchParams] = useSearchParams();
  const [attendanceData, setAttendanceData] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();
  const classId = searchParams.get("classId");

  useEffect(
    function () {
      async function fetchClassAttendance() {
        if (!faculty || !faculty.facultyId) {
          setErrorMessage(
            "Select a faculty member from the Faculty page first."
          );
          setLoading(false);
          return;
        }

        if (!classId) {
          setErrorMessage(
            "No class was selected."
          );
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/attendance/faculty/${faculty.facultyId}/class/${classId}`,
            {
              credentials: "include"
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message ||
                "Failed to retrieve class attendance."
            );
            return;
          }

          setAttendanceData(data);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchClassAttendance();
    },
    [faculty, classId]
  );

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <button
        type="button"
        onClick={function () {
          navigate("/faculty/attendance");
        }}
        className="mb-6 rounded-lg border border-app-border bg-app-surface px-4 py-2 font-semibold text-app-text transition hover:border-green-300 hover:text-green-700 dark:hover:border-green-800 dark:hover:text-green-400"
      >
        ← Back to My Attendance
      </button>

      {loading ? (
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <p className="text-app-text-muted">
            Loading attendance...
          </p>
        </div>
      ) : errorMessage !== "" ? (
        <div className="rounded-lg border border-red-300 bg-red-100 px-5 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      ) : (
        <>
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
            <h1 className="text-3xl font-bold sm:text-4xl">
              📚{" "}
              {attendanceData.course
                ? attendanceData.course.courseName
                : "Unknown Course"}
            </h1>

            <p className="mt-2 text-green-100">
              {attendanceData.course
                ? attendanceData.course.courseCode
                : "-"}
              {" | "}
              {attendanceData.class.batchId}
              {" | Semester "}
              {attendanceData.class.semester}
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
            <div className="border-b border-app-border bg-app-surface-soft px-6 py-4">
              <h2 className="text-xl font-bold text-app-text">
                Student Attendance
              </h2>

              <p className="mt-1 text-sm text-app-text-muted">
                Attendance totals and history for each
                enrolled student.
              </p>
            </div>

            {attendanceData.students.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
                  📋
                </div>

                <p className="font-semibold text-app-text">
                  No students are enrolled in this
                  class.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-app-border text-app-text">
                      <th className="px-4 py-3 text-left">
                        Student
                      </th>

                      <th className="px-4 py-3 text-left">
                        Roll Number
                      </th>

                      <th className="px-4 py-3 text-left">
                        Present
                      </th>

                      <th className="px-4 py-3 text-left">
                        Absent
                      </th>

                      <th className="px-4 py-3 text-left">
                        Attendance
                      </th>

                      <th className="px-4 py-3 text-left">
                        Attendance History
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendanceData.students.map(
                      function (item) {
                        const studentKey = item.student
                          ? item.student._id
                          : item.attendance[0]?._id;

                        return (
                          <tr
                            key={studentKey}
                            className="border-t border-app-border transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                          >
                            <td className="px-4 py-4 font-medium text-app-text">
                              {item.student
                                ? item.student
                                    .firstName +
                                  " " +
                                  item.student.lastName
                                : "Unknown Student"}
                            </td>

                            <td className="px-4 py-4 text-app-text-muted">
                              {item.student
                                ? item.student
                                    .rollNumber
                                : "-"}
                            </td>

                            <td className="px-4 py-4 font-semibold text-green-600 dark:text-green-400">
                              {item.presentCount}
                            </td>

                            <td className="px-4 py-4 font-semibold text-red-600 dark:text-red-400">
                              {item.absentCount}
                            </td>

                            <td className="px-4 py-4">
                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 font-semibold text-green-700 dark:bg-green-950/60 dark:text-green-300">
                                {
                                  item.attendancePercentage
                                }
                                %
                              </span>
                            </td>

                            <td className="px-4 py-4 text-sm text-app-text-muted">
                              {item.attendance.length ===
                              0 ? (
                                "No attendance records"
                              ) : (
                                <ul className="space-y-2">
                                  {item.attendance.map(
                                    function (record) {
                                      return (
                                        <li
                                          key={
                                            record._id
                                          }
                                          className="flex items-center justify-between gap-4 rounded-lg bg-app-surface-soft px-3 py-2"
                                        >
                                          <span>
                                            {new Date(
                                              record.date
                                            ).toLocaleDateString()}
                                          </span>

                                          <span
                                            className={
                                              "font-semibold capitalize " +
                                              (record.status ===
                                              "present"
                                                ? "text-green-600 dark:text-green-400"
                                                : "text-red-600 dark:text-red-400")
                                            }
                                          >
                                            {
                                              record.status
                                            }
                                          </span>
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}

export default FacultyClassAttendance;