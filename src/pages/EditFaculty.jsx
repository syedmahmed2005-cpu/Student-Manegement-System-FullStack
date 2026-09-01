import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditFaculty() {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ facultyId: "", firstName: "", lastName: "", email: "", phoneNumber: "", department: "", designation: "", qualification: "", joiningDate: "", city: "", country: "", address: "" });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(function () {
    async function fetchFaculty() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/faculty/${facultyId}`);
        const data = await response.json();
        if (!response.ok) { setErrorMessage(data.message || "Faculty member not found."); return; }
        setFormData({ facultyId: data.faculty.facultyId || "", firstName: data.faculty.firstName || "", lastName: data.faculty.lastName || "", email: data.faculty.email || "", phoneNumber: data.faculty.phoneNumber || "", department: data.faculty.department || "", designation: data.faculty.designation || "", qualification: data.faculty.qualification || "", joiningDate: data.faculty.joiningDate ? data.faculty.joiningDate.substring(0, 10) : "", city: data.faculty.city || "", country: data.faculty.country || "", address: data.faculty.address || "" });
      } catch (error) { console.log(error); setErrorMessage("Unable to connect to the server."); }
      finally { setLoading(false); }
    }
    fetchFaculty();
  }, [facultyId]);

  function handleChange(event) { setFormData({ ...formData, [event.target.name]: event.target.value }); }
  async function handleUpdate() {
    try {
      const response = await fetch("/api/faculty/" + facultyId, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
      const data = await response.json();
      if (!response.ok) { setErrorMessage(data.message || "Failed to update faculty member."); return; }
      setSuccessMessage("Faculty member updated successfully!");
      setTimeout(function () { navigate("/faculty"); }, 1000);
    } catch (error) { console.log(error); setErrorMessage("Unable to connect to the server."); }
  }

  if (loading) return <main className="p-5"><div className="bg-white rounded-xl shadow-lg p-8 text-center">Loading faculty member...</div></main>;
  if (errorMessage !== "") return <main className="p-5"><div className="bg-white rounded-xl shadow-lg p-8 text-center"><h1 className="text-2xl font-bold text-gray-800">Unable to edit faculty member</h1><p className="text-gray-500 mt-2">{errorMessage}</p><button onClick={function () { navigate("/faculty"); }} className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg">Back to Faculty</button></div></main>;

  const fields = [["facultyId", "Faculty ID", "text"], ["firstName", "First Name", "text"], ["lastName", "Last Name", "text"], ["email", "Email", "email"], ["phoneNumber", "Phone Number", "tel"], ["qualification", "Qualification", "text"], ["joiningDate", "Joining Date", "date"], ["city", "City", "text"], ["country", "Country", "text"]];
  return <main className="p-5"><div className="bg-gradient-to-r from-green-700 to-green-500 rounded-2xl shadow-lg p-8 text-white mb-8"><h1 className="text-4xl font-bold">✏️ Edit Faculty</h1><p className="mt-2 text-green-100">Update faculty member information.</p></div><div className="bg-white rounded-xl shadow-lg p-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{fields.map(function (field) { return <div key={field[0]}><label className="block font-semibold mb-2">{field[1]}</label><input type={field[2]} name={field[0]} value={formData[field[0]]} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" /></div>; })}<div><label className="block font-semibold mb-2">Department</label><select name="department" value={formData.department} onChange={handleChange} className="w-full border rounded-lg px-4 py-2"><option value="">Select Department</option><option value="Computer Science">Computer Science</option><option value="Software Engineering">Software Engineering</option><option value="Information Technology">Information Technology</option><option value="Electrical Engineering">Electrical Engineering</option></select></div><div><label className="block font-semibold mb-2">Designation</label><select name="designation" value={formData.designation} onChange={handleChange} className="w-full border rounded-lg px-4 py-2"><option value="">Select Designation</option><option value="Professor">Professor</option><option value="Associate Professor">Associate Professor</option><option value="Assistant Professor">Assistant Professor</option><option value="Lecturer">Lecturer</option></select></div><div className="md:col-span-2"><label className="block font-semibold mb-2">Address</label><textarea name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-lg px-4 py-2" rows="3" /></div></div><div className="flex justify-between mt-8"><button onClick={handleUpdate} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Save Changes</button></div></div>{successMessage !== "" && <div className="fixed top-5 right-5 bg-green-600 text-white px-6 py-4 rounded-lg shadow-xl z-50">{successMessage}</div>}</main>;
}

export default EditFaculty;
