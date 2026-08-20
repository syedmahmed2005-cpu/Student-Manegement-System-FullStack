function Enrollments({
  enrollments,
  students,
  classes,
  courses,
  setPage,
  setEnrollments,
  showToast,
}) {
  function getStudent(studentId) {
    return students.find(function (student) {
      return student.studentId === studentId;
    });
  }
  function getClass(classId) {
  return classes.find(function (classItem) {
    return classItem.classId === classId;
  });
}

function getCourse(courseId) {
  return courses.find(function (course) {
    return course.courseId === courseId;
  });
}

  return (
    <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          🎓 Enrollments
        </h1>

        <p className="mt-2 text-green-100">
          View all student course enrollments.
        </p>
      </div>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Enrollment Records
        </h2>

        <button
          type="button"
          onClick={function () {
            setPage("enrollStudent");
          }}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          + Enroll Student
        </button>

      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        {enrollments.length === 0 ? (
          <p className="p-6 text-gray-500">
            No enrollment records found.
          </p>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Roll Number</th>
                <th className="px-4 py-3 text-left">Course Name</th>
                <th className="px-4 py-3 text-left">Course Code</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {enrollments.map(function (enrollment) {
                const student = getStudent(enrollment.studentId);
                const classItem = getClass(enrollment.classId);

                const course = classItem
                  ? getCourse(classItem.courseId)
                  : null;

                return (
                  <tr
                    key={enrollment.enrollmentId}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-4 py-3 font-medium">
                      {student
                        ? student.firstName + " " + student.lastName
                        : "Unknown Student"}
                    </td>

                    <td className="px-4 py-3">
                      {student ? student.rollNumber : "-"}
                    </td>

                    <td className="px-4 py-3 font-medium">
                      {course
                        ? course.courseName
                        : "Unknown Course"}
                    </td>

                    <td className="px-4 py-3">
                      {course ? course.courseCode : "-"}
                    </td>

                    <td className="px-4 py-3">

                      <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={function () {
                          const updatedEnrollments =
                            enrollments.filter(function (item) {
                              return (
                                item.enrollmentId !==
                                enrollment.enrollmentId
                              );
                            });

                          setEnrollments(updatedEnrollments);

                          showToast(
                            "Enrollment removed successfully.",
                            "success"
                          );
                        }}
                      >
                        Remove
                      </button>

                    </td>

                  </tr>
                );
              })}
            </tbody>

          </table>
        )}

      </div>

    </main>
  );
}

export default Enrollments;