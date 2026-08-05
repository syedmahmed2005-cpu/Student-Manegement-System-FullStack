function showToast(toastId) {
    const toast = document.getElementById(toastId);
    toast.classList.remove("hidden");

    setTimeout(function(){
        toast.classList.add("hidden");
    },3000);
}
//Array
let students=JSON.parse(localStorage.getItem("students")) || [];





// Get the Save button
const saveButton = document.getElementById("saveStudentBtn");

// Listen for click
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
        showToast("errorToast"); // Stop further execution if required fields are empty
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
    address

};
students.push(student);
localStorage.setItem(
    "students",
    JSON.stringify(students)    
);
console.log("saved to localstorage");
console.log(localStorage.getItem("students"));
showToast("toast");
console.log(students);


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