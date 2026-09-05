import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Enrollments({ showToast }) {
  const [enrollments, setEnrollments] =
    useState([]);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const navigate = useNavigate();

  useEffect(function () {
    async function fetchEnrollmentData() {
      try {
        const responses = await Promise.all([
          fetch(
            `${import.meta.env.VITE_API_URL}/api/enrollments`,
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
          )
        ]);

        const data = await Promise.all(
          responses.map(function (response) {
            return response.json();
          })
        );

        if (
          !responses[0].ok ||
          !responses[1].ok ||
          !responses[2].ok ||
          !responses[3].ok
        ) {
          setErrorMessage(
            "Failed to retrieve enrollment data."
          );
          return;
        }

        setEnrollments(data[0].enrollments);
        setStudents(data[1].students);
        setClasses(data[2].classes);
        setCourses(data[3].courses);
      } catch (error) {
        console.log(error);

        setErrorMessage(
          "Unable to connect to the server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchEnrollmentData();
  }, []);

  async function removeEnrollment(enrollment) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments/${enrollment._id}`,
        {
          method: "DELETE",
          credentials: "include"
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message ||
            "Failed to remove enrollment.",
          "error"
        );
        return;
      }

      setEnrollments(
        enrollments.filter(function (item) {
          return item._id !== enrollment._id;
        })
      );

      showToast(
        "Enrollment removed successfully.",
        "success"
      );
    } catch (error) {
      console.log(error);

      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
  }

  function getStudent(studentId) {
    return students.find(function (student) {
      return (
        (student.studentId || student._id) ===
        studentId
      );
    });
  }

  function getClass(classId) {
    return classes.find(function (classItem) {
      return classItem._id === classId;
    });
  }

  function getCourse(courseId) {
    return courses.find(function (course) {
      return course.courseCode === courseId;
    });
  }

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          🎓 Enrollments
        </h1>

        <p className="mt-2 text-green-100">
          View all student course enrollments.
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-app-text">
            Enrollment Records
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            {enrollments.length} enrollment
            {enrollments.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={function () {
            navigate("/enrollments/add");
          }}
          className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          + Enroll Student
        </button>
      </div>

      {errorMessage !== "" && (
        <div className="mb-5 rounded-lg border border-red-300 bg-red-100 px-5 py-3 text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

            <p className="text-app-text-muted">
              Loading enrollments...
            </p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
              🎓
            </div>

            <p className="font-semibold text-app-text">
              No enrollment records found.
            </p>

            <p className="mt-1 text-sm text-app-text-muted">
              Enrolled students will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead className="bg-app-surface-soft text-app-text">
                <tr>
                  <th className="px-4 py-3 text-left">
                    Student
                  </th>

                  <th className="px-4 py-3 text-left">
                    Roll Number
                  </th>

                  <th className="px-4 py-3 text-left">
                    Course Name
                  </th>

                  <th className="px-4 py-3 text-left">
                    Course Code
                  </th>

                  <th className="px-4 py-3 text-left">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {enrollments.map(function (
                  enrollment
                ) {
                  const student = getStudent(
                    enrollment.studentId
                  );

                  const classItem = getClass(
                    enrollment.classId
                  );

                  const course = classItem
                    ? getCourse(classItem.courseId)
                    : null;

                  return (
                    <tr
                      key={enrollment._id}
                      className="border-t border-app-border text-app-text transition hover:bg-green-50/50 dark:hover:bg-green-950/20"
                    >
                      <td className="px-4 py-4 font-medium">
                        {student
                          ? student.firstName +
                            " " +
                            student.lastName
                          : "Unknown Student"}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {student
                          ? student.rollNumber
                          : "-"}
                      </td>

                      <td className="px-4 py-4 font-medium">
                        {course
                          ? course.courseName
                          : "Unknown Course"}
                      </td>

                      <td className="px-4 py-4 text-app-text-muted">
                        {course
                          ? course.courseCode
                          : "-"}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          className="rounded bg-red-500 px-3 py-2 text-white transition hover:bg-red-600"
                          onClick={function () {
                            removeEnrollment(
                              enrollment
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
          </div>
        )}
      </div>
    </main>
  );
}

export default Enrollments;