import { useEffect, useState } from "react";

function FacultyCourses({
  faculty,
  setPage
}) {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(function () {
    async function fetchFacultyCourses() {
      try {
        const responses = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/api/classes`,
            {
              credentials: "include"
            }
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/courses`,
            {
              credentials: "include"
            }
          )
        ]);

        const data = await Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );

        if (
          !responses[0].ok ||
          !responses[1].ok
        ) {
          setErrorMessage(
            "Failed to retrieve assigned courses."
          );
          return;
        }

        setClasses(data[0].classes);
        setCourses(data[1].courses);
      } catch (error) {
        console.log(error);

        setErrorMessage(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchFacultyCourses();
  }, []);

  if (!faculty || !faculty.facultyId) {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-app-text">
            Faculty member not selected
          </h1>

          <p className="mt-2 text-app-text-muted">
            Select a faculty member from the Faculty
            page first.
          </p>

          <button
            type="button"
            onClick={function () {
              setPage("faculty");
            }}
            className="mt-6 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Back to Faculty
          </button>
        </div>
      </main>
    );
  }

  const facultyClasses = classes.filter(
    function (classItem) {
      return (
        classItem.facultyId === faculty.facultyId
      );
    }
  );

  const assignedCourses = facultyClasses
    .map(function (classItem) {
      const course = courses.find(
        function (courseItem) {
          return (
            courseItem.courseCode ===
            classItem.courseId
          );
        }
      );

      return {
        classItem,
        course
      };
    })
    .filter(function (item) {
      return item.course !== undefined;
    });

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          📚 Assigned Courses
        </h1>

        <p className="mt-2 text-green-100">
          Courses assigned to {faculty.firstName}{" "}
          {faculty.lastName}
        </p>
      </div>

      <button
        type="button"
        onClick={function () {
          setPage("faculty");
        }}
        className="mb-6 rounded-lg border border-app-border bg-app-surface px-5 py-2 font-semibold text-app-text transition hover:border-green-300 hover:text-green-700 dark:hover:border-green-800 dark:hover:text-green-400"
      >
        ← Back to Faculty
      </button>

      {errorMessage !== "" && (
        <div className="mb-5 rounded-lg border border-red-300 bg-red-100 px-5 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

            <p className="text-app-text-muted">
              Loading courses...
            </p>
          </div>
        ) : assignedCourses.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
              📚
            </div>

            <p className="font-semibold text-app-text">
              No assigned courses
            </p>

            <p className="mt-1 text-sm text-app-text-muted">
              No courses are currently assigned to this
              faculty member.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-app-surface-soft text-app-text">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Course Code
                  </th>

                  <th className="px-4 py-3 text-left">
                    Course Name
                  </th>

                  <th className="px-4 py-3 text-left">
                    Credit Hours
                  </th>

                  <th className="px-4 py-3 text-left">
                    Department
                  </th>

                  <th className="px-4 py-3 text-left">
                    Batch
                  </th>

                  <th className="px-4 py-3 text-left">
                    Semester
                  </th>
                </tr>
              </thead>

              <tbody>
                {assignedCourses.map(function (item) {
                  const course = item.course;
                  const classItem = item.classItem;

                  return (
                    <tr
                      key={classItem._id}
                      className="border-t border-app-border transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                    >
                      <td className="px-4 py-4 font-medium text-app-text">
                        {course.courseCode}
                      </td>

                      <td className="px-4 py-4 font-medium text-app-text">
                        {course.courseName}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {course.creditHours}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {course.department}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-950/60 dark:text-green-300">
                          {classItem.batchId}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          Semester{" "}
                          {classItem.semester}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default FacultyCourses;