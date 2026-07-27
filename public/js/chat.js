import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// File Upload With Preview
import { FileUploadWithPreview } from 'https://esm.sh/file-upload-with-preview';

const upload = new FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
});
// End File Upload With Preview

// CLIENT_SEND_MESSAGE
var timeOut;

const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;

        const images = upload.cachedFileArray;

        if (content || images.length > 0) {
            socket.emit("CLIENT_SEND_MESSAGE", {
                content: content,
                images: images
            });

            e.target.elements.content.value = "";

            upload.resetPreviewPanel();

            const previewImages = document.querySelector(".inner-preview-images");
            if (previewImages) {
                previewImages.classList.remove("active");
            }

            socket.emit("CLIENT_SEND_TYPING", "hidden");
            clearTimeout(timeOut);
        }
    });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body");
    const boxTyping = document.querySelector(".chat .inner-list-typing");

    const div = document.createElement("div");
    let htmlFullname = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId === data.userId) {
        div.classList.add("inner-outgoing");
    } else {
        htmlFullname=`<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming");
    }

    if (data.content) {
        htmlContent = `
            <div class="inner-content">${data.content}</div>
        `;
    }

    if (data.images && data.images.length > 0) {
        htmlImages = `<div class="inner-images">`;

        for (const image of data.images) {
            htmlImages += `<img src=${image}>`;
        }

        htmlImages += `</div>`;
    }
    
    div.innerHTML = `
        ${htmlFullname}
        ${htmlContent}
        ${htmlImages}
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;
});
// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// Scroll Chat To Bottom

// Show Typing
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden");
    }, 3000);
}
// End Show Typing

// Show Icon Chat
const buttonIcon = document.querySelector('.button-smile');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');
    Popper.createPopper(buttonIcon, tooltip, {
        placement: 'top-end',
        modifiers: [
            {
                name: 'offset',
                options: {
                    offset: [0, 8],
                },
            },
        ],
    });

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown');
    }
}

// Show Image Upload
const buttonImage = document.querySelector(".button-image");
const previewImages = document.querySelector(".inner-preview-images");

if (buttonImage) {
    buttonImage.addEventListener("click", () => {
        const hiddenInput = document.querySelector(".custom-file-container input[type='file']");
        if (hiddenInput) {
            hiddenInput.click();
        }
    });
}

if (previewImages) {
    previewImages.addEventListener("change", () => {
        if (upload.cachedFileArray.length > 0) {
            previewImages.classList.add("active");
        }
    });

    previewImages.addEventListener("click", () => {
        setTimeout(() => {
            if (upload.cachedFileArray.length === 0) {
                previewImages.classList.remove("active");
            }
        }, 200);
    });
}
// End Show Image Upload

// Insert Icon To Input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
    const inputChat = document.querySelector(".chat .inner-form input[name='content']");

    emojiPicker.addEventListener("emoji-click", (e) => {
        const icon = e.detail.unicode;
        inputChat.value = inputChat.value + icon;

        const endChat = inputChat.value.length;
        inputChat.setSelectionRange(endChat, endChat);
        inputChat.focus();

        showTyping();
    });
}
// End Insert Icon To Input
// End Icon Chat

// Input Keyup
const inputContent = document.querySelector(".chat .inner-form input[name='content']");
if (inputContent) {
    inputContent.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            return;
        }

        showTyping();
    });
}
//End Input Keyup

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");
                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = `
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                `;

                elementListTyping.appendChild(boxTyping);

                const bodyChat = document.querySelector(".chat .inner-body");
                if(bodyChat) {
                    bodyChat.scrollTop = bodyChat.scrollHeight;
                }
            }
        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        }
    });
}
// End SERVER_RETURN_TYPING
