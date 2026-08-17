import { useState } from "react";

function Attendance({
  classes,
  courses,
  faculty,
  students,
  enrollments,
  attendance,
  setAttendance,
  setPage,
  showToast,
}) {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});

  function getCourse(courseId) {
    return courses.find(function (course) {
      return course.courseId === courseId;
    });
  }

  function getFaculty(facultyId) {
    return faculty.find(function (member) {
      return member.facultyId === facultyId;
    });
  }

  function getEnrolledStudents() {
    const classEnrollments = enrollments.filter(function (enrollment) {
      return enrollment.classId === selectedClassId;
    });

    return classEnrollments
      .map(function (enrollment) {
        return students.find(function (student) {
          return student.studentId === enrollment.studentId;
        });
      })
      .filter(function (student) {
        return student !== undefined;
      });
  }

  function handleStatusChange(studentId, status) {
    setAttendanceStatus(function (currentStatus) {
      return {
        ...currentStatus,
        [studentId]: status,
      };
    });
  }

  function saveAttendance() {
    if (selectedClassId === "" || attendanceDate === "") {
      showToast(
        "Please select a class and attendance date.",
        "warning"
      );
      return;
    }

    const enrolledStudents = getEnrolledStudents();

    if (enrolledStudents.length === 0) {
      showToast(
        "No students are enrolled in this class.",
        "warning"
      );
      return;
    }

    const newAttendance = enrolledStudents.map(function (student) {
      return {
        attendanceId:
          "ATT-" +
          student.studentId +
          "-" +
          selectedClassId +
          "-" +
          attendanceDate,

        studentId: student.studentId,

        classId: selectedClassId,

        date: attendanceDate,

        status:
          attendanceStatus[student.studentId] || "absent",
      };
    });

    setAttendance(function (currentAttendance) {
      const filteredAttendance = currentAttendance.filter(
        function (record) {
          return !(
            record.classId === selectedClassId &&
            record.date === attendanceDate
          );
        }
      );

      return [
        ...filteredAttendance,
        ...newAttendance,
      ];
    });

    showToast(
      "Attendance saved successfully.",
      "success"
    );

    setAttendanceStatus({});
  }

  const enrolledStudents = getEnrolledStudents();

  return (
    <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">

        <h1 className="text-4xl font-bold">
          📋 Mark Attendance
        </h1>

        <p className="mt-2 text-green-100">
          Mark attendance for students enrolled in a class.
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Class */}

          <div>

            <label className="block font-semibold mb-2">
              Class
            </label>

            <select
              value={selectedClassId}
              onChange={function (event) {
                setSelectedClassId(event.target.value);
                setAttendanceStatus({});
              }}
              className="border rounded-lg px-4 py-2 w-full"
            >

              <option value="">
                Select Class
              </option>

              {classes.map(function (classItem) {

                const course = getCourse(
                  classItem.courseId
                );

                const facultyMember = getFaculty(
                  classItem.facultyId
                );

                return (
                  <option
                    key={classItem.classId}
                    value={classItem.classId}
                  >
                    {course
                      ? course.courseCode
                      : "Unknown Course"}{" "}
                    -{" "}
                    {course
                      ? course.courseName
                      : "Unknown Course"}{" "}
                    | {classItem.batchId} | Semester{" "}
                    {classItem.semester} |{" "}
                    {facultyMember
                      ? facultyMember.firstName +
                        " " +
                        facultyMember.lastName
                      : "Unknown Faculty"}
                  </option>
                );

              })}

            </select>

          </div>

          {/* Date */}

          <div>

            <label className="block font-semibold mb-2">
              Date
            </label>

            <input
              type="date"
              value={attendanceDate}
              onChange={function (event) {
                setAttendanceDate(event.target.value);
              }}
              className="border rounded-lg px-4 py-2 w-full"
            />

          </div>

        </div>

      </div>

      {selectedClassId !== "" && (

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="px-6 py-4 bg-gray-100">

            <h2 className="text-xl font-bold">
              Enrolled Students
            </h2>

          </div>

          {enrolledStudents.length === 0 ? (

            <p className="p-6 text-gray-500">
              No students are enrolled in this class.
            </p>

          ) : (

            <>

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
                      Attendance
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {enrolledStudents.map(function (student) {

                    return (

                      <tr
                        key={student.studentId}
                        className="border-t"
                      >

                        <td className="px-4 py-3 font-medium">
                          {student.firstName}{" "}
                          {student.lastName}
                        </td>

                        <td className="px-4 py-3">
                          {student.rollNumber}
                        </td>

                        <td className="px-4 py-3">

                          <div className="flex gap-3">

                            <button
                              type="button"
                              onClick={function () {
                                handleStatusChange(
                                  student.studentId,
                                  "present"
                                );
                              }}
                              className={
                                attendanceStatus[
                                  student.studentId
                                ] === "present"
                                  ? "bg-green-600 text-white px-4 py-2 rounded-lg"
                                  : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                              }
                            >
                              Present
                            </button>

                            <button
                              type="button"
                              onClick={function () {
                                handleStatusChange(
                                  student.studentId,
                                  "absent"
                                );
                              }}
                              className={
                                attendanceStatus[
                                  student.studentId
                                ] === "absent"
                                  ? "bg-red-600 text-white px-4 py-2 rounded-lg"
                                  : "bg-gray-200 text-gray-700 px-4 py-2 rounded-lg"
                              }
                            >
                              Absent
                            </button>

                          </div>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

              <div className="flex justify-end p-5">

                <button
                  type="button"
                  onClick={saveAttendance}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
                >
                  Save Attendance
                </button>

              </div>

            </>

          )}

        </div>

      )}

    </main>
  );
}

export default Attendance;