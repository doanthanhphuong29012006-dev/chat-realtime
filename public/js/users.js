// Request Submission Feature
const listBtnAddFriend = document.querySelectorAll("[button-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");

            const userId = button.getAttribute("button-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// End Request Submission Feature