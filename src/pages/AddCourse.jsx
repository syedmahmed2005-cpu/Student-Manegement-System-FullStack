import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddCourse({ showToast }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    creditHours: "",
    department: ""
  });

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit() {
    if (
      formData.courseCode === "" ||
      formData.courseName === "" ||
      formData.creditHours === "" ||
      formData.department === ""
    ) {
      showToast(
        "Please fill all required fields.",
        "warning"
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses`,
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
          data.message || "Failed to add course.",
          "error"
        );
        return;
      }

      showToast(
        "Course added successfully.",
        "success"
      );

      navigate("/courses");
    } catch (error) {
      console.log(error);

      showToast(
        "Unable to connect to the server.",
        "error"
      );
    }
  }

  const inputClass =
    "w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  const labelClass =
    "mb-2 block font-semibold text-app-text";

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          📚 Add Course
        </h1>

        <p className="mt-2 text-green-100">
          Add a new course to the system.
        </p>
      </div>

      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-app-text">
            Course Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Complete the details below to create a new
            course.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Course Code
            </label>

            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="e.g. CSC-301"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Course Name
            </label>

            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. Database Systems"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Credit Hours
            </label>

            <input
              type="number"
              name="creditHours"
              value={formData.creditHours}
              onChange={handleChange}
              placeholder="e.g. 3"
              min="1"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">
                Select Department
              </option>

              <option value="Computer Science">
                Computer Science
              </option>

              <option value="Software Engineering">
                Software Engineering
              </option>

              <option value="Information Technology">
                Information Technology
              </option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={function () {
              navigate("/courses");
            }}
            className="rounded-lg border border-app-border bg-app-surface-soft px-6 py-3 font-semibold text-app-text transition hover:border-green-300 dark:hover:border-green-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Save Course
          </button>
        </div>
      </div>
    </main>
  );
}

export default AddCourse;