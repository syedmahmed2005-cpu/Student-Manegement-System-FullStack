import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Faculty({
  faculty,
  setFaculty,
  setSelectedFaculty,
  setPage
}) {
  const [deleteFaculty, setDeleteFaculty] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchFaculty() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/faculty`,
            {
              credentials: "include"
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message ||
                "Failed to retrieve faculty."
            );
            return;
          }

          setFaculty(data.faculty);
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchFaculty();
    },
    [setFaculty]
  );

  async function handleDelete() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty/${deleteFaculty._id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Failed to delete faculty member."
        );
        return;
      }

      setFaculty(
        faculty.filter(function (member) {
          return (
            member._id !== deleteFaculty._id
          );
        })
      );

      setDeleteFaculty(null);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Unable to connect to the server."
      );
    }
  }

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          👨‍🏫 Faculty
        </h1>

        <p className="mt-2 text-green-100">
          Manage all faculty members in the system.
        </p>
      </div>

      {errorMessage !== "" && (
        <div className="mb-5 rounded-lg border border-red-300 bg-red-100 px-5 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        <div className="flex flex-col gap-4 bg-green-600 px-6 py-4 text-white sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold">
            👨‍🏫 Faculty Members
          </h2>

          <button
            type="button"
            onClick={function () {
              navigate("/faculty/add");
            }}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-green-600 transition hover:bg-gray-100"
          >
            + Add Faculty
          </button>
        </div>

        <div className="overflow-x-auto p-6">
          {loading ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

              <p className="text-app-text-muted">
                Loading faculty...
              </p>
            </div>
          ) : faculty.length === 0 ? (
            <p className="py-8 text-center text-app-text-muted">
              No faculty members found.
            </p>
          ) : (
            <table className="w-full min-w-[1150px] text-left">
              <thead>
                <tr className="border-b border-app-border">
                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Faculty ID
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Name
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Department
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Designation
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Email
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Status
                  </th>

                  <th className="px-4 py-3 text-sm font-semibold text-app-text-muted">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {faculty.map(function (member) {
                  return (
                    <tr
                      key={member._id}
                      className="border-b border-app-border transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                    >
                      <td className="px-4 py-4 font-medium text-app-text">
                        {member.facultyId}
                      </td>

                      <td className="px-4 py-4 text-app-text">
                        {member.firstName}{" "}
                        {member.lastName}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {member.department}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {member.designation}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {member.email}
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium capitalize text-green-700 dark:bg-green-950/60 dark:text-green-300">
                          {member.status || "active"}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={function () {
                              navigate(
                                "/faculty/" +
                                  member._id
                              );
                            }}
                            className="rounded-lg bg-blue-600 px-3 py-2 text-white transition hover:bg-blue-700"
                          >
                            👁️ View
                          </button>

                          <button
                            type="button"
                            onClick={function () {
                              navigate(
                                "/faculty/" +
                                  member._id +
                                  "/edit"
                              );
                            }}
                            className="rounded-lg bg-green-600 px-3 py-2 text-white transition hover:bg-green-700"
                          >
                            ✏️ Edit
                          </button>

                          <button
                            type="button"
                            onClick={function () {
                              setDeleteFaculty(member);
                            }}
                            className="rounded-lg bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                          >
                            Delete
                          </button>

                          <button
                            type="button"
                            onClick={function () {
                              setSelectedFaculty(
                                member
                              );

                              setPage(
                                "facultyCourses"
                              );
                            }}
                            className="rounded-lg bg-yellow-500 px-3 py-2 text-white transition hover:bg-yellow-600"
                          >
                            View Courses
                          </button>

                          <button
                            type="button"
                            onClick={function () {
                              setSelectedFaculty(
                                member
                              );

                              setPage(
                                "facultyAttendance"
                              );
                            }}
                            className="rounded-lg bg-purple-600 px-3 py-2 text-white transition hover:bg-purple-700"
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

      {deleteFaculty !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-faculty-title"
            className="w-full max-w-[400px] rounded-2xl border border-app-border bg-app-surface p-6 shadow-xl"
          >
            <h2
              id="delete-faculty-title"
              className="mb-3 text-xl font-bold text-app-text"
            >
              Delete Faculty
            </h2>

            <p className="mb-6 text-app-text-muted">
              Are you sure you want to delete{" "}
              <strong className="text-app-text">
                {deleteFaculty.firstName}{" "}
                {deleteFaculty.lastName}
              </strong>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={function () {
                  setDeleteFaculty(null);
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

export default Faculty;