import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddFaculty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    facultyId: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    designation: "",
    qualification: "",
    joiningDate: "",
    city: "",
    country: "",
    address: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit() {
    if (
      formData.facultyId === "" ||
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.email === "" ||
      formData.phoneNumber === "" ||
      formData.department === "" ||
      formData.designation === "" ||
      formData.qualification === "" ||
      formData.joiningDate === ""
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok) { setErrorMessage(data.message || "Failed to save faculty member."); return; }
      setSuccessMessage("Faculty member saved successfully!");
      setTimeout(function () { navigate("/faculty"); }, 1000);
    } catch (error) {
      console.log(error);
      setErrorMessage("Unable to connect to the server.");
    }
  }

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">👨‍🏫 Add Faculty</h1>
        <p className="mt-2 text-green-100">
          Add a new faculty member to the system.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
  <label className="block font-semibold mb-2">Faculty ID</label>

  <input
    type="text"
    name="facultyId"
    value={formData.facultyId}
    onChange={handleChange}
    className="w-full border rounded-lg px-4 py-2"
    placeholder="Enter Faculty ID"
    required
  />
</div>

          <div>
            <label className="block font-semibold mb-2">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select Department</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Designation</label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="">Select Designation</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="Lecturer">Lecturer</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2">Qualification</label>
            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
              rows="3"
            ></textarea>
          </div>

        </div>

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={function () {
              navigate("/faculty");
            }}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
          >
            Save Faculty
          </button>
        </div>
      </div>
      {errorMessage !== "" && <div className="fixed top-5 right-5 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl z-50">{errorMessage}</div>}
      {successMessage !== "" && <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl z-50">{successMessage}</div>}
    </main>
  );
}

export default AddFaculty;
