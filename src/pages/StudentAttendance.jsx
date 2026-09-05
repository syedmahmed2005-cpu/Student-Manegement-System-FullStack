import { useEffect, useState } from "react";

function StudentAttendance({ student }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(
    function () {
      async function fetchStudentAttendance() {
        if (!student || !student.studentId) {
          setErrorMessage(
            "Select a student from the Students page first."
          );
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/attendance/student/${student.studentId}`,
            {
              credentials: "include"
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message ||
                "Failed to retrieve attendance."
            );
            return;
          }

          setClasses(data.classes);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchStudentAttendance();
    },
    [student]
  );

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          📊 My Attendance
        </h1>

        <p className="mt-2 text-green-100">
          Track your attendance across enrolled
          courses.
        </p>
      </div>

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
      ) : classes.length === 0 ? (
        <div className="rounded-xl border border-app-border bg-app-surface p-10 text-center shadow-lg">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
            📚
          </div>

          <p className="font-semibold text-app-text">
            You are not enrolled in any classes yet.
          </p>

          <p className="mt-1 text-sm text-app-text-muted">
            Your course attendance will appear here
            after enrollment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {classes.map(function (item) {
            const attendancePercentage = Math.min(
              100,
              Math.max(
                0,
                Number(item.attendancePercentage) || 0
              )
            );

            const isLowAttendance =
              attendancePercentage < 75;

            return (
              <article
                key={item.class._id}
                className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-xl dark:hover:border-green-800"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-50 text-2xl dark:bg-green-950/50">
                    📚
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-app-text">
                      {item.course
                        ? item.course.courseName
                        : "Unknown Course"}
                    </h2>

                    <p className="mt-1 text-app-text-muted">
                      {item.course
                        ? item.course.courseCode
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                    Batch {item.class.batchId}
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    Semester {item.class.semester}
                  </span>
                </div>

                <div className="mt-6 rounded-xl bg-app-surface-soft p-4">
                  <div className="mb-2 flex justify-between gap-4">
                    <span className="font-semibold text-app-text">
                      Attendance
                    </span>

                    <span
                      className={
                        "font-bold " +
                        (isLowAttendance
                          ? "text-red-600 dark:text-red-400"
                          : "text-green-700 dark:text-green-400")
                      }
                    >
                      {attendancePercentage}%
                    </span>
                  </div>

                  <div
                    role="progressbar"
                    aria-label="Course attendance"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={
                      attendancePercentage
                    }
                    className="h-4 w-full overflow-hidden rounded-full bg-app-border"
                  >
                    <div
                      className={
                        "h-4 rounded-full transition-all duration-300 " +
                        (isLowAttendance
                          ? "bg-red-500"
                          : "bg-green-600")
                      }
                      style={{
                        width:
                          attendancePercentage + "%"
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/40">
                    <p className="font-bold text-green-700 dark:text-green-300">
                      {item.presentCount}
                    </p>

                    <p className="text-xs text-green-600 dark:text-green-400">
                      Present
                    </p>
                  </div>

                  <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/40">
                    <p className="font-bold text-red-700 dark:text-red-300">
                      {item.absentCount}
                    </p>

                    <p className="text-xs text-red-600 dark:text-red-400">
                      Absent
                    </p>
                  </div>
                </div>

                <div className="mt-5 border-t border-app-border pt-4">
                  <h3 className="mb-3 font-semibold text-app-text">
                    Attendance History
                  </h3>

                  {item.attendance.length === 0 ? (
                    <p className="text-sm text-app-text-muted">
                      No attendance records found.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {item.attendance.map(function (
                        record
                      ) {
                        return (
                          <li
                            key={record._id}
                            className="flex items-center justify-between gap-4 rounded-lg bg-app-surface-soft px-3 py-2 text-app-text-muted"
                          >
                            <span>
                              {new Date(
                                record.date
                              ).toLocaleDateString()}
                            </span>

                            <span
                              className={
                                "font-medium capitalize " +
                                (record.status ===
                                "present"
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400")
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
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default StudentAttendance;