import { useEffect, useState } from "react";

function Attendance({ showToast, user }) {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(function () {
    async function fetchAttendanceData() {
      try {
        const responses = await Promise.all([
          fetch("/api/classes", {
            credentials: "include"
          }),
          fetch("/api/courses", {
            credentials: "include"
          }),
          fetch("/api/faculty", {
            credentials: "include"
          }),
          fetch("/api/students", {
            credentials: "include"
          }),
          fetch("/api/enrollments", {
            credentials: "include"
          }),
          fetch("/api/attendance", {
            credentials: "include"
          })
        ]);

        const data = await Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );

        if (
          responses.some(function (response) {
            return !response.ok;
          })
        ) {
          showToast("Failed to retrieve attendance data.", "error");
          return;
        }

        setClasses(data[0].classes);
        setCourses(data[1].courses);
        setFaculty(data[2].faculty);
        setStudents(data[3].students);
        setEnrollments(data[4].enrollments);
        setAttendance(data[5].attendance);
      } catch (error) {
        console.log(error);
        showToast("Unable to connect to the server.", "error");
      }
    }

    fetchAttendanceData();
  }, []);

  function getCourse(courseId) {
    return courses.find(function (course) {
      return course.courseCode === courseId;
    });
  }

  function getFaculty(facultyId) {
    return faculty.find(function (member) {
      return member.facultyId === facultyId;
    });
  }

  function getVisibleClasses() {
    if (user.role === "faculty") {
      return classes.filter(function (classItem) {
        return classItem.facultyId === user.facultyId;
      });
    }

    return classes;
  }

  function getStudentIdentifier(student) {
    return student.studentId || student._id;
  }

  function getEnrolledStudents() {
    return enrollments
      .filter(function (enrollment) {
        return enrollment.classId === selectedClassId;
      })
      .map(function (enrollment) {
        return students.find(function (student) {
          return getStudentIdentifier(student) === enrollment.studentId;
        });
      })
      .filter(function (student) {
        return student !== undefined;
      });
  }

  function handleStatusChange(studentId, status) {
    setAttendanceStatus({
      ...attendanceStatus,
      [studentId]: status
    });
  }

  function handleDateChange(date) {
    setAttendanceDate(date);

    const existingStatus = {};

    attendance
      .filter(function (record) {
        return (
          record.classId === selectedClassId &&
          record.date.substring(0, 10) === date
        );
      })
      .forEach(function (record) {
        existingStatus[record.studentId] = record.status;
      });

    setAttendanceStatus(existingStatus);
  }

  function handleClassChange(classId) {
    setSelectedClassId(classId);

    const existingStatus = {};

    attendance
      .filter(function (record) {
        return (
          record.classId === classId &&
          record.date.substring(0, 10) === attendanceDate
        );
      })
      .forEach(function (record) {
        existingStatus[record.studentId] = record.status;
      });

    setAttendanceStatus(existingStatus);
  }

  async function saveAttendance() {
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

    try {
      const responses = await Promise.all(
        enrolledStudents.map(function (student) {
          const studentId = getStudentIdentifier(student);

          return fetch("/api/attendance", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
              studentId: studentId,
              classId: selectedClassId,
              date: attendanceDate,
              status: attendanceStatus[studentId] || "absent"
            })
          });
        })
      );

      const data = await Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );

      const failedResponse = responses.findIndex(function (response) {
        return !response.ok;
      });

      if (failedResponse !== -1) {
        showToast(
          data[failedResponse].message ||
            "Failed to save attendance.",
          "error"
        );
        return;
      }

      setAttendance(function (currentAttendance) {
        const otherRecords = currentAttendance.filter(function (record) {
          return !(
            record.classId === selectedClassId &&
            record.date.substring(0, 10) === attendanceDate
          );
        });

        return [
          ...otherRecords,
          ...data.map(function (item) {
            return item.attendance;
          })
        ];
      });

      showToast(
        "Attendance saved successfully.",
        "success"
      );

      setAttendanceStatus({});
    } catch (error) {
      console.log(error);
      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
  }

  const enrolledStudents = getEnrolledStudents();
  const visibleClasses = getVisibleClasses();

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
          <div>
            <label className="block font-semibold mb-2">
              Class
            </label>

            <select
              value={selectedClassId}
              onChange={function (event) {
                handleClassChange(event.target.value);
              }}
              className="border rounded-lg px-4 py-2 w-full"
            >
              <option value="">
                Select Class
              </option>

              {visibleClasses.map(function (classItem) {
                const course = getCourse(classItem.courseId);
                const facultyMember = getFaculty(
                  classItem.facultyId
                );

                return (
                  <option
                    key={classItem._id}
                    value={classItem._id}
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

          <div>
            <label className="block font-semibold mb-2">
              Date
            </label>

            <input
              type="date"
              value={attendanceDate}
              onChange={function (event) {
                handleDateChange(event.target.value);
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
                    const studentId =
                      getStudentIdentifier(student);

                    return (
                      <tr
                        key={studentId}
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
                                  studentId,
                                  "present"
                                );
                              }}
                              className={
                                attendanceStatus[
                                  studentId
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
                                  studentId,
                                  "absent"
                                );
                              }}
                              className={
                                attendanceStatus[
                                  studentId
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