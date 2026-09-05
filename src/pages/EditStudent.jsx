import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

function EditStudent() {
  const navigate = useNavigate();
  const { studentId } = useParams();

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

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(
    function () {
      async function fetchStudent() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/students/${studentId}`,
            {
              credentials: "include"
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message || "Student not found."
            );
            return;
          }

          setFormData({
            firstName:
              data.student.firstName || "",
            lastName:
              data.student.lastName || "",
            batchId:
              data.student.batchId || "",
            email: data.student.email || "",
            phoneNumber:
              data.student.phoneNumber || "",
            rollNumber:
              data.student.rollNumber || "",
            registrationNumber:
              data.student.registrationNumber || "",
            gender: data.student.gender || "",
            dob: data.student.dob
              ? data.student.dob.substring(0, 10)
              : "",
            department:
              data.student.department || "",
            city: data.student.city || "",
            country:
              data.student.country || "",
            address:
              data.student.address || ""
          });
        } catch (error) {
          console.log(error);

          setErrorMessage(
            "Unable to connect to the server."
          );
        } finally {
          setLoading(false);
        }
      }

      fetchStudent();
    },
    [studentId]
  );

  function updateField(field, value) {
    setFormData(function (currentData) {
      return {
        ...currentData,
        [field]: value
      };
    });
  }

  async function handleUpdate() {
    try {
      setErrorMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/students/${studentId}`,
        {
          method: "PUT",
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
            "Failed to update student."
        );
        return;
      }

      setSuccessMessage(
        "Student updated successfully!"
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

  const inputClass =
    "mt-2 w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  const labelClass =
    "text-sm font-medium text-app-text";

  if (loading) {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <p className="text-app-text-muted">
            Loading student...
          </p>
        </div>
      </main>
    );
  }

  if (errorMessage !== "") {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-app-text">
            Unable to edit student
          </h1>

          <p className="mt-2 text-app-text-muted">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={function () {
              navigate("/students");
            }}
            className="mt-6 rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
          >
            Back to Students
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          ✏️ Edit Student
        </h1>

        <p className="mt-2 text-green-100">
          Update student information.
        </p>
      </div>

      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className={labelClass}>
              First Name
            </label>

            <input
              type="text"
              value={formData.firstName}
              onChange={function (event) {
                updateField(
                  "firstName",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Last Name
            </label>

            <input
              type="text"
              value={formData.lastName}
              onChange={function (event) {
                updateField(
                  "lastName",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              📧 Email
            </label>

            <input
              type="email"
              value={formData.email}
              onChange={function (event) {
                updateField(
                  "email",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              📞 Phone Number
            </label>

            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={function (event) {
                updateField(
                  "phoneNumber",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              🆔 Registration Number
            </label>

            <input
              type="text"
              value={formData.registrationNumber}
              onChange={function (event) {
                updateField(
                  "registrationNumber",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Roll Number
            </label>

            <input
              type="text"
              value={formData.rollNumber}
              onChange={function (event) {
                updateField(
                  "rollNumber",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Batch
            </label>

            <input
              type="text"
              value={formData.batchId}
              onChange={function (event) {
                updateField(
                  "batchId",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              🏢 Department
            </label>

            <input
              type="text"
              value={formData.department}
              onChange={function (event) {
                updateField(
                  "department",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              ⚧ Gender
            </label>

            <div className="mt-3 space-y-2 text-app-text">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={
                    formData.gender === "Male"
                  }
                  onChange={function (event) {
                    updateField(
                      "gender",
                      event.target.value
                    );
                  }}
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
                  onChange={function (event) {
                    updateField(
                      "gender",
                      event.target.value
                    );
                  }}
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
                  onChange={function (event) {
                    updateField(
                      "gender",
                      event.target.value
                    );
                  }}
                  className="h-4 min-h-0 w-4 accent-green-600"
                />
                Others
              </label>
            </div>
          </div>

          <div>
            <label className={labelClass}>
              📅 Date of Birth
            </label>

            <input
              type="date"
              value={formData.dob}
              onChange={function (event) {
                updateField(
                  "dob",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              📍 City
            </label>

            <select
              value={formData.city}
              onChange={function (event) {
                updateField(
                  "city",
                  event.target.value
                );
              }}
              className={inputClass}
            >
              <option value="">Select City</option>
              <option value="Islamabad">
                Islamabad
              </option>
              <option value="Lahore">Lahore</option>
              <option value="Faisalabad">
                Faisalabad
              </option>
              <option value="Multan">Multan</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              🌍 Country
            </label>

            <input
              type="text"
              value={formData.country}
              onChange={function (event) {
                updateField(
                  "country",
                  event.target.value
                );
              }}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6">
          <label className={labelClass}>
            🏠 Address
          </label>

          <input
            type="text"
            value={formData.address}
            onChange={function (event) {
              updateField(
                "address",
                event.target.value
              );
            }}
            className={inputClass}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleUpdate}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            Save Changes
          </button>
        </div>
      </div>

      {successMessage !== "" && (
        <div className="fixed right-5 top-5 z-50 rounded-lg bg-green-600 px-6 py-4 text-white shadow-xl">
          {successMessage}
        </div>
      )}
    </main>
  );
}

export default EditStudent;