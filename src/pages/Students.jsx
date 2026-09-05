import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Students({
  students,
  setStudents,
  setSelectedStudent
}) {
  const [searchText, setSearchText] = useState("");
  const [deleteStudent, setDeleteStudent] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchStudents() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/students`
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message ||
                "Failed to retrieve students."
            );
            return;
          }

          setStudents(data.students);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchStudents();
    },
    [setStudents]
  );

  async function handleDelete() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students/${deleteStudent._id}`,
        {
          method: "DELETE"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Failed to delete student."
        );
        return;
      }

      setStudents(
        students.filter(function (student) {
          return (
            student._id !== deleteStudent._id
          );
        })
      );

      setDeleteStudent(null);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Unable to connect to the server."
      );
    }
  }

  const filteredStudents = students.filter(
    function (student) {
      const fullName =
        student.firstName +
        " " +
        student.lastName;

      const search = searchText.toLowerCase();

      return (
        fullName.toLowerCase().includes(search) ||
        student.rollNumber
          .toLowerCase()
          .includes(search)
      );
    }
  );

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-linear-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              👨‍🎓 View Students
            </h1>

            <p className="mt-2 text-green-100">
              Manage all registered students in the
              system.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={function () {
                navigate("/students/add");
              }}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition hover:bg-gray-100"
            >
              + Add Student
            </button>

            <button
              type="button"
              onClick={function () {
                navigate("/enrollments/add");
              }}
              className="rounded-lg bg-green-800/60 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              + Enroll Student
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-app-border bg-app-surface p-6 shadow-lg">
        <label
          htmlFor="search"
          className="mb-2 block text-sm font-medium text-app-text"
        >
          Search Students
        </label>

        <input
          id="search"
          type="search"
          placeholder="Search students..."
          value={searchText}
          onChange={function (event) {
            setSearchText(event.target.value);
          }}
          className="w-full rounded-[15px] border border-app-border bg-app-surface-soft px-4 py-2 text-app-text placeholder:text-app-text-muted focus:ring-2 focus:ring-green-500"
        />
      </div>

      {errorMessage !== "" && (
        <div className="mt-5 rounded-lg border border-red-300 bg-red-100 px-5 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="mt-8 overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        <div className="border-b border-app-border px-6 py-4">
          <div className="text-xl font-semibold text-green-600 dark:text-green-400">
            Student Records
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-app-text-muted">
              Loading students...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-app-text-muted">
              No students found.
            </div>
          ) : (
            <table className="w-full min-w-[900px]">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">
                    Student
                  </th>

                  <th className="px-6 py-3 text-left">
                    Roll No
                  </th>

                  <th className="px-6 py-3 text-left">
                    Department
                  </th>

                  <th className="px-6 py-3 text-left">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map(function (
                  student
                ) {
                  return (
                    <tr
                      key={student._id}
                      className="border-b border-app-border text-app-text transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                    >
                      <td className="px-6 py-4 font-medium">
                        {student.firstName}{" "}
                        {student.lastName}
                      </td>

                      <td className="px-6 py-4 text-app-text-muted">
                        {student.rollNumber}
                      </td>

                      <td className="px-6 py-4 text-app-text-muted">
                        {student.department}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-green-100 px-2 py-1 text-sm font-medium text-green-800 dark:bg-green-950/60 dark:text-green-300">
                          {student.status || "active"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="rounded bg-blue-500 px-3 py-1 text-white transition hover:bg-blue-600"
                            onClick={function () {
                              navigate(
                                "/students/" +
                                  student._id +
                                  "/edit"
                              );
                            }}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="rounded bg-red-500 px-3 py-1 text-white transition hover:bg-red-600"
                            onClick={function () {
                              setDeleteStudent(student);
                            }}
                          >
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={function () {
                              navigate(
                                "/students/" +
                                  student._id
                              );
                            }}
                            className="rounded bg-green-500 px-3 py-1 text-white transition hover:bg-green-700"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={function () {
                              setSelectedStudent(student);

                              navigate(
                                "/students/attendance"
                              );
                            }}
                            className="rounded bg-purple-600 px-3 py-1 text-white transition hover:bg-purple-700"
                          >
                            Attendance
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {deleteStudent !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-student-title"
            className="w-full max-w-[400px] rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl"
          >
            <h2
              id="delete-student-title"
              className="mb-3 text-xl font-bold text-app-text"
            >
              Delete Student
            </h2>

            <p className="mb-6 text-app-text-muted">
              Are you sure you want to delete{" "}
              <strong className="text-app-text">
                {deleteStudent.firstName}{" "}
                {deleteStudent.lastName}
              </strong>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="rounded-lg border border-app-border bg-app-surface-soft px-4 py-2 text-app-text transition hover:border-green-300 dark:hover:border-green-800"
                onClick={function () {
                  setDeleteStudent(null);
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

export default Students;