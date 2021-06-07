import io from "socket.io-client";
import "./styles/style.css";

const currentSocket = io(
  // "localhost:8080"
  "https://MultiplayerGameServerSide.patogordo.repl.co"
);

var userName: any = localStorage.getItem('userName') ?? ''

const clientInput = <HTMLInputElement>document.querySelector("#input");
const btnSend = <HTMLButtonElement>document.querySelector("#send");
const messagesDiv = <HTMLUListElement>document.querySelector("#messages");
const changeNickBtn = <HTMLButtonElement>document.querySelector('#changenickname')
changeNickBtn.style.display = 'none'

if (userName !== '') {
  changeNickBtn.style.display = 'block'
}

changeNickBtn.addEventListener('click', () => {
  const un: string | null = prompt('What is your username?') ?? ''
  if(un === '' || un === 'SYSTEM') {
    return
  }
  localStorage.setItem('userName', un)
  userName = un
})

currentSocket.on("message", (message) => {
  if (message.author === 'SYSTEM' && message.text === "all messages have been deleted") {
    messagesDiv.innerText = "";
  }

  const el = document.createElement("p");
  const elAuthor = document.createElement('strong')
  const elMessage = document.createElement('li')

  elAuthor.innerText = `${message.author}: `
  el.innerText = message.text;

  elMessage.appendChild(elAuthor)
  elMessage.appendChild(el)

  messagesDiv?.appendChild(elMessage);

  setTimeout(() => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 300);
});

function sendMessage() {
  if (clientInput.value === "") {
    return;
  }

  if(userName === '') {
    const un: string | null = prompt('What is your username?') ?? ''
    if(un === '' || un === 'SYSTEM') {
      return
    }
    localStorage.setItem('userName', un)
    userName = un
    changeNickBtn.style.display = 'block'
  }

  currentSocket.emit("message", {text: clientInput.value, author: userName});
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
