import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Students({ students, setStudents }) {
  const [searchText, setSearchText] = useState("");
  const [deleteStudent, setDeleteStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(function () {
    async function fetchStudents() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/students"
        );

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(
            data.message || "Failed to retrieve students."
          );
          return;
        }

        setStudents(data.students);
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, [setStudents]);

  async function handleDelete() {
    try {
      const response = await fetch(
        "http://localhost:5000/api/students/" +
          deleteStudent._id,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message || "Failed to delete student."
        );
        return;
      }

      setStudents(
        students.filter(function (student) {
          return student._id !== deleteStudent._id;
        })
      );

      setDeleteStudent(null);
    } catch (error) {
      console.log(error);
      setErrorMessage("Unable to connect to the server.");
    }
  }

  const filteredStudents = students.filter(function (student) {
    const fullName =
      student.firstName + " " + student.lastName;

    const search = searchText.toLowerCase();

    return (
      fullName.toLowerCase().includes(search) ||
      student.rollNumber.toLowerCase().includes(search)
    );
  });

  return (
    <main className="p-5">
      <div className="bg-linear-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              👨‍🎓 View Students
            </h1>

            <p className="mt-2 text-green-100">
              Manage all registered students in the system.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={function () {
                navigate("/students/add");
              }}
              className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
            >
              + Add Student
            </button>

            <button
              type="button"
              onClick={function () {
                navigate("/enrollments/add");
              }}
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
            >
              + Enroll Student
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mt-5">
        <label
          htmlFor="search"
          className="text-sm font-medium text-gray-700 mb-2"
        >
          Search Students
        </label>

        <input
          id="search"
          type="text"
          placeholder="Search students..."
          value={searchText}
          onChange={function (event) {
            setSearchText(event.target.value);
          }}
          className="w-full border border-gray-300 rounded-[15px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {errorMessage !== "" && (
        <div className="mt-5 bg-red-100 border border-red-300 text-red-700 px-5 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg mt-8 overflow-hidden">
        <div className="px-6 py-4">
          <div className="text-xl font-semibold text-green-600">
            Student Records
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading students...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No students found.
            </div>
          ) : (
            <table className="w-full">
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
                {filteredStudents.map(function (student) {
                  return (
                    <tr
                      key={student._id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 font-medium">
                        {student.firstName} {student.lastName}
                      </td>

                      <td className="px-6 py-4">
                        {student.rollNumber}
                      </td>

                      <td className="px-6 py-4">
                        {student.department}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {student.status || "active"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-2 hover:bg-blue-600"
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
                          className="bg-red-500 text-white px-3 py-1 rounded mb-2 mr-2 hover:bg-red-600"
                          onClick={function () {
                            setDeleteStudent(student);
                          }}
                        >
                          Delete
                        </button>

                        <button
                          onClick={function () {
                            navigate(
                              "/students/" +
                                student._id
                            );
                          }}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                        >
                          View
                        </button>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">
            <h2 className="text-xl font-bold mb-3">
              Delete Student
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <strong>
                {deleteStudent.firstName}{" "}
                {deleteStudent.lastName}
              </strong>
              ?
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-lg border border-gray-300"
                onClick={function () {
                  setDeleteStudent(null);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
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
