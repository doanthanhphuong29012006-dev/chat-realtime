const myUserId = document.querySelector("[my-id]").getAttribute("my-id");

// Request Submission Feature
const listBtnAddFriend = document.querySelectorAll("[button-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");

            const userId = button.getAttribute("button-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", {
                myUserId: myUserId,
                userId: userId
            });
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

            socket.emit("CLIENT_CANCEL_FRIEND", {
                myUserId: myUserId,
                userId: userId
            });
        });
    });
}
// End Friend Request Cancellation Feature

// Friend Request Deletion Feature
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");

        const userId = button.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", {
            myUserId: myUserId,
            userId: userId
        });
    });
}
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    });
}
// End Friend Request Deletion Feature

// Friend Request Acceptance Feature
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");

        const userId = button.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", {
            myUserId: myUserId,
            userId: userId
        });
    });
}

const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button);
    });
}
// End Friend Request Acceptance Feature

// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if (badgeUserAccept) {
    const userId = badgeUserAccept.getAttribute("badge-users-accept");
    socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (userId === data.userId) {
            badgeUserAccept.innerHTML = data.lengthAcceptFriend;
        }
    });
}
// End SERVER_RETURN_LENGTH_ACCEPT_FRIEND

// SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId === data.userId) {
            const div = document.createElement("div");
            div.classList.add("col-6");
            div.setAttribute("user-id", data.infoUserA._id);

            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar">
                        <img src="/images/avatar.jpg" alt=${data.infoUserA.fullName}>
                    </div>

                    <div class="inner-info">    
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                        <div class="inner-buttons"> 
                            <button 
                                class="btn btn-sm btn-accept-friend" 
                                btn-accept-friend=${data.infoUserA._id}
                            >
                                Chấp nhận
                            </button>
                            <button 
                                class="btn btn-sm btn-refuse-friend" 
                                btn-refuse-friend=${data.infoUserA._id}
                            >
                                Xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-deleted-friend" 
                                btn-deleted-friend=${data.infoUserA._id} 
                                disabled=""
                            >
                                Đã xóa
                            </button>
                            <button 
                                class="btn btn-sm btn-accepted-friend" 
                                btn-accepted-friend=${data.infoUserA._id}
                                disabled=""
                            >
                                Đã chấp nhận
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const buttonRefuse = div.querySelector("[btn-refuse-friend]");
            refuseFriend(buttonRefuse);

            const buttonAccept = div.querySelector("[btn-accept-friend]");
            acceptFriend(buttonAccept)
        
            dataUsersAccept.appendChild(div);
        }
    }

    const dataUsersSuggestion = document.querySelector("[data-users-suggestions]");
    if (dataUsersSuggestion) {
        const userId = dataUsersSuggestion.getAttribute("data-users-suggestions");
        if (userId === data.userId) {
            const boxUserRemove = document.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if (boxUserRemove) {
                boxUserRemove.remove();
            }
        }
    }
});
// End SERVER_RETURN_INFO_ACCEPT_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id="${userIdA}"]`);
    if (boxUserRemove) {
        boxUserRemove.remove();
    }
});
// End SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_STATUS_ONLINE
socket.on("SERVER_RETURN_USER_STATUS_ONLINE", (data) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
        if (boxUser) {
            boxUser.querySelector("[status]").setAttribute("status", data.status);
        }
    }
});
// End SERVER_RETURN_USER_STATUS_ONLINE