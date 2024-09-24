const chatBox = document.getElementById("chatBox");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendButton");
let message_container = null;

let isProcessing = false;

const socket = new WebSocket("ws://localhost:8000/ws");

socket.onopen = function (event) {
  console.log("Connected to the WebSocket server");
};

socket.onmessage = function (event) {
  const data = JSON.parse(event.data);
  appendMessage(data.response, "bot-message");
};

sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = userInput.value.trim();
  message_container = document.createElement("div");
  if (message) {
    const usermsg = document.createElement("div");
    chatBox.append(usermsg);

    usermsg.className = "user-message";
    usermsg.textContent = message;
    socket.send(message);

    userInput.value = "";
  }
}

function appendMessage(message, className) {
  const messageElement = document.createElement("span");

  message_container.className = className;
  message_container.append(messageElement);

  messageElement.textContent += message;

  chatBox.appendChild(message_container);
  console.log("message:", message);
  chatBox.scrollTop = chatBox.scrollHeight;
}
