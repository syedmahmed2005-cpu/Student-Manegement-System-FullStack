import { useState } from "react";

function EditStudent({ student, updateStudent }) {
  const [formData, setFormData] = useState(student);
  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          ✏️ Edit Student
        </h1>

        <p className="mt-2 text-green-100">
          Update student information.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>

            <input
              type="text"
              value={formData.firstName}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  firstName: event.target.value,
                });
              }}
              className="w-full border border-gray-300 rounded-[15px] px-4 py-2 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>

            <input
              type="text"
              value={formData.lastName}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  lastName: event.target.value,
                });
              }}
              className="w-full border border-gray-300 rounded-[15px] px-4 py-2 mt-2"
            />
          </div>
          <div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📧 Email <span className="text-red-500">*</span>
  </label>

  <input
    id="email"
    type="email"
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
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📞 Phone Number <span className="text-red-500">*</span>
  </label>

  <input
    id="phoneNumber"
    type="tel"
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
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    🆔 Registration Number <span className="text-red-500">*</span>
  </label>

  <input
    id="registrationNumber"
    type="text"
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
<div>
            <label className="text-sm font-medium text-gray-700">
              Roll Number
            </label>

            <input
              type="text"
              value={formData.rollNumber}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  rollNumber: event.target.value,
                });
              }}
              className="w-full border border-gray-300 rounded-[15px] px-4 py-2 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 ">
              Semester
            </label>

            <select
              value={formData.semester}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  semester: event.target.value,
                });
              }}
              className="w-full border border-gray-300 rounded-[15px] px-4 py-2 mt-2 mb-4"
            >
              <option value="">Select Semester</option>
              <option value="1">First</option>
              <option value="2">Second</option>
              <option value="3">Third</option>
              <option value="4">Fourth</option>
              <option value="5">Fifth</option>
              <option value="6">Sixth</option>
              <option value="7">Seventh</option>
              <option value="8">Eighth</option>
            </select>
          </div>

        </div>
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
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📅 Date of Birth
  </label>

  <input
    id="dob"
    type="date"
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
  <label className="block text-sm font-medium text-gray-700 mb-2">
    📍 City
  </label>

  <select
    id="city"
    value={formData.city}
    onChange={function (event) {
      setFormData({
        ...formData,
        city: event.target.value,
      });
    }}
    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
  >
    <option value="">Select City</option>
    <option value="Islamabad">Islamabad</option>
    <option value="Lahore">Lahore</option>
    <option value="Faisalabad">Faisalabad</option>
    <option value="Multan">Multan</option>
  </select>
</div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    🌍 Country
  </label>

  <input
    id="country"
    type="text"
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
          
        <div className="mt-6">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    🏠 Address
  </label>

  <input
    id="address"
    type="text"
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


        <div className="flex justify-end mt-6">
        <button
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
            onClick={function () {
            updateStudent(formData);
        }}>
         Save Changes
        </button>        
        </div>
      </div>
    </main>
  );
}

export default EditStudent;