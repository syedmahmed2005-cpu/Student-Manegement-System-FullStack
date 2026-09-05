import { useEffect, useState } from "react";

function Attendance({ showToast, user }) {
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [students, setStudents] = useState([]);
  const [enrollments, setEnrollments] =
    useState([]);
  const [attendance, setAttendance] =
    useState([]);
  const [selectedClassId, setSelectedClassId] =
    useState("");
  const [attendanceDate, setAttendanceDate] =
    useState("");
  const [attendanceStatus, setAttendanceStatus] =
    useState({});

  useEffect(function () {
    async function fetchAttendanceData() {
      try {
        const responses = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/api/classes`,
            {
              credentials: "include"
            }
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/courses`,
            {
              credentials: "include"
            }
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/faculty`,
            {
              credentials: "include"
            }
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/students`,
            {
              credentials: "include"
            }
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/enrollments`,
            {
              credentials: "include"
            }
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/attendance`,
            {
              credentials: "include"
            }
          )
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
          showToast(
            "Failed to retrieve attendance data.",
            "error"
          );
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

        showToast(
          "Unable to connect to the server.",
          "error"
        );
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
        return (
          classItem.facultyId === user.facultyId
        );
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
        return (
          enrollment.classId === selectedClassId
        );
      })
      .map(function (enrollment) {
        return students.find(function (student) {
          return (
            getStudentIdentifier(student) ===
            enrollment.studentId
          );
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
        existingStatus[record.studentId] =
          record.status;
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
          record.date.substring(0, 10) ===
            attendanceDate
        );
      })
      .forEach(function (record) {
        existingStatus[record.studentId] =
          record.status;
      });

    setAttendanceStatus(existingStatus);
  }

  async function saveAttendance() {
    if (
      selectedClassId === "" ||
      attendanceDate === ""
    ) {
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
          const studentId =
            getStudentIdentifier(student);

          return fetch(
            `${import.meta.env.VITE_API_URL}/api/attendance`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              credentials: "include",
              body: JSON.stringify({
                studentId,
                classId: selectedClassId,
                date: attendanceDate,
                status:
                  attendanceStatus[studentId] ||
                  "absent"
              })
            }
          );
        })
      );

      const data = await Promise.all(
        responses.map(function (response) {
          return response.json();
        })
      );

      const failedResponse =
        responses.findIndex(function (response) {
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

      setAttendance(function (
        currentAttendance
      ) {
        const otherRecords =
          currentAttendance.filter(
            function (record) {
              return !(
                record.classId ===
                  selectedClassId &&
                record.date.substring(0, 10) ===
                  attendanceDate
              );
            }
          );

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

  const inputClass =
    "w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  const inactiveButtonClass =
    "rounded-lg border border-app-border bg-app-surface-soft px-4 py-2 text-app-text transition hover:border-green-300 dark:hover:border-green-800";

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          📋 Mark Attendance
        </h1>

        <p className="mt-2 text-green-100">
          Mark attendance for students enrolled in a
          class.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-app-border bg-app-surface p-6 shadow-lg">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-app-text">
            Attendance Session
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Select a class and date to view its enrolled
            students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-semibold text-app-text">
              Class
            </label>

            <select
              value={selectedClassId}
              onChange={function (event) {
                handleClassChange(
                  event.target.value
                );
              }}
              className={inputClass}
            >
              <option value="">Select Class</option>

              {visibleClasses.map(function (
                classItem
              ) {
                const course = getCourse(
                  classItem.courseId
                );

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

            {visibleClasses.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                No classes are available for attendance.
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-semibold text-app-text">
              Date
            </label>

            <input
              type="date"
              value={attendanceDate}
              onChange={function (event) {
                handleDateChange(event.target.value);
              }}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {selectedClassId !== "" && (
        <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
          <div className="border-b border-app-border bg-app-surface-soft px-6 py-4">
            <h2 className="text-xl font-bold text-app-text">
              Enrolled Students
            </h2>

            <p className="mt-1 text-sm text-app-text-muted">
              Select Present or Absent for each student.
            </p>
          </div>

          {enrolledStudents.length === 0 ? (
            <p className="p-6 text-app-text-muted">
              No students are enrolled in this class.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-app-border text-app-text">
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
                    {enrolledStudents.map(function (
                      student
                    ) {
                      const studentId =
                        getStudentIdentifier(student);

                      return (
                        <tr
                          key={studentId}
                          className="border-t border-app-border transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                        >
                          <td className="px-4 py-4 font-medium text-app-text">
                            {student.firstName}{" "}
                            {student.lastName}
                          </td>

                          <td className="px-4 py-4 text-app-text-muted">
                            {student.rollNumber}
                          </td>

                          <td className="px-4 py-4">
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
                                    ? "rounded-lg bg-green-600 px-4 py-2 text-white shadow-sm"
                                    : inactiveButtonClass
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
                                    ? "rounded-lg bg-red-600 px-4 py-2 text-white shadow-sm"
                                    : inactiveButtonClass
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
              </div>

              <div className="flex justify-end border-t border-app-border bg-app-surface-soft p-5">
                <button
                  type="button"
                  onClick={saveAttendance}
                  className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
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