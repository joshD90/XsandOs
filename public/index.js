import { setUpGrid } from "./modules/setUpGrid.js";
import { getMousePosition, checkWhichSquare } from "./modules/mouseMove.js";
import {
  createImage,
  playerSelect,
  createOImage,
  checkIsClicked,
} from "./modules/xAndO.js";
import { checkWin } from "./modules/checkWin.js";

//set up our socket
const socket = io();

//set up our starting button + name
const startButton = document.getElementById("usernameButton");
const nameInput = document.getElementById("usernameInput");
const startDiv = document.querySelector(".enterInfo");

startButton.addEventListener("click", doStart);

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

function doStart(e) {
  e.preventDefault();
  console.log(nameInput.value);
  socket.emit("send-username", nameInput.value);
  startDiv.classList.add("hidden");
}

//call our grid / squares set up
setUpGrid(gridSquares, 5, 5);

//get our mousePosition - this sets up a listener which will feed back the mouse
//position to the modules local variable
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

//sets up a listener to check for any new input from other user
socket.on("selectionInfo", (choiceArray) => {
  otherPlayerChoices = choiceArray;
  createOImage(ctx, otherPlayerChoices, 96, 96);
});
