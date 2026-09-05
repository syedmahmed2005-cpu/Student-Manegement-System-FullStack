import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Classes({
  classes,
  courses,
  faculty,
  setClasses,
  setCourses,
  setFaculty,
  showToast
}) {
  const [deleteClass, setDeleteClass] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchClassData() {
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
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/faculty`,
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
            !responses[1].ok ||
            !responses[2].ok
          ) {
            setErrorMessage(
              "Failed to retrieve class data."
            );
            return;
          }

          setClasses(data[0].classes);
          setCourses(data[1].courses);
          setFaculty(data[2].faculty);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchClassData();
    },
    [setClasses, setCourses, setFaculty]
  );

  async function handleDelete() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/classes/${deleteClass._id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message || "Failed to delete class.",
          "error"
        );
        return;
      }

      setClasses(
        classes.filter(function (classItem) {
          return classItem._id !== deleteClass._id;
        })
      );

      setDeleteClass(null);

      showToast(
        "Class deleted successfully.",
        "success"
      );
    } catch (error) {
      console.log(error);

      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
  }

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          🏫 Classes
        </h1>

        <p className="mt-2 text-green-100">
          Manage course offerings for different batches
          and faculty members.
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={function () {
            navigate("/classes/add");
          }}
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          + Add Class
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
              Loading classes...
            </p>
          </div>
        ) : classes.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
              🏫
            </div>

            <p className="font-semibold text-app-text">
              No classes have been created yet.
            </p>

            <p className="mt-1 text-sm text-app-text-muted">
              Create a class to assign a course, faculty
              member, batch and semester.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="bg-app-surface-soft text-app-text">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Class ID
                  </th>

                  <th className="px-4 py-3 text-left">
                    Course
                  </th>

                  <th className="px-4 py-3 text-left">
                    Faculty
                  </th>

                  <th className="px-4 py-3 text-left">
                    Batch
                  </th>

                  <th className="px-4 py-3 text-left">
                    Semester
                  </th>

                  <th className="px-4 py-3 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {classes.map(function (classItem) {
                  const selectedCourse = courses.find(
                    function (course) {
                      return (
                        course.courseCode ===
                        classItem.courseId
                      );
                    }
                  );

                  const selectedFaculty = faculty.find(
                    function (member) {
                      return (
                        member.facultyId ===
                        classItem.facultyId
                      );
                    }
                  );

                  return (
                    <tr
                      key={classItem._id}
                      className="border-t border-app-border text-app-text transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                    >
                      <td className="max-w-48 break-all px-4 py-4 font-medium">
                        {classItem._id}
                      </td>

                      <td className="px-4 py-4">
                        {selectedCourse
                          ? selectedCourse.courseCode +
                            " - " +
                            selectedCourse.courseName
                          : "Unknown Course"}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {selectedFaculty
                          ? selectedFaculty.firstName +
                            " " +
                            selectedFaculty.lastName
                          : "Unknown Faculty"}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {classItem.batchId}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {classItem.semester}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="rounded bg-blue-500 px-3 py-2 text-white transition hover:bg-blue-600"
                            onClick={function () {
                              navigate(
                                "/classes/" +
                                  classItem._id
                              );
                            }}
                          >
                            View
                          </button>

                          <button
                            type="button"
                            className="rounded bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                            onClick={function () {
                              setDeleteClass(classItem);
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

      {deleteClass !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-class-title"
            className="w-full max-w-[400px] rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl"
          >
            <h2
              id="delete-class-title"
              className="mb-3 text-xl font-bold text-app-text"
            >
              Delete Class
            </h2>

            <p className="mb-6 text-app-text-muted">
              Are you sure you want to delete this
              class?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={function () {
                  setDeleteClass(null);
                }}
                className="rounded-lg border border-app-border bg-app-surface-soft px-4 py-2 text-app-text transition hover:border-green-300 dark:hover:border-green-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
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

export default Classes;