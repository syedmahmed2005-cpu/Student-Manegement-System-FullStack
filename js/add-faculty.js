console.log("Add Faculty Script Loaded");

let faculty = getFaculty();
let editIndex = localStorage.getItem("facultyEditIndex");

const facultyIdInput = document.getElementById("facultyId");

if (editIndex !== null && facultyIdInput) {

    const facultyMember = faculty[Number(editIndex)];

    document.getElementById("facultyId").value = facultyMember.facultyId;
    document.getElementById("firstName").value = facultyMember.firstName;
    document.getElementById("lastName").value = facultyMember.lastName;
    document.getElementById("email").value = facultyMember.email;
    document.getElementById("phoneNumber").value = facultyMember.phoneNumber;
    document.getElementById("dob").value = facultyMember.dob;
    document.getElementById("department").value = facultyMember.department;
    document.getElementById("designation").value = facultyMember.designation;
    document.getElementById("joiningDate").value = facultyMember.joiningDate;
    document.getElementById("city").value = facultyMember.city;
    document.getElementById("country").value = facultyMember.country;
    document.getElementById("address").value = facultyMember.address;

    document.querySelector(
        `input[name="gender"][value="${facultyMember.gender}"]`
    ).checked = true;
}

const saveFacultyButton = document.getElementById("saveFacultyBtn");

if (saveFacultyButton) {

    saveFacultyButton.addEventListener("click", function () {

        console.log("Save Faculty Button Clicked");

        const facultyId =
            document.getElementById("facultyId").value;

        const firstName =
            document.getElementById("firstName").value;

        const lastName =
            document.getElementById("lastName").value;

        const email =
            document.getElementById("email").value;

        const phoneNumber =
            document.getElementById("phoneNumber").value;

        const gender =
            document.querySelector(
                'input[name="gender"]:checked'
            )?.value || "";

        const dob =
            document.getElementById("dob").value;

        const department =
            document.getElementById("department").value;

        const designation =
            document.getElementById("designation").value;

        const joiningDate =
            document.getElementById("joiningDate").value;

        const city =
            document.getElementById("city").value;

        const country =
            document.getElementById("country").value;

        const address =
            document.getElementById("address").value;


        // Required fields
        if (
            !facultyId ||
            !firstName ||
            !lastName ||
            !email ||
            !phoneNumber ||
            !department ||
            !designation
        ) {

            showToast(
                "toast",
                "Please fill in all required fields.",
                "error"
            );

            return;
        }


        // Create faculty object
        const facultyMember = {

            facultyId,
            firstName,
            lastName,
            email,
            phoneNumber,
            gender,
            dob,
            department,
            designation,
            joiningDate,
            city,
            country,
            address,
            status: "active"

        };


        // Add faculty
        if (editIndex !== null) {

    faculty[Number(editIndex)] = facultyMember;

    localStorage.removeItem("facultyEditIndex");

} else {

    faculty.push(facultyMember);

}


        // Save to Local Storage
        saveFaculty(faculty);


        // Success message
       if (editIndex !== null) {

    showToast(
        "toast",
        "Faculty updated successfully!",
        "update"
    );

    setTimeout(function () {
        window.location.href = "view-faculty.html";
    }, 1200);

} else {

    showToast(
        "toast",
        "Faculty added successfully!",
        "success"
    );

    document.getElementById("facultyForm").reset();

}

        // Clear form
        document.getElementById("facultyForm").reset();


        console.log("Faculty saved:");
        console.log(faculty);

    });

}