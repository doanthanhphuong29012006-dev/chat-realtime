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

// Friend Request Cancellation Feature
const listBtnCancelFriend = document.querySelectorAll("[button-cancel]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");

            const userId = button.getAttribute("button-cancel");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// End Friend Request Cancellation Feature

// Friend Request Deletion Feature
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("refuse");

            const userId = button.getAttribute("btn-refuse-friend");

            socket.emit("CLIENT_REFUSE_FRIEND", userId);
        });
    });
}
// End Friend Request Deletion Feature