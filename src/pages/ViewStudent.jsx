import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

function ViewStudent() {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
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

          setStudent(data.student);
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

  if (loading) {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-100 border-t-green-600 dark:border-green-950 dark:border-t-green-400" />

          <h1 className="text-xl font-bold text-app-text">
            Loading student...
          </h1>
        </div>
      </main>
    );
  }

  if (!student) {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-app-text">
            Student not found
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

  const detailItems = [
    [
      "Student ID",
      student.studentId || student._id
    ],
    ["Status", student.status || "active"],
    ["First Name", student.firstName],
    ["Last Name", student.lastName],
    ["Email", student.email],
    ["Phone Number", student.phoneNumber],
    ["Roll Number", student.rollNumber],
    [
      "Registration Number",
      student.registrationNumber
    ],
    ["Batch", student.batchId],
    ["Gender", student.gender || "Not provided"],
    [
      "Date of Birth",
      student.dob
        ? new Date(
            student.dob
          ).toLocaleDateString()
        : "Not provided"
    ],
    [
      "Department",
      student.department || "Not provided"
    ],
    ["City", student.city || "Not provided"],
    [
      "Country",
      student.country || "Not provided"
    ]
  ];

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          👨‍🎓 Student Details
        </h1>

        <p className="mt-2 text-green-100">
          View complete information about this student.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        <div className="bg-green-600 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold">
            🎓 {student.firstName}{" "}
            {student.lastName}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {detailItems.map(function (item) {
              const isStatus =
                item[0] === "Status";

              return (
                <div
                  key={item[0]}
                  className="rounded-xl border border-app-border bg-app-surface-soft p-4"
                >
                  <p className="text-sm text-app-text-muted">
                    {item[0]}
                  </p>

                  <p
                    className={
                      "mt-1 break-words font-semibold " +
                      (isStatus
                        ? "capitalize text-green-600 dark:text-green-400"
                        : "text-app-text")
                    }
                  >
                    {item[1]}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-app-border bg-app-surface-soft p-4">
            <p className="text-sm text-app-text-muted">
              Address
            </p>

            <p className="mt-1 break-words font-semibold text-app-text">
              {student.address || "Not provided"}
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={function () {
                navigate("/students");
              }}
              className="rounded-lg border border-app-border bg-app-surface-soft px-6 py-3 font-semibold text-app-text transition hover:border-green-300 dark:hover:border-green-800"
            >
              ← Back to Students
            </button>

            <button
              type="button"
              onClick={function () {
                navigate(
                  "/students/" +
                    student._id +
                    "/edit",
                  {
                    state: {
                      student
                    }
                  }
                );
              }}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              ✏️ Edit Student
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewStudent;