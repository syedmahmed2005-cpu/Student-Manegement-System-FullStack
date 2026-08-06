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