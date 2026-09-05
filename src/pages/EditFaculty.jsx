import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

function EditFaculty() {
  const { facultyId } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");
  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(
    function () {
      async function fetchFaculty() {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}`,
            {
              credentials: "include"
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setErrorMessage(
              data.message ||
                "Faculty member not found."
            );
            return;
          }

          setFormData({
            facultyId:
              data.faculty.facultyId || "",
            firstName:
              data.faculty.firstName || "",
            lastName:
              data.faculty.lastName || "",
            email: data.faculty.email || "",
            phoneNumber:
              data.faculty.phoneNumber || "",
            department:
              data.faculty.department || "",
            designation:
              data.faculty.designation || "",
            qualification:
              data.faculty.qualification || "",
            joiningDate:
              data.faculty.joiningDate
                ? data.faculty.joiningDate.substring(
                    0,
                    10
                  )
                : "",
            city: data.faculty.city || "",
            country:
              data.faculty.country || "",
            address:
              data.faculty.address || ""
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

      fetchFaculty();
    },
    [facultyId]
  );

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  async function handleUpdate() {
    try {
      setErrorMessage("");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}`,
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
            "Failed to update faculty member."
        );
        return;
      }

      setSuccessMessage(
        "Faculty member updated successfully!"
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

  const fields = [
    ["facultyId", "Faculty ID", "text"],
    ["firstName", "First Name", "text"],
    ["lastName", "Last Name", "text"],
    ["email", "Email", "email"],
    ["phoneNumber", "Phone Number", "tel"],
    ["qualification", "Qualification", "text"],
    ["joiningDate", "Joining Date", "date"],
    ["city", "City", "text"],
    ["country", "Country", "text"]
  ];

  const inputClass =
    "w-full rounded-lg border border-app-border bg-app-surface-soft px-4 py-3 text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50";

  const labelClass =
    "mb-2 block font-semibold text-app-text";

  if (loading) {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <p className="text-app-text-muted">
            Loading faculty member...
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
            Unable to edit faculty member
          </h1>

          <p className="mt-2 text-app-text-muted">
            {errorMessage}
          </p>

          <button
            type="button"
            onClick={function () {
              navigate("/faculty");
            }}
            className="mt-6 rounded-lg bg-green-600 px-6 py-2 text-white transition hover:bg-green-700"
          >
            Back to Faculty
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          ✏️ Edit Faculty
        </h1>

        <p className="mt-2 text-green-100">
          Update faculty member information.
        </p>
      </div>

      <div className="rounded-xl border border-app-border bg-app-surface p-6 shadow-lg sm:p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-app-text">
            Faculty Information
          </h2>

          <p className="mt-1 text-sm text-app-text-muted">
            Update the required information and save
            your changes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {fields.map(function (field) {
            return (
              <div key={field[0]}>
                <label className={labelClass}>
                  {field[1]}
                </label>

                <input
                  type={field[2]}
                  name={field[0]}
                  value={formData[field[0]]}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            );
          })}

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
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
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

export default EditFaculty;