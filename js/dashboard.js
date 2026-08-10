console.log("Dashboard JS loaded");
const students = getStudents();
const studentCount = document.getElementById("studentCount");
studentCount.textContent = students.length;
const facultyCount = document.getElementById("facultyCount");
const faculty = getFaculty();
facultyCount.textContent = faculty.length;