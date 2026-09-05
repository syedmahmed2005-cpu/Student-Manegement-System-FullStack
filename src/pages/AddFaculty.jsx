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
    address: ""
  });

  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
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
      setErrorMessage(
        "Please fill all required fields."
      );
      return;
    }

    try {
      setErrorMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty`,
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
        setErrorMessage(
          data.message ||
            "Failed to save faculty member."
        );
        return;
      }

      setSuccessMessage(
        "Faculty member saved successfully!"
      );

      setTimeout(function () {
        navigate("/faculty");
      }, 1000);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Unable to connect to the server."
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
          👨‍🏫 Add Faculty
        </h1>

        <p className="mt-2 text-green-100">
          Add a new faculty member to the system.
        </p>
      </div>

      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-app-text">
            Faculty Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Complete the details below to create the
            faculty record.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              Faculty ID
            </label>

            <input
              type="text"
              name="facultyId"
              value={formData.facultyId}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter Faculty ID"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              First Name
            </label>

            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter first name"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Last Name
            </label>

            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter last name"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter email address"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Phone Number
            </label>

            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter phone number"
              required
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
              required
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

              <option value="Electrical Engineering">
                Electrical Engineering
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Designation
            </label>

            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">
                Select Designation
              </option>

              <option value="Professor">
                Professor
              </option>

              <option value="Associate Professor">
                Associate Professor
              </option>

              <option value="Assistant Professor">
                Assistant Professor
              </option>

              <option value="Lecturer">
                Lecturer
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Qualification
            </label>

            <input
              type="text"
              name="qualification"
              value={formData.qualification}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter qualification"
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              Joining Date
            </label>

            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label className={labelClass}>
              City
            </label>

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className={labelClass}>
              Country
            </label>

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter country"
            />
          </div>

          <div className="md:col-span-2">
            <label className={labelClass}>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`${inputClass} resize-y`}
              rows="3"
              placeholder="Enter address"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button
            type="button"
            onClick={function () {
              navigate("/faculty");
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
            Save Faculty
          </button>
        </div>
      </div>

      {errorMessage !== "" && (
        <div className="fixed right-5 top-5 z-50 rounded-lg bg-red-600 px-6 py-4 text-white shadow-xl">
          {errorMessage}
        </div>
      )}

      {successMessage !== "" && (
        <div className="fixed right-5 top-5 z-50 rounded-lg bg-green-600 px-6 py-4 text-white shadow-xl">
          {successMessage}
        </div>
      )}
    </main>
  );
}

export default AddFaculty;