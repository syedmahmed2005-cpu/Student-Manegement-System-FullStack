import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams
} from "react-router-dom";

function ViewFaculty() {
  const { facultyId } = useParams();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
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

          setFaculty(data.faculty);
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

  if (!faculty) {
    return (
      <main className="min-h-screen bg-app-background p-5">
        <div className="rounded-xl border border-app-border bg-app-surface p-8 text-center shadow-lg">
          <h1 className="text-2xl font-bold text-app-text">
            Faculty member not found
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

  const details = [
    ["Faculty ID", faculty.facultyId],
    ["Status", faculty.status || "active"],
    ["First Name", faculty.firstName],
    ["Last Name", faculty.lastName],
    ["Email", faculty.email],
    ["Phone Number", faculty.phoneNumber],
    ["Department", faculty.department],
    ["Designation", faculty.designation],
    ["Qualification", faculty.qualification],
    [
      "Joining Date",
      faculty.joiningDate
        ? new Date(
            faculty.joiningDate
          ).toLocaleDateString()
        : "Not provided"
    ],
    ["City", faculty.city || "Not provided"],
    [
      "Country",
      faculty.country || "Not provided"
    ]
  ];

  return (
    <main className="min-h-screen bg-app-background p-5 transition-colors duration-200">
      <div className="mb-8 rounded-2xl bg-gradient-to-r from-green-700 to-green-500 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold sm:text-4xl">
          👨‍🏫 Faculty Details
        </h1>

        <p className="mt-2 text-green-100">
          View complete information about this faculty
          member.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-lg">
        <div className="bg-green-600 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold">
            🎓 {faculty.firstName}{" "}
            {faculty.lastName}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {details.map(function (detail) {
              const isStatus =
                detail[0] === "Status";

              return (
                <div
                  key={detail[0]}
                  className="rounded-xl border border-app-border bg-app-surface-soft p-4"
                >
                  <p className="text-sm text-app-text-muted">
                    {detail[0]}
                  </p>

                  <p
                    className={
                      "mt-1 break-words font-semibold " +
                      (isStatus
                        ? "capitalize text-green-600 dark:text-green-400"
                        : "text-app-text")
                    }
                  >
                    {detail[1]}
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
              {faculty.address || "Not provided"}
            </p>
          </div>

          <div className="mt-8 flex flex-col-reverse justify-between gap-3 sm:flex-row">
            <button
              type="button"
              onClick={function () {
                navigate("/faculty");
              }}
              className="rounded-lg border border-app-border bg-app-surface-soft px-6 py-3 font-semibold text-app-text transition hover:border-green-300 dark:hover:border-green-800"
            >
              ← Back to Faculty
            </button>

            <button
              type="button"
              onClick={function () {
                navigate(
                  "/faculty/" +
                    faculty._id +
                    "/edit"
                );
              }}
              className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              ✏️ Edit Faculty
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ViewFaculty;