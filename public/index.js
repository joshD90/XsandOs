const socket = io();
//set up our chat and socket constants
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");
//set up our canvas consts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//use loop to draw x and y grid lines
function drawGrid(xGrid, yGrid) {
  for (let i = 1; i < xGrid; i++) {
    ctx.beginPath();
    const gridWidth = canvas.width / xGrid;
    ctx.fillRect(gridWidth * i, 0, 3, canvas.height);
  }
  for (let i = 1; i < yGrid; i++) {
    ctx.beginPath();
    const gridHeight = canvas.height / yGrid;
    ctx.fillRect(0, gridHeight * i, canvas.width, 3);
  }
}

drawGrid(3, 3);

//send a message to server
const broadcastMessage = (e) => {
  e.preventDefault();
  //check to see has anything been written in input before sending off
  if (textInput.value) {
    socket.emit("chat message", textInput.value);
    textInput.value = "";
  }
};
//add listener to detect the click
document.addEventListener("click", broadcastMessage);
//set up a listener to check whether any information has been gotten from server
socket.on("chat message", (message) => {
  console.log(message, "this is has come from the server");
});
