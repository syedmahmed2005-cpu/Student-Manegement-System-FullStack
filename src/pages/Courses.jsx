import { useState } from "react";

function Courses({
  courses,
  setPage,
  setSelectedCourse,
  setCourses,
  showToast,
}) {
  const [searchText, setSearchText] = useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);

  return (
    <main className="p-5">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">📚 Courses</h1>

        <p className="mt-2 text-green-100">
          Manage all courses in the system.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6">

        <input
          type="text"
          placeholder="Search courses..."
          value={searchText}
          onChange={function (event) {
            setSearchText(event.target.value);
          }}
          className="border rounded-lg px-4 py-2 w-80"
        />

        <button
          onClick={function () {
            setPage("addCourse");
          }}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          + Add Course
        </button>

      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
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
            {courses
              .filter(function (course) {
                return (
                  course.courseName
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                  course.courseCode
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
                );
              })
              .map(function (course) {
                return (
                  <tr
                    key={course.courseId}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-3">
                      {course.courseCode}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {course.courseName}
                    </td>

                    <td className="px-4 py-3">
                      {course.creditHours}
                    </td>

                    <td className="px-4 py-3">
                      {course.department}
                    </td>

                    <td className="px-4 py-3">

                      {/* View */}
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={function () {
                          setSelectedCourse(course);
                          setPage("viewCourse");
                        }}
                      >
                        View
                      </button>

                      {/* Delete */}
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded ml-2"
                        onClick={function () {
                          const index = courses.indexOf(course);
                          setDeleteIndex(index);
                        }}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>
                );
              })}
          </tbody>

        </table>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">

            <h2 className="text-xl font-bold mb-3">
              Delete Course
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this course?
            </p>

            <div className="flex justify-end gap-3">

              {/* Cancel */}
              <button
                className="px-4 py-2 rounded-lg border border-gray-300"
                onClick={function () {
                  setDeleteIndex(null);
                }}
              >
                Cancel
              </button>

              {/* Confirm Delete */}
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={function () {
                  const updatedCourses = courses.filter(
                    function (course, index) {
                      return index !== deleteIndex;
                    }
                  );

                  setCourses(updatedCourses);
                  setDeleteIndex(null);

                  showToast(
                    "Course deleted successfully.",
                    "success"
                  );
                }}
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