import io from "socket.io-client";
import "./styles/style.css";

const currentSocket = io(
  // "localhost:8080"
  "https://MultiplayerGameServerSide.patogordo.repl.co"
);

const clientInput = <HTMLInputElement>document.querySelector("#input");
const btnSend = <HTMLButtonElement>document.querySelector("#send");
const messagesDiv = <HTMLUListElement>document.querySelector("#messages");

currentSocket.on("message", (text) => {
  if (text === "[SYSTEM]: all messages have been deleted") {
    messagesDiv.innerHTML = "";
  }

  const el = document.createElement("li");
  el.innerText = text;
  messagesDiv?.appendChild(el);
  setTimeout(() => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 300);
});

function sendMessage() {
  if (clientInput.value === "") {
    return;
  }
  currentSocket.emit("message", clientInput.value);
  clientInput.value = "";
  btnSend.disabled = true;
  setTimeout(() => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    btnSend.disabled = false;
  }, 300);
}

btnSend?.addEventListener("click", sendMessage);

clientInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
