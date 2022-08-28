import { drawLine, setUpGrid } from "./modules/setUpGrid.js";
import { getMousePosition, checkWhichSquare } from "./modules/mouseMove.js";
import {
  createImage,
  playerSelect,
  createOImage,
  checkIsClicked,
} from "./modules/xAndO.js";
import { checkWin } from "./modules/checkWin.js";
import { doWin } from "./modules/winLine.js";

//set up our socket
const socket = io();

//set up our starting button + name
const startButton = document.getElementById("usernameButton");
const nameInput = document.getElementById("usernameInput");
const startDiv = document.querySelector(".enterInfo");
const turnBanner = document.querySelector(".turnBanner");
//this is the button to enter the name
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
//board variables
const numXRows = 5;
const numYRows = 5;
let boardColor = "#31572f"; //"#346b31";
const boardHighlight = "#87e082";
//set up other player name
let myName;
let otherPlayerName;
//player turn and win conditions
let isMyTurn;
let isWinner = { playerWin: false, winningArray: [] };

function doStart(e) {
  e.preventDefault();
  console.log(nameInput.value);
  myName = nameInput.value;
  if (otherPlayerName) {
    socket.emit("send-username", {
      name: myName,
      requestInfo: false,
      yourTurn: true,
    });
  } else socket.emit("send-username", { name: myName, requestInfo: true });
  startDiv.classList.add("hidden");
}

//call our grid / squares set up
setUpGrid(gridSquares, numXRows, numYRows);

//now we check whether the other user has connected
socket.on("receive-name", (otherPlayerInfo) => {
  otherPlayerName = otherPlayerInfo.name;
  if (otherPlayerInfo.yourTurn) {
    isMyTurn = true;
    turnBanner.innerText = "IT'S YOUR TURN";
    turnBanner.classList.remove("hidden");
  }
  if (otherPlayerInfo.requestInfo && myName)
    socket.emit("send-username", {
      name: myName,
      requestInfo: false,
      yourTurn: true,
    });
  const playerBanner = document.querySelector(".playerConnectionBanner");
  playerBanner.innerText = `You have connected with ${otherPlayerInfo.name}`;
});

//get our mousePosition - this sets up a listener which will feed back the mouse
//position to the modules local variable
getMousePosition();

canvas.addEventListener("mousemove", handleMouseActions);

function handleMouseActions() {
  //check to see if there is a winner and stop drawing if so
  if (isWinner.playerWin) return;
  //set up our event listeners to see whether the mouse is on the canvas
  checkWhichSquare(
    gridSquares,
    canvas.width / (numXRows * 2),
    canvas.height / (numYRows * 2),
    ctx,
    currentSquare,
    playerChoices,
    otherPlayerChoices,
    boardColor,
    boardHighlight
  );

  //hope to combine these two functions into one function where we can pass
  //an o or an x as a param
  //add all x's
  createImage(
    ctx,
    playerChoices,
    canvas.width / numXRows,
    canvas.height / numYRows
  );

  //add other players o's - we minus 4 as the o image looks bad due to touching
  //the edges of the square
  createOImage(
    ctx,
    otherPlayerChoices,
    canvas.width / numXRows - 4,
    canvas.height / numYRows - 4
  );
}

//add an event listener which will add selection of square to the player choice array
canvas.addEventListener("click", () => {
  if (!isMyTurn) return;
  if (checkIsClicked(currentSquare, playerChoices, otherPlayerChoices) === true)
    return;
  playerSelect(currentSquare, playerChoices, ctx, boardColor);
  createImage(ctx, playerChoices, 100, 100);
  checkWin(playerChoices, isWinner);
  sendChoiceInfo();
});

//function to send player Info to other player
const sendChoiceInfo = () => {
  socket.emit("selectionInfo", playerChoices);
  isMyTurn = false;
  turnBanner.innerText = `It is ${otherPlayerName}'s Turn`;
  const body = document.querySelector("body");
  body.style.backgroundImage = "radial-gradient(#9e9d9d,black)";
  canvas.style.filter = "brightness(0.5)";

  if (isWinner.playerWin) {
    //we emit the event in the case of a win
    socket.emit("player-wins", {
      playerName: myName,
      winningArray: isWinner.winningArray,
    });
    document.querySelector("body").style.backgroundImage =
      "radial-gradient(white, #ffbf00,	#261d00)"; //#614901
    document.getElementById("canvas").style.filter = "brightness(1)";
    doWin(
      isWinner.winningArray,
      myName,
      isMyTurn,
      canvas,
      myName,
      handleMouseActions
    );
  }
};

//sets up a listener to check for any new input from other user
socket.on("selectionInfo", (choiceArray) => {
  otherPlayerChoices = choiceArray;
  createOImage(ctx, otherPlayerChoices, 96, 96);
  isMyTurn = true;
  turnBanner.classList.remove("hidden");
  turnBanner.innerText = "IT'S YOUR TURN";
  const body = document.querySelector("body");
  body.style.backgroundImage = "radial-gradient(white,black)";
  canvas.style.filter = "brightness(1)";
});

//when we receive the winning notification from the server
socket.on("other-player-wins", (winningInfo) => {
  document.querySelector("body").style.backgroundImage =
    "radial-gradient(white,#cc3010,black)";
  document.getElementById("canvas").style.filter = "brightness(1)";
  doWin(
    winningInfo.winningArray,
    winningInfo.playerName,
    isMyTurn,
    canvas,
    myName,
    handleMouseActions
  );
});
