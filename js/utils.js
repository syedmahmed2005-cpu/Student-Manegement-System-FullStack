function showToast(toastId, message, type = "success") {

    const toast = document.getElementById(toastId);
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.textContent = message;

    // Remove previous colors
    toast.classList.remove(
        "bg-green-500",
        "bg-blue-500",
        "bg-red-500"
    );

    // Add new color
    if (type === "success") {

        toast.classList.add("bg-green-500");

    }

    else if (type === "update") {

        toast.classList.add("bg-blue-500");

    }

    else if (type === "delete" || type === "error") {

        toast.classList.add("bg-red-500");

    }

    toast.classList.remove("hidden");

    setTimeout(function () {

        toast.classList.add("hidden");

    }, 3000);

}