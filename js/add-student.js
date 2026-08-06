let students=getStudents();
let editIndex=localStorage.getItem("editIndex");
const firstNameInput = document.getElementById("firstName");
if (editIndex !== null && firstNameInput) {
    const student=students[editIndex];
    document.getElementById("firstName").value=student.firstName;
    document.getElementById("lastName").value=student.lastName;
    document.getElementById("email").value=student.email;
    document.getElementById("phoneNumber").value=student.phoneNumber;
    document.getElementById("rollNumber").value=student.rollNumber;
    document.getElementById("registrationNumber").value=student.registrationNumber;
    document.getElementById("dob").value=student.dob;
    document.getElementById("semester").value=student.semester;
    document.getElementById("department").value=student.department;
    document.getElementById("city").value=student.city;
    document.getElementById("country").value=student.country;
    document.getElementById("address").value=student.address;
    document.querySelector(`input[name="gender"][value="${student.gender}"]`).checked = true;
}





// Get the Save button
const saveButton = document.getElementById("saveStudentBtn");

// Listen for click
if (saveButton) {
    saveButton.addEventListener("click", function () {
    console.log("Button Clicked");
    // Get all input fields
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const rollNumber = document.getElementById("rollNumber").value;
    const registrationNumber = document.getElementById("registrationNumber").value;
    const dob = document.getElementById("dob").value;
    const semester = document.getElementById("semester").value;
    const department = document.getElementById("department").value;
    const city = document.getElementById("city").value;
    const country = document.getElementById("country").value;
    const address = document.getElementById("address").value;
    if (!firstName || !lastName || !email || !phoneNumber || !rollNumber || !registrationNumber){
        showToast("toast","Please fill in all required fields.","error");
        return; // Stop further execution if required fields are empty
    }


    // 3. Create the object
const student = {

    firstName,
    lastName,
    email,
    phoneNumber,
    rollNumber,
    registrationNumber,
    gender,
    dob,
    semester,
    department,
    city,
    country,
    address,
    status: "active"

};
if (editIndex !== null) {

    // Update existing student
    students[editIndex] = student;

} else {

    // Add new student
    students.push(student);

}
saveStudents(students);

if (editIndex !== null) {

    showToast(
        "toast",
        "Student updated successfully!",
        "update"
    );

    localStorage.removeItem("editIndex");
    editIndex = null;

    setTimeout(function () {
        window.location.href = "view-student.html";
    }, 1200);

} else {

    showToast(
        "toast",
        "Student added successfully!",
        "success"
    );

    // Clear the form
    document.getElementById("studentForm").reset();

}


    // Print values in Console
    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Email:", email);
    console.log("Phone Number:", phoneNumber);
    console.log("Gender:", gender);
    console.log("Registration Number:", registrationNumber);
    console.log("Date of Birth:", dob);
    console.log("Semester:", semester);
    console.log("Department:", department);
    console.log("Country:", country);
    console.log("Address:", address);
    console.log("City:", city);
    });
}