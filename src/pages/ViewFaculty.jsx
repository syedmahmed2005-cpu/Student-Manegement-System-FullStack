function ViewFaculty({ faculty, setPage }) {
  if (!faculty) {
    return (
      <main className="p-5">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Faculty member not found
          </h1>

          <button
            onClick={function () {
              setPage("faculty");
            }}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Faculty
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5">
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">👨‍🏫 Faculty Details</h1>

        <p className="mt-2 text-green-100">
          View complete information about this faculty member.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">
            🎓 {faculty.firstName} {faculty.lastName}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">Faculty ID</p>
              <p className="font-semibold text-gray-800">
                {faculty.facultyId}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-green-600">
                {faculty.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-semibold text-gray-800">
                {faculty.firstName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-semibold text-gray-800">
                {faculty.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">
                {faculty.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold text-gray-800">
                {faculty.phoneNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold text-gray-800">
                {faculty.department}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Designation</p>
              <p className="font-semibold text-gray-800">
                {faculty.designation}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Qualification</p>
              <p className="font-semibold text-gray-800">
                {faculty.qualification}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Joining Date</p>
              <p className="font-semibold text-gray-800">
                {faculty.joiningDate}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-semibold text-gray-800">
                {faculty.city || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-semibold text-gray-800">
                {faculty.country || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-gray-800">
              {faculty.address || "Not provided"}
            </p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={function () {
                setPage("faculty");
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600"
            >
              ← Back to Faculty
            </button>

            <button
              onClick={function () {
                setPage("editFaculty");
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
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