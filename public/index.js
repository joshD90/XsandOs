import { setUpGrid } from "./modules/setUpGrid.js";
import {
  getMousePosition,
  checkWhichSquare,
  mouseOnCanvas,
} from "./modules/mouseMove.js";
import {
  createImage,
  playerSelect,
  createOImage,
  checkIsClicked,
} from "./modules/xAndO.js";
import { checkWin } from "./modules/checkWin.js";

const socket = io();
//set up our chat and socket constants
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");
//set up our canvas consts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//set up an array to put our grid co-ordinates as well as properties for each square
const gridSquares = [];
//set up a variable that updates depending on which square the mouse is hovered over
let currentSquare = { current: {} };
//set up array to hold all the squares the player has clicked
const playerChoices = [];
//set up the other players choice array
let otherPlayerChoices = [];

//call our grid / squares set up
setUpGrid(gridSquares, 5, 5);

//get our mousePosition - this will feed back the mouse position to the modules local variable
getMousePosition();
canvas.addEventListener("mousemove", handleMouseActions);

function handleMouseActions() {
  //set up our event listeners to see whether the mouse is on the canvas
  checkWhichSquare(
    gridSquares,
    canvas.width / 10,
    canvas.height / 10,
    ctx,
    currentSquare,
    playerChoices,
    otherPlayerChoices
  );
  //add all x's
  createImage(ctx, playerChoices, 100, 100);
  //add other players o's
  createOImage(ctx, otherPlayerChoices, 96, 96);
}

//add an event listener which will add selection of square to the player choice array
canvas.addEventListener("click", () => {
  if (checkIsClicked(currentSquare, playerChoices, otherPlayerChoices) === true)
    return;
  playerSelect(currentSquare, playerChoices, ctx);
  createImage(ctx, playerChoices, 100, 100);
  checkWin(playerChoices);
  sendChoiceInfo();
});

//function to send player Info to other player
const sendChoiceInfo = () => {
  socket.emit("selectionInfo", playerChoices);
};

socket.on("selectionInfo", (choiceArray) => {
  otherPlayerChoices = choiceArray;
  createOImage(ctx, otherPlayerChoices, 96, 96);
});

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
