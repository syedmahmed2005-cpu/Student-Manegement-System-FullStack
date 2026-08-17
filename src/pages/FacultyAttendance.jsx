function FacultyAttendance({
  faculty,
  classes,
  courses,
  attendance,
  setSelectedClass,
  setPage,
}) {
  function getCourse(courseId) {
    return courses.find(function (course) {
      return course.courseId === courseId;
    });
  }

  function getClassAttendance(classId) {
    return attendance.filter(function (record) {
      return record.classId === classId;
    });
  }

  function getAttendancePercentage(classId) {
    const records = getClassAttendance(classId);

    if (records.length === 0) {
      return 0;
    }

    const presentCount = records.filter(function (record) {
      return record.status === "present";
    }).length;

    return Math.round(
      (presentCount / records.length) * 100
    );
  }

  const facultyClasses = classes.filter(function (classItem) {
    return classItem.facultyId === faculty.facultyId;
  });

  return (
    <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">

        <h1 className="text-4xl font-bold">
          📊 My Attendance
        </h1>

        <p className="mt-2 text-green-100">
          View attendance for your assigned classes.
        </p>

      </div>

      {facultyClasses.length === 0 ? (

        <div className="bg-white rounded-xl shadow-lg p-8 text-center text-gray-500">
          You currently have no assigned classes.
        </div>

      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {facultyClasses.map(function (classItem) {

            const course = getCourse(
              classItem.courseId
            );

            const percentage =
              getAttendancePercentage(
                classItem.classId
              );

            return (

              <div
                key={classItem.classId}
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

                <div className="flex gap-3 mt-3 text-sm">

                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {classItem.batchId}
                  </span>

                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                    Semester {classItem.semester}
                  </span>

                </div>

                <div className="mt-6">

                  <div className="flex justify-between mb-2">

                    <span className="font-semibold">
                      Overall Attendance
                    </span>

                    <span className="font-bold">
                      {percentage}%
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-green-600 h-3 rounded-full"
                      style={{
                        width: percentage + "%",
                      }}
                    />

                  </div>

                </div>

                <button
                  type="button"
                  onClick={function () {
                    setSelectedClass(classItem);
                    setPage("facultyClassAttendance");
                  }}
                  className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  View Details
                </button>

              </div>

            );

          })}

        </div>

      )}

    </main>
  );
}

export default FacultyAttendance;