import { useEffect,useState } from 'react';
import { useNavigate } from "react-router-dom";
import {getStudents} from '../utils/storage.js';
function Students({students, setStudents, setPage, setSelectedStudent }) {
  const [searchText, setSearchText]= useState("");
  const [deleteIndex, setDeleteIndex] = useState(null);
  const navigate = useNavigate();
  useEffect(function () {
  setStudents(getStudents());
}, []);
  return (
    <main className="p-5">
      <div className="bg-linear-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8">

  <div className="flex justify-between items-center">

    <div>
      <h1 className="text-4xl font-bold">
        👨‍🎓 View Students
      </h1>

      <p className="mt-2 text-green-100">
        Manage all registered students in the system.
      </p>
    </div>

    <button
      onClick={function () {
        setPage("addStudent");
      }}
      className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition"
    >
      + Add Student
    </button>
    <button
    type="button"
    onClick={function () {
    setPage("enrollStudent");
    }}
    className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold"
    >
    + Enroll Student
    </button>

  </div>

</div>
        <div className="bg-white rounded-xl shadow-lg p-6 mt-5">
            <label
            htmlFor="search"
            className="text-sm font-medium text-gray-700 mb-2"
            >
            Search Students
            </label>

            <input
            id="search"
            type="text"
            placeholder="Search students..."
            value={searchText}
            onChange={function (event) {
                setSearchText(event.target.value);
            }}
            className="w-full border border-gray-300 rounded-[15px] px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            </div>
      <div className="bg-white rounded-xl shadow-lg mt-8 overflow-hidden">
        <div className="px-6 py-4">
          <div className="text-xl font-semibold text-green-600">Student Records</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Student</th>
                <th className="px-6 py-3 text-left">Roll No</th>
                <th className="px-6 py-3 text-left">Department</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
                
              </tr>
            </thead>

            <tbody>
              {students.filter(function (student) {
               const fullName = student.firstName + " " + student.lastName;
               const matchesSearch = fullName
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                    student.rollNumber
                    .toLowerCase()
                    .includes(searchText.toLowerCase());

                    return matchesSearch;})
                .map(function (student) {
                return (
                  <tr
                    key={student.studentId}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="px-6 py-4 font-medium">
                      {student.firstName} {student.lastName}
                    </td>

                    <td className="px-6 py-4">
                      {student.rollNumber}
                    </td>

                    <td className="px-6 py-4">
                      {student.department}
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 mb-2"
                    onClick={function () {
                        setSelectedStudent(student);
                        setPage("edit");
                    }} >
                        Edit
                    </button>

                    <button className="bg-red-500 text-white px-3 py-1 rounded mb-2"
                    onClick={function () {
                        const index = students.indexOf(student);
                        setDeleteIndex(index);}}>
                        Delete
                    </button>
                    <button
                    onClick={function () {
                        navigate("/students/" + student.studentId); }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700 transition">
                          View
                        </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {deleteIndex !== null && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-25 p-6">
      <h2 className="text-xl font-bold mb-3">
        Delete Student
      </h2>

      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this student?
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded-lg border border-gray-300"
          onClick={function () {
            setDeleteIndex(null);
          }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white"
          onClick={function () {
            const updatedStudents = students.filter(
              function (student, index) {
                return index !== deleteIndex;
              }
            );

            setStudents(updatedStudents);
            setDeleteIndex(null);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  );
}

export default Students;