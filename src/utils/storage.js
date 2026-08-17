export function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

export function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

export function getFaculty() {
  return JSON.parse(localStorage.getItem("faculty")) || [];
}

export function saveFaculty(faculty) {
  localStorage.setItem("faculty", JSON.stringify(faculty));
}