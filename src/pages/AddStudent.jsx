import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStudent({ setStudents }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    batchId: "",
    email: "",
    phoneNumber: "",
    gender: "",
    dob: "",
    department: "",
    city: "",
    country: "",
    address: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(function () {
    if (errorMessage !== "") {
      const timer = setTimeout(function () {
        setErrorMessage("");
      }, 3000);

      return function () {
        clearTimeout(timer);
      };
    }
  }, [errorMessage]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.batchId === "" ||
      formData.email === "" ||
      formData.phoneNumber === "" ||
      formData.gender === "" ||
      formData.dob === "" ||
      formData.department === "" ||
      formData.city === "" ||
      formData.country === "" ||
      formData.address === ""
    ) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to save student.");
        return;
      }

      setStudents(function (currentStudents) {
        return [...currentStudents, data.student];
      });

      setFormData({
        firstName: "",
        lastName: "",
        batchId: "",
        email: "",
        phoneNumber: "",
        gender: "",
        dob: "",
        department: "",
        city: "",
        country: "",
        address: "",
      });

      setSuccessMessage("Student saved successfully!");

      setTimeout(function () {
        navigate("/students");
      }, 1000);
    } catch (error) {
      console.log(error);
      setErrorMessage("Unable to connect to the server.");
    }
  }

  function handleReset() {
    setFormData({
      firstName: "",
      lastName: "",
      batchId: "",
      email: "",
      phoneNumber: "",
      gender: "",
      dob: "",
      department: "",
      city: "",
      country: "",
      address: "",
    });
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-700 flex items-center">
          <span className="mr-3">➕</span>
          Add Student
        </h1>

        <p className="text-gray-500 mt-2">
          Fill in the details below to add a new student.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">

        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold flex items-center">
            <span className="mr-3">🎓</span>
            Student Information
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 First Name <span className="text-red-500">*</span>
                </label>

                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Last Name <span className="text-red-500">*</span>
                </label>

                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📧 Email <span className="text-red-500">*</span>
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📞 Phone Number <span className="text-red-500">*</span>
                </label>

                <input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ⚧ Gender <span className="text-red-500">*</span>
                </label>

                <div className="space-y-2">

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={handleChange}
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={handleChange}
                    />
                    Female
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={formData.gender === "Other"}
                      onChange={handleChange}
                    />
                    Others
                  </label>

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Date of Birth <span className="text-red-500">*</span>
                </label>

                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Batch <span className="text-red-500">*</span>
                </label>

                <input
                  name="batchId"
                  type="text"
                  value={formData.batchId}
                  onChange={handleChange}
                  placeholder="e.g. FA24"
                  className="border rounded-lg px-4 py-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🏢 Department <span className="text-red-500">*</span>
                </label>

                <input
                  name="department"
                  type="text"
                  placeholder="Enter your Department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 City <span className="text-red-500">*</span>
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="" disabled>
                    Select City
                  </option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Faisalabad">Faisalabad</option>
                  <option value="Multan">Multan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🌍 Country <span className="text-red-500">*</span>
                </label>

                <input
                  name="country"
                  type="text"
                  placeholder="Enter your Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏠 Address <span className="text-red-500">*</span>
              </label>

              <input
                name="address"
                type="text"
                placeholder="Enter your Address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex justify-between mt-8">

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Save Student
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
              >
                Reset
              </button>

            </div>

          </form>
        </div>
      </div>

      {errorMessage !== "" && (
        <div className="fixed top-5 right-5 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl z-50">
          {errorMessage}
        </div>
      )}

      {successMessage !== "" && (
        <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl z-50">
          {successMessage}
        </div>
      )}

    </main>
  );
}

export default AddStudent;