function StudentAttendance({
  student,
  classes,
  courses,
  enrollments,
  attendance,
}) {
  if (!student) {
    return (
      <main className="p-5">
        <p className="text-gray-500">
          No student selected.
        </p>
      </main>
    );
  }

  function getCourse(courseId) {
    return courses.find(function (course) {
      return course.courseId === courseId;
    });
  }

  const studentEnrollments =
    enrollments.filter(
      function (enrollment) {
        return (
          enrollment.studentId ===
          student.studentId
        );
      }
    );

  function getAttendance(classId) {
    return attendance.filter(
      function (record) {
        return (
          record.studentId ===
            student.studentId &&
          record.classId === classId
        );
      }
    );
  }

  function getPercentage(classId) {
    const records =
      getAttendance(classId);

    if (records.length === 0) {
      return 0;
    }

    const present =
      records.filter(
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

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">

        <h1 className="text-4xl font-bold">
          📊 My Attendance
        </h1>

        <p className="mt-2 text-green-100">
          Track your attendance across enrolled courses.
        </p>

      </div>

      {studentEnrollments.length === 0 ? (

        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
          You are not enrolled in any classes yet.
        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {studentEnrollments.map(
            function (enrollment) {

              const classItem =
                classes.find(
                  function (classItem) {
                    return (
                      classItem.classId ===
                      enrollment.classId
                    );
                  }
                );

              if (!classItem) {
                return null;
              }

              const course =
                getCourse(
                  classItem.courseId
                );

              const records =
                getAttendance(
                  classItem.classId
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
                  classItem.classId
                );

              return (

                <div
                  key={enrollment.enrollmentId}
                  className="bg-white rounded-xl shadow-lg p-6"
                >

                  <h2 className="text-xl font-bold">

                    {course
                      ? course.courseName
                      : "Unknown Course"}

                  </h2>

                  <p className="text-gray-500 mt-1">

                    {course
                      ? course.courseCode
                      : "-"}

                  </p>

                  <div className="flex gap-3 mt-3">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {classItem.batchId}
                    </span>

                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      Semester{" "}
                      {classItem.semester}
                    </span>

                  </div>

                  <div className="mt-6">

                    <div className="flex justify-between mb-2">

                      <span className="font-semibold">
                        Attendance
                      </span>

                      <span className="font-bold">
                        {percentage}%
                      </span>

                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4">

                      <div
                        className={
                          percentage < 75
                            ? "bg-red-500 h-4 rounded-full"
                            : "bg-green-600 h-4 rounded-full"
                        }
                        style={{
                          width:
                            percentage + "%",
                        }}
                      />

                    </div>

                  </div>

                  <div className="flex justify-between mt-4 text-sm text-gray-600">

                    <span>
                      Present:{" "}
                      <strong className="text-green-600">
                        {present}
                      </strong>
                    </span>

                    <span>
                      Absent:{" "}
                      <strong className="text-red-600">
                        {absent}
                      </strong>
                    </span>

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </main>
  );
}

export default StudentAttendance;