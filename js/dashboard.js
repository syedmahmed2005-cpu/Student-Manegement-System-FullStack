console.log("Dashboard JS loaded");
const students = getStudents();
const studentCount = document.getElementById("studentCount");
studentCount.textContent = students.length;