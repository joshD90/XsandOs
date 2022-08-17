import { setUpGrid } from "./modules/setUpGrid.js";
import { getMousePosition, checkWhichSquare } from "./modules/mouseMove.js";

const socket = io();
//set up our chat and socket constants
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");
//set up our canvas consts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//set up an array to put our grid co-ordinates as well as properties for each square
const gridSquares = [];

//set up mouse coordinate variable
let mousePos = {};

//call our grid / squares set up
setUpGrid(gridSquares, 3, 3);

//set up our listener to update mousePos
getMousePosition(mousePos);

//set up our event listeners to see whether the mouse is on the canvas
checkWhichSquare(gridSquares, canvas.width / 6, canvas.height / 6, ctx);

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
