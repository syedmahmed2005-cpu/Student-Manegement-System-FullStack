console.log("View Faculty Script Loaded");
let editIndex = localStorage.getItem("facultyEditIndex");

const facultyIdInput = document.getElementById("facultyId");

if (editIndex !== null && facultyIdInput) {

    const faculty = getFaculty()[editIndex];

    document.getElementById("facultyId").value = faculty.facultyId;
    document.getElementById("firstName").value = faculty.firstName;
    document.getElementById("lastName").value = faculty.lastName;
    document.getElementById("email").value = faculty.email;
    document.getElementById("phoneNumber").value = faculty.phoneNumber;
    document.getElementById("dob").value = faculty.dob;
    document.getElementById("department").value = faculty.department;
    document.getElementById("designation").value = faculty.designation;
    document.getElementById("joiningDate").value = faculty.joiningDate;
    document.getElementById("city").value = faculty.city;
    document.getElementById("country").value = faculty.country;
    document.getElementById("address").value = faculty.address;

    document.querySelector(
        `input[name="gender"][value="${faculty.gender}"]`
    ).checked = true;
}

let faculty = getFaculty();

function displayFaculty(searchText = "", departmentFilter = "") {

    const tableBody = document.getElementById("facultyTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    faculty = getFaculty();

    const filteredFaculty = faculty.filter(function (member) {

        const fullName =
            (member.firstName + " " + member.lastName).toLowerCase();

        const search = searchText.toLowerCase();

        const matchesSearch =
            fullName.includes(search) ||
            member.facultyId.toLowerCase().includes(search) ||
            member.email.toLowerCase().includes(search);

        const matchesDepartment =
            departmentFilter === "" ||
            member.department === departmentFilter;

        return matchesSearch && matchesDepartment;
    });


    // No faculty found
    if (filteredFaculty.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-10 text-gray-500">

                    <div class="flex flex-col items-center">

                        <span class="text-6xl mb-4">
                            📭
                        </span>

                        <h3 class="text-xl font-semibold">
                            No Faculty Found
                        </h3>

                        <p class="text-gray-400">
                            Try another search or add a new faculty member.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;
    }


    filteredFaculty.forEach(function (member) {

        const originalIndex = faculty.indexOf(member);

        const statusClass =
            member.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";


        const row = `
            <tr class="border-b border-gray-200 hover:bg-gray-100">

                <td class="px-6 py-4 font-medium">
                    ${member.firstName} ${member.lastName}
                </td>

                <td class="px-6 py-4">
                    ${member.facultyId}
                </td>

                <td class="px-6 py-4">
                    ${member.department}
                </td>

                <td class="px-6 py-4">
                    ${member.designation}
                </td>

                <td class="px-6 py-4">

                    <span class="${statusClass} px-2 py-1 rounded-full text-sm font-medium">
                        ${member.status}
                    </span>

                </td>

                <td class="px-6 py-4">

                    <button
                        class="editFacultyBtn bg-blue-500 text-white px-3 py-1 rounded mr-2"
                        data-index="${originalIndex}">
                        Edit
                    </button>

                    <button
                        class="deleteFacultyBtn bg-red-500 text-white px-3 py-1 rounded"
                        data-index="${originalIndex}">
                        Delete
                    </button>

                </td>

            </tr>
        `;

        tableBody.innerHTML += row;

    });
}


// Initial table creation
displayFaculty();


// Search
const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        displayFaculty(
            searchInput.value,
            departmentFilter.value
        );

    });

}


// Department filter
const departmentFilter = document.getElementById("Department");

if (departmentFilter) {

    departmentFilter.addEventListener("change", function () {

        displayFaculty(
            searchInput.value,
            departmentFilter.value
        );

    });

}
const facultyTableBody = document.getElementById("facultyTableBody");

if (facultyTableBody) {

    facultyTableBody.addEventListener("click", function (event) {

        if (event.target.classList.contains("editFacultyBtn")) {

            const index =
                event.target.getAttribute("data-index");

            localStorage.setItem(
                "facultyEditIndex",
                index
            );

            window.location.href = "add-faculty.html";
        }

    });

}
let deleteFacultyIndex = null;

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

facultyTableBody.addEventListener("click", function (event) {

    if (event.target.classList.contains("deleteFacultyBtn")) {

        deleteFacultyIndex =
            Number(event.target.getAttribute("data-index"));

        deleteModal.classList.remove("hidden");
    }

});
cancelDeleteBtn.addEventListener("click", function () {

    deleteModal.classList.add("hidden");

    deleteFacultyIndex = null;

});
confirmDeleteBtn.addEventListener("click", function () {

    if (deleteFacultyIndex === null) return;

    faculty = getFaculty();

    faculty.splice(deleteFacultyIndex, 1);

    saveFaculty(faculty);

    deleteModal.classList.add("hidden");

    deleteFacultyIndex = null;

    showToast(
        "toast",
        "Faculty deleted successfully!",
        "delete"
    );

    displayFaculty();

});