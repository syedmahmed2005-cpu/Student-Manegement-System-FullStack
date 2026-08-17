function ViewStudent({ student, setPage }) {
  if (!student) {
    return (
      <main className="p-5">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Student not found
          </h1>

          <button
            onClick={function () {
              setPage("students");
            }}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Back to Students
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-5">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">
        <h1 className="text-4xl font-bold">
          👨‍🎓 Student Details
        </h1>

        <p className="mt-2 text-green-100">
          View complete information about this student.
        </p>
      </div>

      {/* Student Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Card Header */}
        <div className="bg-green-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">
            🎓 {student.firstName} {student.lastName}
          </h2>
        </div>

        {/* Student Information */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <p className="text-sm text-gray-500">Student ID</p>
              <p className="font-semibold text-gray-800">
                {student.studentId}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold text-green-600">
                {student.status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">First Name</p>
              <p className="font-semibold text-gray-800">
                {student.firstName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              <p className="font-semibold text-gray-800">
                {student.lastName}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-semibold text-gray-800">
                {student.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold text-gray-800">
                {student.phoneNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Roll Number</p>
              <p className="font-semibold text-gray-800">
                {student.rollNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Registration Number</p>
              <p className="font-semibold text-gray-800">
                {student.registrationNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="font-semibold text-gray-800">
                {student.gender || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-semibold text-gray-800">
                {student.dob || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Semester</p>
              <p className="font-semibold text-gray-800">
                {student.semester || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p className="font-semibold text-gray-800">
                {student.department || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">City</p>
              <p className="font-semibold text-gray-800">
                {student.city || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="font-semibold text-gray-800">
                {student.country || "Not provided"}
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mt-6">
            <p className="text-sm text-gray-500">Address</p>
            <p className="font-semibold text-gray-800">
              {student.address || "Not provided"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={function () {
                setPage("students");
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
            >
              ← Back to Students
            </button>

            <button
              onClick={function () {
                setPage("edit");
              }}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
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