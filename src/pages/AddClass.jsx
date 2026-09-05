import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddClass({
  courses,
  faculty,
  students,
  setCourses,
  setFaculty,
  setStudents,
  showToast
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseId: "",
    facultyId: "",
    batchId: "",
    semester: ""
  });

  useEffect(
    function () {
      async function fetchDependencies() {
        try {
          const responses = await Promise.all([
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
            !responses[2].ok
          ) {
            showToast(
              "Failed to retrieve class data.",
              "error"
            );
            return;
          }

          setCourses(data[0].courses);
          setFaculty(data[1].faculty);
          setStudents(data[2].students);
        } catch (error) {
          console.log(error);

          showToast(
            "Unable to connect to the server.",
            "error"
          );
        }
      }

      fetchDependencies();
    },
    [setCourses, setFaculty, setStudents]
  );

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSave() {
    if (
      formData.courseId === "" ||
      formData.facultyId === "" ||
      formData.batchId === "" ||
      formData.semester === ""
    ) {
      showToast(
        "Please fill all required fields.",
        "warning"
      );
      return;
    }

    const selectedCourse = courses.find(
      function (course) {
        return (
          course.courseCode === formData.courseId
        );
      }
    );

    const selectedFaculty = faculty.find(
      function (member) {
        return (
          member.facultyId ===
          formData.facultyId
        );
      }
    );

    if (!selectedCourse || !selectedFaculty) {
      showToast(
        "Invalid course or faculty selection.",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/classes`,
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
            "Failed to create class.",
          "error"
        );
        return;
      }

      showToast(
        "Class created successfully.",
        "success"
      );

      navigate("/classes");
    } catch (error) {
      console.log(error);

      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
  }

  const inputClass =
    "w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  const labelClass =
    "mb-2 block font-semibold text-app-text";

  const batchOptions = Array.from(
    new Set(
      students.map(function (student) {
        return student.batchId;
      })
    )
  );

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          🏫 Add Class
        </h1>

        <p className="mt-2 text-green-100">
          Create a class by connecting a course, faculty
          member and batch.
        </p>
      </div>

      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-app-text">
            Class Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Select the course, faculty member, batch and
            semester for this class.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Course
            </label>

            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select Course
              </option>

              {courses.map(function (course) {
                return (
                  <option
                    key={course._id}
                    value={course.courseCode}
                  >
                    {course.courseCode} -{" "}
                    {course.courseName}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Faculty
            </label>

            <select
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select Faculty
              </option>

              {faculty.map(function (member) {
                return (
                  <option
                    key={member._id}
                    value={member.facultyId}
                  >
                    {member.firstName}{" "}
                    {member.lastName}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Batch
            </label>

            <select
              name="batchId"
              value={formData.batchId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Batch</option>

              {batchOptions.map(function (batchId) {
                return (
                  <option
                    key={batchId}
                    value={batchId}
                  >
                    {batchId}
                  </option>
                );
              })}
            </select>

            {batchOptions.length === 0 && (
              <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                No student batches are currently
                available.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              Semester
            </label>

            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select Semester
              </option>

              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={function () {
              navigate("/classes");
            }}
            className="rounded-lg border border-app-border bg-app-surface-soft px-6 py-3 font-semibold text-app-text transition hover:border-green-300 dark:hover:border-green-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Create Class
          </button>
        </div>
      </div>
    </main>
  );
}

export default AddClass;