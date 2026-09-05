import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Courses({
  courses,
  setCourses,
  showToast
}) {
  const [searchText, setSearchText] = useState("");
  const [deleteCourse, setDeleteCourse] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchCourses() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/courses`,
            {
              credentials: "include"
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message ||
                "Failed to retrieve courses."
            );
            return;
          }

          setCourses(data.courses);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchCourses();
    },
    [setCourses]
  );

  async function handleDelete() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${deleteCourse._id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Failed to delete course."
        );
        return;
      }

      setCourses(
        courses.filter(function (course) {
          return course._id !== deleteCourse._id;
        })
      );

      setDeleteCourse(null);

      showToast(
        "Course deleted successfully.",
        "success"
      );
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Unable to connect to the server."
      );
    }
  }

  const filteredCourses = courses.filter(
    function (course) {
      const search = searchText.toLowerCase();

      return (
        course.courseName
          .toLowerCase()
          .includes(search) ||
        course.courseCode
          .toLowerCase()
          .includes(search)
      );
    }
  );

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          📚 Courses
        </h1>

        <p className="mt-2 text-green-100">
          Manage all courses in the system.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 rounded-xl border border-app-border bg-app-surface p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Search courses..."
          value={searchText}
          onChange={function (event) {
            setSearchText(event.target.value);
          }}
          className="w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 sm:max-w-sm dark:focus:ring-green-900/50"
        />

        <button
          type="button"
          onClick={function () {
            navigate("/courses/add");
          }}
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          + Add Course
        </button>
      </div>

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
        ) : filteredCourses.length === 0 ? (
          <div className="p-8 text-center text-app-text-muted">
            No courses found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
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
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map(function (
                  course
                ) {
                  return (
                    <tr
                      key={course._id}
                      className="border-t border-app-border text-app-text transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                    >
                      <td className="px-4 py-4">
                        {course.courseCode}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {course.courseName}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {course.creditHours}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {course.department}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600"
                            onClick={function () {
                              navigate(
                                "/courses/" +
                                  course._id
                              );
                            }}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="rounded bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                            onClick={function () {
                              setDeleteCourse(course);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteCourse !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-course-title"
            className="w-full max-w-[400px] rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl"
          >
            <h2
              id="delete-course-title"
              className="mb-3 text-xl font-bold text-app-text"
            >
              Delete Course
            </h2>

            <p className="mb-6 text-app-text-muted">
              Are you sure you want to delete{" "}
              <strong className="text-app-text">
                {deleteCourse.courseCode} -{" "}
                {deleteCourse.courseName}
              </strong>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-app-border bg-app-surface-soft px-4 py-2 text-app-text transition hover:border-green-300 dark:hover:border-green-800"
                onClick={function () {
                  setDeleteCourse(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Courses;