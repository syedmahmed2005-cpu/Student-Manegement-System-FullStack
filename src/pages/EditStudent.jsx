import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(function () {
    async function fetchStudent() {
      try {
        const response = await fetch(
          "http://localhost:5000/api/students/" + studentId
        );

        const data = await response.json();

        if (!response.ok) {
          setErrorMessage(data.message || "Student not found.");
          return;
        }

        setFormData({
          firstName: data.student.firstName || "",
          lastName: data.student.lastName || "",
          batchId: data.student.batchId || "",
          email: data.student.email || "",
          phoneNumber: data.student.phoneNumber || "",
          rollNumber: data.student.rollNumber || "",
          registrationNumber: data.student.registrationNumber || "",
          gender: data.student.gender || "",
          dob: data.student.dob
            ? data.student.dob.substring(0, 10)
            : "",
          department: data.student.department || "",
          city: data.student.city || "",
          country: data.student.country || "",
          address: data.student.address || "",
        });
      } catch (error) {
        console.log(error);
        setErrorMessage("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [studentId]);

  async function handleUpdate() {
    try {
      const response = await fetch(
        "/api/students/" + studentId,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.message || "Failed to update student.");
        return;
      }

      setSuccessMessage("Student updated successfully!");

      setTimeout(function () {
        navigate("/students");
      }, 1000);
    } catch (error) {
      console.log(error);
      setErrorMessage("Unable to connect to the server.");
    }
  }

  if (loading) {
    return (
      <main className="p-5">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          Loading student...
        </div>
      </main>
    );
  }

  if (errorMessage !== "") {
    return (
      <main className="p-5">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Unable to edit student
          </h1>
          <p className="text-gray-500 mt-2">{errorMessage}</p>
          <button
            onClick={function () {
              navigate("/students");
            }}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Students
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">✏️ Edit Student</h1>

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
            <label className="text-sm font-medium text-gray-700">
              📧 Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  email: event.target.value,
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              📞 Phone Number
            </label>
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  phoneNumber: event.target.value,
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              🆔 Registration Number
            </label>
            <input
              type="text"
              value={formData.registrationNumber}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  registrationNumber: event.target.value,
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
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
            <label className="text-sm font-medium text-gray-700">
              Batch
            </label>
            <input
              type="text"
              value={formData.batchId}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  batchId: event.target.value,
                });
              }}
              className="w-full border border-gray-300 rounded-[15px] px-4 py-2 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              🏢 Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  department: event.target.value,
                });
              }}
              className="w-full border border-gray-300 rounded-[15px] px-4 py-2 mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              ⚧ Gender
            </label>

            <div className="space-y-2 mt-3">
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
                />
                Others
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              📅 Date of Birth
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  dob: event.target.value,
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              📍 City
            </label>

            <select
              value={formData.city}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  city: event.target.value,
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
            >
              <option value="">Select City</option>
              <option value="Islamabad">Islamabad</option>
              <option value="Lahore">Lahore</option>
              <option value="Faisalabad">Faisalabad</option>
              <option value="Multan">Multan</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              🌍 Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={function (event) {
                setFormData({
                  ...formData,
                  country: event.target.value,
                });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">
            🏠 Address
          </label>

          <input
            type="text"
            value={formData.address}
            onChange={function (event) {
              setFormData({
                ...formData,
                address: event.target.value,
              });
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg mt-2"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={handleUpdate}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Save Changes
          </button>
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

export default EditStudent;
