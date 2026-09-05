import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FacultyAttendance({ faculty }) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchFacultyAttendance() {
        if (!faculty || !faculty.facultyId) {
          setErrorMessage(
            "Select a faculty member from the Faculty page first."
          );
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/attendance/faculty/${faculty.facultyId}`,
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

      fetchFacultyAttendance();
    },
    [faculty]
  );

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          📊 My Attendance
        </h1>

        <p className="mt-2 text-green-100">
          View attendance for your assigned classes.
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
            You currently have no assigned classes.
          </p>

          <p className="mt-1 text-sm text-app-text-muted">
            Assigned class attendance will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {classes.map(function (item) {
            const classItem = item.class;
            const course = item.course;

            const attendancePercentage = Math.min(
              100,
              Math.max(
                0,
                Number(item.attendancePercentage) || 0
              )
            );

            return (
              <article
                key={classItem._id}
                className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-xl dark:hover:border-green-800"
              >
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-green-50 text-2xl dark:bg-green-950/50">
                    📚
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-app-text">
                      {course
                        ? course.courseName
                        : "Unknown Course"}
                    </h2>

                    <p className="mt-1 text-app-text-muted">
                      {course
                        ? course.courseCode
                        : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm">
                  <span className="rounded-full bg-green-100 px-3 py-1 font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                    Batch {classItem.batchId}
                  </span>

                  <span className="rounded-full bg-blue-100 px-3 py-1 font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    Semester {classItem.semester}
                  </span>
                </div>

                <div className="mt-6 rounded-xl bg-app-surface-soft p-4">
                  <div className="mb-2 flex justify-between gap-4">
                    <span className="font-semibold text-app-text">
                      Overall Attendance
                    </span>

                    <span className="font-bold text-green-700 dark:text-green-400">
                      {attendancePercentage}%
                    </span>
                  </div>

                  <div
                    role="progressbar"
                    aria-label="Overall attendance"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={
                      attendancePercentage
                    }
                    className="h-3 w-full overflow-hidden rounded-full bg-app-border"
                  >
                    <div
                      className="h-3 rounded-full bg-green-600 transition-all duration-300"
                      style={{
                        width:
                          attendancePercentage + "%"
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-lg bg-app-surface-soft p-3">
                    <p className="font-bold text-app-text">
                      {item.enrolledStudents}
                    </p>

                    <p className="text-xs text-app-text-muted">
                      Students
                    </p>
                  </div>

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

                <button
                  type="button"
                  onClick={function () {
                    navigate(
                      "/faculty/class-attendance?classId=" +
                        classItem._id
                    );
                  }}
                  className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                >
                  View Details
                </button>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default FacultyAttendance;