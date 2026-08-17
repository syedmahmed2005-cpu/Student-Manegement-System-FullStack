import { useState } from "react";

function Classes({
  classes,
  courses,
  faculty,
  setPage,
  setSelectedClass,
  setClasses,
  showToast,
}) {
  const [deleteIndex, setDeleteIndex] = useState(null);

  return (
    <main className="p-5">

      {/* Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          🏫 Classes
        </h1>

        <p className="mt-2 text-green-100">
          Manage course offerings for different batches and faculty members.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-end mb-6">

        <button
          type="button"
          onClick={function () {
            setPage("addClass");
          }}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          + Add Class
        </button>

      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
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

            {classes.map(function (classItem, index) {

              const selectedCourse = courses.find(
                function (course) {
                  return course.courseId === classItem.courseId;
                }
              );

              const selectedFaculty = faculty.find(
                function (member) {
                  return member.facultyId === classItem.facultyId;
                }
              );

              return (
                <tr
                  key={classItem.classId}
                  className="border-t hover:bg-gray-50"
                >

                  <td className="px-4 py-3 font-medium">
                    {classItem.classId}
                  </td>

                  <td className="px-4 py-3">
                    {selectedCourse
                      ? selectedCourse.courseCode +
                        " - " +
                        selectedCourse.courseName
                      : "Unknown Course"}
                  </td>

                  <td className="px-4 py-3">
                    {selectedFaculty
                      ? selectedFaculty.firstName +
                        " " +
                        selectedFaculty.lastName
                      : "Unknown Faculty"}
                  </td>

                  <td className="px-4 py-3">
                    {classItem.batchId}
                  </td>

                  <td className="px-4 py-3">
                    {classItem.semester}
                  </td>

                  <td className="px-4 py-3">

                    <div className="flex gap-2">

                      <button
                        type="button"
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                        onClick={function () {
                          setSelectedClass(classItem);
                          setPage("viewClass");
                        }}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={function () {
                          setDeleteIndex(index);
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

        {classes.length === 0 && (
          <p className="p-6 text-gray-500 text-center">
            No classes have been created yet.
          </p>
        )}

      </div>

      {/* Delete Confirmation */}
      {deleteIndex !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white rounded-2xl shadow-xl w-[400px] p-6">

            <h2 className="text-xl font-bold mb-3">
              Delete Class
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this class?
            </p>

            <div className="flex justify-end gap-3">

              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300"
                onClick={function () {
                  setDeleteIndex(null);
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-600 text-white"
                onClick={function () {

                  const updatedClasses = classes.filter(
                    function (classItem, index) {
                      return index !== deleteIndex;
                    }
                  );

                  setClasses(updatedClasses);
                  setDeleteIndex(null);

                  showToast(
                    "Class deleted successfully.",
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

export default Classes;