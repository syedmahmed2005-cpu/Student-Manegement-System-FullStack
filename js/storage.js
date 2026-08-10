function getStudents() {

    return JSON.parse(
        localStorage.getItem("students")
    ) || [];

}

function saveStudents(students) {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}
function getFaculty() {

    return JSON.parse(
        localStorage.getItem("faculty")
    ) || [];

}

function saveFaculty(faculty) {

    localStorage.setItem(
        "faculty",
        JSON.stringify(faculty)
    );

}