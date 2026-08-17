import {useState} from "react";
function Faculty({ faculty, setPage, setSelectedFaculty,setFaculty}) {
    const [deleteIndex,setDeleteIndex] = useState(null);
  return (
    <main className="p-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">👨‍🏫 Faculty</h1>

        <p className="mt-2 text-green-100">
          Manage all faculty members in the system.
        </p>
      </div>

      {/* Faculty Table Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-green-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">
            👨‍🏫 Faculty Members
          </h2>

          <button
            onClick={function () {
              setPage("addFaculty");
            }}
            className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            + Add Faculty
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Faculty ID
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Name
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Department
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Designation
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Email
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Status
                </th>

                <th className="px-4 py-3 text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {faculty.map(function (member) {
                return (
                  <tr
                    key={member.facultyId}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium text-gray-800">
                      {member.facultyId}
                    </td>

                    <td className="px-4 py-4 text-gray-800">
                      {member.firstName} {member.lastName}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {member.department}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {member.designation}
                    </td>

                    <td className="px-4 py-4 text-gray-600">
                      {member.email}
                    </td>

                    <td className="px-4 py-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {member.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={function () {
                            setSelectedFaculty(member);
                            setPage("viewFaculty");
                          }}
                          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                          👁️ View
                        </button>

                        <button
                          onClick={function () {
                            setSelectedFaculty(member);
                            setPage("editFaculty");
                          }}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                          ✏️ Edit
                        </button>

                       <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={function () {
                            const index = faculty.indexOf(member);
                            setDeleteIndex(index);
                        }}>
                              Delete
                        </button>
                        <button
                        type="button"
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={function () {
                        setSelectedFaculty(member);
                        setPage("facultyCourses");
                        }}
                        >
                        View Courses
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {deleteIndex !== null && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">
      <h2 className="text-xl font-bold mb-3">
        Delete Faculty
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this faculty member?
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300"
          onClick={function () {
            setDeleteIndex(null);
          }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white"
          onClick={function () {
            const updatedFaculty = faculty.filter(
              function (member, index) {
                return index !== deleteIndex;
              }
            );

            setFaculty(updatedFaculty);
            setDeleteIndex(null);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
        </div>
      </div>
    </main>
  );
}

export default Faculty;