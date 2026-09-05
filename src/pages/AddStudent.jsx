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
    address: ""
  });

  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(
    function () {
      if (errorMessage !== "") {
        const timer = setTimeout(function () {
          setErrorMessage("");
        }, 3000);

        return function () {
          clearTimeout(timer);
        };
      }
    },
    [errorMessage]
  );

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
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
      setErrorMessage(
        "Please fill all required fields."
      );
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.message ||
            "Failed to save student."
        );
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
        address: ""
      });

      setSuccessMessage(
        "Student saved successfully!"
      );

      setTimeout(function () {
        navigate("/students");
      }, 1000);
    } catch (error) {
      console.log(error);

      setErrorMessage(
        "Unable to connect to the server."
      );
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
      address: ""
    });
  }

  const inputClass =
    "w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  const labelClass =
    "mb-2 block text-sm font-medium text-app-text";

  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-app-background px-6 py-8 transition-colors duration-200">
      <div className="mb-8">
        <h1 className="flex items-center text-3xl font-bold text-green-700 dark:text-green-400">
          <span className="mr-3">➕</span>
          Add Student
        </h1>

        <p className="mt-2 text-app-text-muted">
          Fill in the details below to add a new
          student.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        <div className="bg-green-600 px-6 py-4 text-white">
          <h2 className="flex items-center text-xl font-semibold">
            <span className="mr-3">🎓</span>
            Student Information
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  👤 First Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="firstName"
                  type="text"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  👤 Last Name{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="lastName"
                  type="text"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  📧 Email{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  📞 Phone Number{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  ⚧ Gender{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <div className="space-y-2 text-app-text">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={
                        formData.gender === "Male"
                      }
                      onChange={handleChange}
                      className="h-4 min-h-0 w-4 accent-green-600"
                    />
                    Male
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={
                        formData.gender === "Female"
                      }
                      onChange={handleChange}
                      className="h-4 min-h-0 w-4 accent-green-600"
                    />
                    Female
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="gender"
                      value="Other"
                      checked={
                        formData.gender === "Other"
                      }
                      onChange={handleChange}
                      className="h-4 min-h-0 w-4 accent-green-600"
                    />
                    Others
                  </label>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  📅 Date of Birth{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Batch{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="batchId"
                  type="text"
                  value={formData.batchId}
                  onChange={handleChange}
                  placeholder="e.g. FA24"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  🏢 Department{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="department"
                  type="text"
                  placeholder="Enter your department"
                  value={formData.department}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  📍 City{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="" disabled>
                    Select City
                  </option>

                  <option value="Islamabad">
                    Islamabad
                  </option>

                  <option value="Lahore">
                    Lahore
                  </option>

                  <option value="Faisalabad">
                    Faisalabad
                  </option>

                  <option value="Multan">
                    Multan
                  </option>
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  🌍 Country{" "}
                  <span className="text-red-500">
                    *
                  </span>
                </label>

                <input
                  name="country"
                  type="text"
                  placeholder="Enter your country"
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>
                🏠 Address{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Save Student
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-white transition hover:bg-yellow-600"
              >
                Reset
              </button>
            </div>
          </form>
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

export default AddStudent;