// Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
}
// End Show Alert

// Upload Image
const avatarContainerPreview = document.querySelector(".avatar-preview-container");
let avatarPreview;
if (avatarContainerPreview) {
    avatarPreview = avatarContainerPreview.querySelector(".avatar-preview");
}

const uploadActionContainer = document.querySelector(".upload-action-container");
if (uploadActionContainer) {
    const avatarUpload = uploadActionContainer.querySelector("#avatar-upload");
    avatarUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            avatarPreview.src = URL.createObjectURL(file);
        }
    });
}
// End Upload Image