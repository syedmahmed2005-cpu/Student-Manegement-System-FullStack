function FacultyClassAttendance({
  selectedClass,
  courses,
  students,
  enrollments,
  attendance,
  setPage,
}) {
  if (!selectedClass) {
    return (
      <main className="p-5">
        <p className="text-gray-500">
          No class selected.
        </p>
      </main>
    );
  }

  function getCourse(courseId) {
    return courses.find(function (course) {
      return course.courseId === courseId;
    });
  }

  const course = getCourse(
    selectedClass.courseId
  );

  const classEnrollments = enrollments.filter(
    function (enrollment) {
      return (
        enrollment.classId ===
        selectedClass.classId
      );
    }
  );

  const classAttendance = attendance.filter(
    function (record) {
      return (
        record.classId ===
        selectedClass.classId
      );
    }
  );

  function getStudentAttendance(studentId) {
    return classAttendance.filter(
      function (record) {
        return record.studentId === studentId;
      }
    );
  }

  function getPercentage(studentId) {
    const records =
      getStudentAttendance(studentId);

    if (records.length === 0) {
      return 0;
    }

    const present = records.filter(
      function (record) {
        return record.status === "present";
      }
    ).length;

    return Math.round(
      (present / records.length) * 100
    );
  }

  return (
    <main className="p-5">

      <button
        type="button"
        onClick={function () {
          setPage("facultyAttendance");
        }}
        className="mb-6 px-4 py-2 border rounded-lg"
      >
        ← Back to My Attendance
      </button>

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">

        <h1 className="text-4xl font-bold">
          📚 {course
            ? course.courseName
            : "Unknown Course"}
        </h1>

        <p className="mt-2 text-green-100">
          {course
            ? course.courseCode
            : "-"}{" "}
          | {selectedClass.batchId} | Semester{" "}
          {selectedClass.semester}
        </p>

      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="px-6 py-4 bg-gray-100">

          <h2 className="text-xl font-bold">
            Student Attendance
          </h2>

        </div>

        {classEnrollments.length === 0 ? (

          <p className="p-6 text-gray-500">
            No students are enrolled in this class.
          </p>

        ) : (

          <table className="w-full">

            <thead>

              <tr className="border-b">

                <th className="px-4 py-3 text-left">
                  Student
                </th>

                <th className="px-4 py-3 text-left">
                  Roll Number
                </th>

                <th className="px-4 py-3 text-left">
                  Present
                </th>

                <th className="px-4 py-3 text-left">
                  Absent
                </th>

                <th className="px-4 py-3 text-left">
                  Attendance
                </th>

              </tr>

            </thead>

            <tbody>

              {classEnrollments.map(
                function (enrollment) {

                  const student =
                    students.find(
                      function (student) {
                        return (
                          student.studentId ===
                          enrollment.studentId
                        );
                      }
                    );

                  const records =
                    getStudentAttendance(
                      enrollment.studentId
                    );

                  const present =
                    records.filter(
                      function (record) {
                        return (
                          record.status ===
                          "present"
                        );
                      }
                    ).length;

                  const absent =
                    records.filter(
                      function (record) {
                        return (
                          record.status ===
                          "absent"
                        );
                      }
                    ).length;

                  const percentage =
                    getPercentage(
                      enrollment.studentId
                    );

                  return (

                    <tr
                      key={
                        enrollment.enrollmentId
                      }
                      className="border-t hover:bg-gray-50"
                    >

                      <td className="px-4 py-3 font-medium">

                        {student
                          ? student.firstName +
                            " " +
                            student.lastName
                          : "Unknown Student"}

                      </td>

                      <td className="px-4 py-3">

                        {student
                          ? student.rollNumber
                          : "-"}

                      </td>

                      <td className="px-4 py-3 text-green-600 font-semibold">
                        {present}
                      </td>

                      <td className="px-4 py-3 text-red-600 font-semibold">
                        {absent}
                      </td>

                      <td className="px-4 py-3">

                        <div className="flex items-center gap-3">

                          <span className="font-semibold">
                            {percentage}%
                          </span>

                          <div className="w-24 bg-gray-200 rounded-full h-2">

                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{
                                width:
                                  percentage +
                                  "%",
                              }}
                            />

                          </div>

                        </div>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        )}

      </div>

    </main>
  );
}

export default FacultyClassAttendance;