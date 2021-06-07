// Perhaps the comments have typos or grammatical errors

import io from "socket.io-client";
import "./styles/style.css";

// Socket connection
const currentSocket = io(
  // "localhost:8080"
  "https://pwbs.herokuapp.com/"
);

// Public user name
var userName: any = localStorage.getItem('userName') ?? ''

// DOM Elements
const clientInput = <HTMLInputElement>document.querySelector("#input");
const btnSend = <HTMLButtonElement>document.querySelector("#send");
const messagesDiv = <HTMLUListElement>document.querySelector("#messages");
const changeNickBtn = <HTMLButtonElement>document.querySelector('#changenickname')

// Start change nick with display none, and when the user set he username the button will be visible 
changeNickBtn.style.display = 'none'

// Check if name is diferent null/undefined and change change nickname button to visible
if (userName !== '') {
  changeNickBtn.style.display = 'block'
}

// Listen button click envents 
changeNickBtn.addEventListener('click', () => {

  // Send a prompt to user put he nickname
  const un: string | null = prompt('What is your username?') ?? ''

  // Check if is a invalid name, and not continue the function execution
  if(un === '' || un === 'SYSTEM') {
    return
  }

  // Set on the localStorage and on the userName variable the new username
  localStorage.setItem('userName', un)
  userName = un
})

// Check for socket message emmisions
currentSocket.on("message", (message) => {

  // Check if message is '!clear' command and clear the messages list
  if (message.author === 'SYSTEM' && message.text === "all messages have been deleted") {
    messagesDiv.innerText = "";
  }

  // New message elements
  const el = document.createElement("p");
  const elAuthor = document.createElement('strong')
  const elMessage = document.createElement('li')

  // Add content to html
  elAuthor.innerText = `${message.author}: `
  el.innerText = message.text;
  elMessage.appendChild(elAuthor)
  elMessage.appendChild(el)
  messagesDiv?.appendChild(elMessage);

  // Scroll to bottom div after 300ms
  setTimeout(() => {
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }, 300);
});


function sendMessage() {
  // check if message is null/undefined and cancel the function execution
  if (clientInput.value === "") {
    return;
  }

  // Check if username is null/undefined and send a prompt to he put he nickname
  if(userName === '') {
    const un: string | null = prompt('What is your username?') ?? ''
    if(un === '' || un === 'SYSTEM') {
      return
    }

    // Set the username on the localstorage
    localStorage.setItem('userName', un)
    userName = un
    changeNickBtn.style.display = 'block'
  }

  // Emit to socket a message, contains text and author
  currentSocket.emit("message", {text: clientInput.value, author: userName});

  // clear the input and disable button send for 300ms
  clientInput.value = "";
  btnSend.disabled = true;

  setTimeout(() => {
    // Scroll to the bottom messages list
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    btnSend.disabled = false;
  }, 300);
}

// Check the button end click event and send message
btnSend?.addEventListener("click", sendMessage);

// Check if the client press enter on the input and send message
clientInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendMessage();
  }
});
