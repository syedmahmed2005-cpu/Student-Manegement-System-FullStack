import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EnrollStudent({ showToast }) {
  const [formData, setFormData] = useState({
    studentId: "",
    classId: ""
  });

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const navigate = useNavigate();

  useEffect(function () {
    async function fetchEnrollmentData() {
      try {
        const responses = await Promise.all([
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
          ),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/faculty`,
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
          showToast(
            "Failed to retrieve enrollment data.",
            "error"
          );
          return;
        }

        setStudents(data[0].students);
        setClasses(data[1].classes);
        setCourses(data[2].courses);
        setFaculty(data[3].faculty);
      } catch (error) {
        console.log(error);

        showToast(
          "Unable to connect to the server.",
          "error"
        );
      }
    }

    fetchEnrollmentData();
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleEnroll() {
    if (
      formData.studentId === "" ||
      formData.classId === ""
    ) {
      showToast(
        "Please select a student and a class.",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        showToast(
          data.message ||
            "Failed to enroll student.",
          "error"
        );
        return;
      }

      showToast(
        "Student enrolled successfully.",
        "success"
      );

      navigate("/enrollments");
    } catch (error) {
      console.log(error);

      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
  }

  function getStudentIdentifier(student) {
    return student.studentId || student._id;
  }

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

  const inputClass =
    "w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          🎓 Enroll Student
        </h1>

        <p className="mt-2 text-green-100">
          Enroll a student into a specific class.
        </p>
      </div>

      <div className="max-w-2xl rounded-2xl border border-app-border bg-app-surface p-6 shadow-lg">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-app-text">
            Enrollment Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Select a student and a class with the same
            batch.
          </p>
        </div>

        <div className="mb-5">
          <label className="mb-2 block font-semibold text-app-text">
            Student
          </label>

          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">
              Select Student
            </option>

            {students.map(function (student) {
              return (
                <option
                  key={student._id}
                  value={getStudentIdentifier(student)}
                >
                  {student.firstName}{" "}
                  {student.lastName} -{" "}
                  {student.rollNumber} -{" "}
                  {student.batchId}
                </option>
              );
            })}
          </select>

          {students.length === 0 && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              No students are currently available.
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="mb-2 block font-semibold text-app-text">
            Class
          </label>

          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Class</option>

            {classes.map(function (classItem) {
              const selectedCourse = getCourse(
                classItem.courseId
              );

              const selectedFaculty = getFaculty(
                classItem.facultyId
              );

              return (
                <option
                  key={classItem._id}
                  value={classItem._id}
                >
                  {selectedCourse
                    ? selectedCourse.courseCode
                    : "Unknown Course"}{" "}
                  -{" "}
                  {selectedCourse
                    ? selectedCourse.courseName
                    : "Unknown Course"}{" "}
                  | {classItem.batchId} | Semester{" "}
                  {classItem.semester} |{" "}
                  {selectedFaculty
                    ? selectedFaculty.firstName +
                      " " +
                      selectedFaculty.lastName
                    : "Unknown Faculty"}
                </option>
              );
            })}
          </select>

          {classes.length === 0 && (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              No classes are currently available.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
          The student must belong to the same batch as
          the selected class.
        </div>

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={function () {
              navigate("/enrollments");
            }}
            className="rounded-lg border border-app-border bg-app-surface-soft px-5 py-3 font-semibold text-app-text transition hover:border-green-300 dark:hover:border-green-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleEnroll}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Enroll Student
          </button>
        </div>
      </div>
    </main>
  );
}

export default EnrollStudent;