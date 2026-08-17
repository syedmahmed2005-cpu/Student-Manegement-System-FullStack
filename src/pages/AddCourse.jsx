import {useState} from "react";
function AddCourse({setCourses,setPage,showToast}) {
    const[formData,setFormData]=useState({
        courseCode:"",
        courseName:"",
        creditHours:"",
        department:"",
    });
    function handleChange(event){
        setFormData({
            ...formData,
            [event.target.name]:event.target.value,
        });
}
return(
     <main className="p-5">

      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">📚 Add Course</h1>

        <p className="mt-2 text-green-100">
          Add a new course..
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="block font-semibold mb-2">
              Course Code
            </label>

            <input
              type="text"
              name="courseCode"
              value={formData.courseCode}
              onChange={handleChange}
              placeholder="e.g. CSC-301"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Course Name
            </label>

            <input
              type="text"
              name="courseName"
              value={formData.courseName}
              onChange={handleChange}
              placeholder="e.g. Database Systems"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Credit Hours
            </label>

            <input
              type="number"
              name="creditHours"
              value={formData.creditHours}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Department
            </label>

            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="">Select Department</option>
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

        <div className="flex justify-between mt-8">

          <button
            type="button"
            onClick={function () {
              setPage("courses");
            }}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={function () {
  if (
    formData.courseCode === "" ||
    formData.courseName === "" ||
    formData.creditHours === "" ||
    formData.department === "" 
  ) {
    showToast("Please fill all required fields.", "warning");
    return;
  }

  

  const newCourse = {
    ...formData,
    courseId: "COURSE-" + Date.now(),
  };

  setCourses(function (currentCourses) {
    return [...currentCourses, newCourse];
  });

  showToast("Course added successfully.", "success");

  setPage("courses");
}}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Save Course
          </button>

        </div>

      </div>

    </main>
);
}
export default AddCourse;