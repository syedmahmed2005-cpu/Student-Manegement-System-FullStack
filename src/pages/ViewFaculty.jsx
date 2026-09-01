import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ViewFaculty() {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [faculty, setFaculty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(function () {
    async function fetchFaculty() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}`);
        const data = await response.json();
        if (!response.ok) { setErrorMessage(data.message || "Faculty member not found."); return; }
        setFaculty(data.faculty);
      } catch (error) { console.log(error); setErrorMessage("Unable to connect to the server."); }
      finally { setLoading(false); }
    }
    fetchFaculty();
  }, [facultyId]);

  if (loading) return <main className="p-5"><div className="bg-white rounded-xl shadow-lg p-8 text-center">Loading faculty member...</div></main>;
  if (!faculty) return <main className="p-5"><div className="bg-white rounded-xl shadow-lg p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Faculty member not found</h1><p className="text-gray-500 mt-2">{errorMessage}</p><button onClick={function () { navigate("/faculty"); }} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg">Back to Faculty</button></div></main>;

  const details = [["Faculty ID", faculty.facultyId], ["Status", faculty.status || "active"], ["First Name", faculty.firstName], ["Last Name", faculty.lastName], ["Email", faculty.email], ["Phone Number", faculty.phoneNumber], ["Department", faculty.department], ["Designation", faculty.designation], ["Qualification", faculty.qualification], ["Joining Date", faculty.joiningDate ? new Date(faculty.joiningDate).toLocaleDateString() : "Not provided"], ["City", faculty.city || "Not provided"], ["Country", faculty.country || "Not provided"]];
  return <main className="p-5"><div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8"><h1 className="text-4xl font-bold">👨‍🏫 Faculty Details</h1><p className="mt-2 text-green-100">View complete information about this faculty member.</p></div><div className="bg-white rounded-xl shadow-lg overflow-hidden"><div className="bg-green-600 text-white px-6 py-4"><h2 className="text-xl font-semibold">🎓 {faculty.firstName} {faculty.lastName}</h2></div><div className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{details.map(function (detail) { return <div key={detail[0]}><p className="text-sm text-gray-500">{detail[0]}</p><p className="font-semibold text-gray-800">{detail[1]}</p></div>; })}</div><div className="mt-6"><p className="text-sm text-gray-500">Address</p><p className="font-semibold text-gray-800">{faculty.address || "Not provided"}</p></div><div className="flex justify-between mt-8"><button onClick={function () { navigate("/faculty"); }} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition">← Back to Faculty</button><button onClick={function () { navigate("/faculty/" + faculty._id + "/edit"); }} className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">✏️ Edit Faculty</button></div></div></div></main>;
}

export default ViewFaculty;
