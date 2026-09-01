import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function EnrollStudent({ showToast }) {
  const [formData, setFormData] = useState({
    studentId: "",
    classId: "",
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
          fetch("/api/students", {
            credentials: "include",
          }),

          fetch("/api/classes", {
            credentials: "include",
          }),

          fetch("/api/courses", {
            credentials: "include",
          }),

          fetch("/api/faculty", {
            credentials: "include",
          }),
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
          showToast("Failed to retrieve enrollment data.", "error");
          return;
        }

        setStudents(data[0].students);
        setClasses(data[1].classes);
        setCourses(data[2].courses);
        setFaculty(data[3].faculty);
      } catch (error) {
        console.log(error);
        showToast("Unable to connect to the server.", "error");
      }
    }

    fetchEnrollmentData();
  }, []);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleEnroll() {
    if (formData.studentId === "" || formData.classId === "") {
      showToast("Please select a student and a class.", "warning");
      return;
    }

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Failed to enroll student.", "error");
        return;
      }

      showToast("Student enrolled successfully.", "success");
      navigate("/enrollments");
    } catch (error) {
      console.log(error);
      showToast("Unable to connect to the server.", "error");
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

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">🎓 Enroll Student</h1>

        <p className="mt-2 text-green-100">
          Enroll a student into a specific class.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl">
        <div className="mb-5">
          <label className="block font-semibold mb-2">
            Student
          </label>

          <select
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option value="">Select Student</option>

            {students.map(function (student) {
              return (
                <option
                  key={student._id}
                  value={getStudentIdentifier(student)}
                >
                  {student.firstName} {student.lastName} -{" "}
                  {student.rollNumber} - {student.batchId}
                </option>
              );
            })}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Class
          </label>

          <select
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2 w-full"
          >
            <option value="">Select Class</option>

            {classes.map(function (classItem) {
              const selectedCourse = getCourse(classItem.courseId);
              const selectedFaculty = getFaculty(classItem.facultyId);

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
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={function () {
              navigate("/enrollments");
            }}
            className="px-5 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleEnroll}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Enroll Student
          </button>
        </div>
      </div>
    </main>
  );
}

export default EnrollStudent;

