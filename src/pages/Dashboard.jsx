import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl p-8 text-white shadow-lg mb-8">

        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome Back, Ahmed 👋
        </h1>

        <p className="mt-2 text-green-50 text-lg">
          Manage students, attendance, courses and faculty from one place.
        </p>

        <div className="flex flex-wrap gap-4 mt-6">

          <Link
            to="/students/add"
            className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            ➕ Add Student
          </Link>

          <Link
            to="/students"
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-green-700 transition"
          >
            👨‍🎓 View Students
          </Link>

        </div>

      </div>


      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        {/* Students */}
        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6 hover:shadow-lg transition">

          <div className="flex justify-between items-start">

            <div>
              <p className="text-gray-500 font-medium">
                Total Students
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                1250
              </h2>
            </div>

            <div className="text-4xl">
              👨‍🎓
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Total Registered Students
          </p>

        </div>


        {/* Faculty */}
        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6 hover:shadow-lg transition">

          <div className="flex justify-between items-start">

            <div>
              <p className="flex items-center text-gray-500 font-medium">
                Faculty Members
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                245
              </h2>
            </div>

            <div className="text-4xl">
              👩‍🏫
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Total Faculty
          </p>

        </div>


        {/* Courses */}
        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6 hover:shadow-lg transition">

          <div className="flex justify-between items-start">

            <div>
              <p className="text-gray-500 font-medium">
                Courses Offered
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                22
              </h2>
            </div>

            <div className="text-4xl">
              📚
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Total Available Courses
          </p>

        </div>


        {/* Attendance */}
        <div className="bg-white rounded-xl shadow-md border border-green-200 p-6 hover:shadow-lg transition">

          <div className="flex justify-between items-start">

            <div>
              <p className="text-gray-500 font-medium">
                Attendance
              </p>

              <h2 className="text-3xl font-bold text-gray-800 mt-2">
                92%
              </h2>
            </div>

            <div className="text-4xl">
              🕒
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-4">
            Overall Attendance Rate
          </p>

        </div>

      </div>


      {/* Recent Activity + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">

          <div className="bg-green-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">
              Recent Activity
            </h2>
          </div>

          <div className="divide-y">

            <div className="px-6 py-4 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">
                👨‍🎓 Student Registration
              </p>

              <p className="text-sm text-gray-500 mt-1">
                A new student was registered in the system.
              </p>
            </div>

            <div className="px-6 py-4 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">
                📚 New Course Added
              </p>

              <p className="text-sm text-gray-500 mt-1">
                A new course was added to the course catalog.
              </p>
            </div>

            <div className="px-6 py-4 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">
                🧑‍🏫 Faculty Profile Updated
              </p>

              <p className="text-sm text-gray-500 mt-1">
                A faculty member's information was updated.
              </p>
            </div>

            <div className="px-6 py-4 hover:bg-gray-50 transition">
              <p className="font-medium text-gray-800">
                📝 Attendance Marked
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Attendance was recorded for a class.
              </p>
            </div>

          </div>

        </div>


        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">

          <div className="bg-green-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">
              Quick Actions
            </h2>
          </div>

          <div className="p-6 space-y-4">

            <Link
              to="/students/add"
              className="block w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              👤 Add Student
            </Link>

            <Link
              to="/students"
              className="block w-full text-center bg-yellow-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              ✏️ Manage Students
            </Link>

            <Link
              to="/students"
              className="block w-full text-center bg-cyan-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition"
            >
              🔍 Search Students
            </Link>

            <Link
              to="/students"
              className="block w-full text-center bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              🗑️ Manage Students
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Dashboard;