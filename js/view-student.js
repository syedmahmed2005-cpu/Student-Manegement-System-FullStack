
let selectedSemester="";
let students=getStudents();
let deleteIndex=null;

//Table creation for vview students
    function displayStudents(searchText="",semesterFilter="") {
        const tableBody=document.getElementById("studentTableBody");
        if (!tableBody) return;
        tableBody.innerHTML="";
        students=getStudents();
        const filteredStudents=students.filter(function (student){
            const fullName=(student.firstName+" "+student.lastName).toLowerCase();
            const matchesSearch =

            fullName.includes(searchText.toLowerCase()) ||

            student.rollNumber.toLowerCase().includes(searchText.toLowerCase()) ||

            student.registrationNumber.toLowerCase().includes(searchText.toLowerCase());

        const matchesSemester =

            semesterFilter === "" ||

            student.semester === semesterFilter;

        return matchesSearch && matchesSemester;

        });
        console.log(students);
        if (filteredStudents.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-10 text-gray-500">
                <div class="flex flex-col items-center">

                    <span class="text-6xl mb-4">📭</span>

                    <h3 class="text-xl font-semibold">
                        No Students Found
                    </h3>

                    <p class="text-gray-400">
                        Try another search or add a new student.
                    </p>

                </div>
            </td>
        </tr>
    `;

    return;

}
        filteredStudents.forEach(function(student,index){
            const originalIndex=students.indexOf(student);

            console.log(index,student);
            //student active or inactive status
            const statusClass=student.status==="active"
            ?"bg-green-100 text-green-800"
            :"bg-red-100 text-red-800";
            const row=`
            <tr class="border-b border-gray-200 hover:bg-gray-100">
                <td class="px-6 py-4 font-medium">${student.firstName} ${student.lastName}</td>
                <td class="px-6 py-4">${student.rollNumber}</td>
                <td class="px-6 py-4">${student.semester}</td>
                <td class="px-6 py-4">${student.department}</td>
                <td class="px-6 py-4"><span class="${statusClass} px-2 py-1 rounded-full text-sm font-medium">${student.status}</span></td>
                 <td class="px-6 py-4">
                <button class="editBtn bg-blue-500 text-white px-3 py-1 rounded mr-2"
                    data-index="${originalIndex}">
                    Edit
                </button>

                <button class="deleteBtn bg-red-500 text-white px-3 py-1 rounded"
                    data-index="${originalIndex}">
                    Delete
                </button>
                </td>
            </tr>
            `;
            tableBody.innerHTML += row;
        })
        console.log(students);
        
    }
    displayStudents();
    const searchInput = document.getElementById("search");
    const semesterFilter = document.getElementById("semesterFilter");

searchInput.addEventListener("input", function () {

    displayStudents(searchInput.value,semesterFilter.value);

});
semesterFilter.addEventListener("change", function () {

    displayStudents(
        searchInput.value,
        semesterFilter.value
    );

});
    //function to delete student
    function deleteStudent(index){
        deleteIndex=index;
        document.getElementById("deleteModal").classList.remove("hidden");
    }
    // funtion to edit student
    function editStudent(index) {

    localStorage.setItem("editIndex", index);

    window.location.href = "add-student.html";


}


    const tableBody=document.getElementById("studentTableBody");
    if (tableBody) {
        tableBody.addEventListener("click", function (event) {
            if (event.target.classList.contains("editBtn")) {
                const index = event.target.getAttribute("data-index");
                editStudent(index);
            }
            else if (event.target.classList.contains("deleteBtn")) {
                const index = event.target.getAttribute("data-index");
                deleteStudent(index);
            }
        });
    }
    const cancelDelete = document.getElementById("cancelDelete");

    cancelDelete.addEventListener("click", function () {

    deleteIndex = null;

    document
        .getElementById("deleteModal")
        .classList.add("hidden");

    });
    const confirmDelete = document.getElementById("confirmDelete");

confirmDelete.addEventListener("click", function () {

    students.splice(deleteIndex, 1);

    saveStudents(students);

    document
        .getElementById("deleteModal")
        .classList.add("hidden");

    deleteIndex = null;

    displayStudents(
        searchInput.value,
        semesterFilter.value
    );

    showToast("toast","Student deleted successfully!", "delete" );

});
