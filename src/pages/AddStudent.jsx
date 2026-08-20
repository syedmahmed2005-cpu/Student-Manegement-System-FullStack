import { useEffect,useState } from "react";
function AddStudent({setPage}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    batchId: "",
    email: "",
    phoneNumber: "",
    rollNumber: "",
    registrationNumber: "",
    gender: "",
    dob: "",
    department: "",
    city: "",
    country: "",
    address: ""
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

  return (
  <main className="max-w-7xl mx-auto px-6 py-8">

    {/* Page Heading */}
    <div className="mb-8">

      <h1 className="text-3xl font-bold text-green-700! flex items-center">
        <span className="mr-3">➕</span>
        Add Student
      </h1>

      <p className="text-gray-500 mt-2">
        Fill in the details below to add a new student.
      </p>

    </div>

    {/* Student Information Card */}
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">

      {/* Card Header */}
      <div className="bg-green-600 text-white px-6 py-4">

        <h2 className="text-xl font-semibold flex items-center">
          <span className="mr-3">🎓</span>
          Student Information
        </h2>

      </div>

      {/* Card Content */}
      <div className="p-6">
        <form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{/* First Name */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    👤 First Name <span className="text-red-500">*</span>
  </label>

  <input
    id="firstName"
    type="text"
    placeholder="Enter first name"
    required
     value={formData.firstName}
  onChange={function (event) {
    setFormData({
      ...formData,
      firstName: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>

{/* Last Name */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    👤 Last Name <span className="text-red-500">*</span>
  </label>

  <input
    id="lastName"
    type="text"
    placeholder="Enter last name"
    required
     value={formData.lastName}
  onChange={function (event) {
    setFormData({
      ...formData,
      lastName: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>
{/* Email */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📧 Email <span className="text-red-500">*</span>
  </label>

  <input
    id="email"
    type="email"
    placeholder="Enter your email"
    required
     value={formData.email}
  onChange={function (event) {
    setFormData({
      ...formData,
      email: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>

{/* Phone */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📞 Phone Number <span className="text-red-500">*</span>
  </label>

  <input
    id="phoneNumber"
    type="tel"
    placeholder="Enter your Phone Number"
    required
     value={formData.phoneNumber}
  onChange={function (event) {
    setFormData({
      ...formData,
      phoneNumber: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>
{/* Roll Number */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    #️⃣ Roll Number <span className="text-red-500">*</span>
  </label>

  <input
    id="rollNumber"
    type="text"
    placeholder="Enter your Roll Number"
    required
    value={formData.rollNumber}
  onChange={function (event) {
    setFormData({
      ...formData,
      rollNumber: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>

{/* Registration Number */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    🆔 Registration Number <span className="text-red-500">*</span>
  </label>

  <input
    id="registrationNumber"
    type="text"
    placeholder="Enter your Registration Number"
    required
     value={formData.registrationNumber}
  onChange={function (event) {
    setFormData({
      ...formData,
      registrationNumber: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>
{/* Gender */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    ⚧ Gender
  </label>

  <div className="space-y-2">

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="gender"
        value="Male"
         checked={formData.gender === "Male"}
  onChange={function (event) {
    setFormData({
      ...formData,
      gender: event.target.value,
    });
  }}
        className="text-green-600"
      />
      Male
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="gender"
        value="Female"
         checked={formData.gender === "Female"}
  onChange={function (event) {
    setFormData({
      ...formData,
      gender: event.target.value,
    });
  }}
        className="text-green-600"
      />
      Female
    </label>

    <label className="flex items-center gap-2">
      <input
        type="radio"
        name="gender"
        value="Other"
        checked={formData.gender === "Other"}
  onChange={function (event) {
    setFormData({
      ...formData,
      gender: event.target.value,
    });
  }}
        className="text-green-600"
      />
      Others
    </label>

  </div>
</div>

{/* Date of Birth */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📅 Date of Birth
  </label>

  <input
    id="dob"
    type="date"
    name="dateOfBirth"
    value={formData.dob}
  onChange={function (event) {
    setFormData({
      ...formData,
      dob: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>

<div>
  <label className="block font-semibold mb-2">
    Batch
  </label>

  <input
    type="text"
    name="batchId"
    value={formData.batchId}
    onChange={function (event) {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    }}
    placeholder="e.g. FA24-BCS"
    className="border rounded-lg px-4 py-2 w-full"
  />
</div>

{/* Department */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    🏢 Department
  </label>

  <input
    id="department"
    type="text"
    placeholder="Enter your Department"
    value={formData.department}
    onChange={function (event) {
      setFormData({
        ...formData,
        department: event.target.value,
      });
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>
{/* City */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📍 City
  </label>

  <select
    id="city"
    name="city"
     value={formData.city}
  onChange={function (event) {
    setFormData({
      ...formData,
      city: event.target.value,
    });
  }}
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

{/* Country */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    🌍 Country
  </label>

  <input
    id="country"
    type="text"
    placeholder="Enter your Country"
    value={formData.country}
    onChange={function (event) {
      setFormData({
        ...formData,
        country: event.target.value,
      });
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />
</div>
        </div>
{/* Address */}
<div className="mt-6">

  <label className="block text-sm font-medium text-gray-700 mb-2">
    🏠 Address
  </label>

  <input
    id="address"
    type="text"
    placeholder="Enter your Address"
    value={formData.address}
  onChange={function (event) {
    setFormData({
      ...formData,
      address: event.target.value,
    });
  }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
  />

</div>
{/* Buttons */}
<div className="flex justify-between mt-8">

  <button
    type="button"
    onClick={async function () {
  if (
    formData.firstName === "" ||
    formData.lastName === "" ||
    formData.email === "" ||
    formData.phoneNumber === "" ||
    formData.rollNumber === "" ||
    formData.registrationNumber === ""
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

    console.log(data);

    setFormData({
      firstName: "",
      lastName: "",
      batchId: "",
      email: "",
      phoneNumber: "",
      rollNumber: "",
      registrationNumber: "",
      gender: "",
      dob: "",
      department: "",
      city: "",
      country: "",
      address: ""
    });

    setSuccessMessage("Student saved successfully!");

    setTimeout(function () {
      setPage("students");
    }, 1000);

  } catch (error) {
    console.log(error);

    setErrorMessage("Unable to connect to the server.");
  }
}}
    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
  >
    Save Student
  </button>

 <button
  type="button"
  onClick={function () {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      rollNumber: "",
      registrationNumber: "",
      gender: "",
      dob: "",
      semester: "",
      department: "",
      city: "",
      country: "",
      address: "",
    });
  }}
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

{/* Success Message */}

{successMessage !== "" && (
  <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl z-50">
    {successMessage}
  </div>
)}
  </main>
);
}

export default AddStudent;