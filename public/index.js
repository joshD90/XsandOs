import { drawLine, setUpGrid } from "./modules/setUpGrid.js";
import { getMousePosition, checkWhichSquare } from "./modules/mouseMove.js";
import { createImage, playerSelect, checkIsClicked } from "./modules/xAndO.js";
import { checkWin } from "./modules/checkWin.js";
import { doWin } from "./modules/winLine.js";
import {
  applyIsTurnStyle,
  applyNotTurn,
  applyWinStyle,
  applyLoseStyle,
  applyHighlightTurn,
} from "./modules/changeStyles.js";
import { playSound } from "./modules/playSound.js";

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
let myID;
let mySymbol;
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
    });
  } else socket.emit("send-username", { name: myName });
  startDiv.classList.add("hidden");
}

//recieve the id for the socket that we are ussing so that we
//can use this later
socket.on("my-id", (id) => {
  myID = id;
  console.log(`My Id is ${myID}`);
});

//call our grid / squares set up
setUpGrid(gridSquares, numXRows, numYRows);

//now we wait until the server detects that both players are detected and have set a name
socket.on("set-turn", (info) => {
  console.log(info, "this is the entire info object getting sent over");
  console.log(info.whosTurn);
  otherPlayerName = info.allPlayers.filter((elem) => elem.socketID !== myID)[0]
    .socketName.name;
  console.log(otherPlayerName, "OTHER PLAYER NAME");

  const playerBanner = document.querySelector(".playerConnectionBanner");
  playerBanner.innerText = `You have connected with ${otherPlayerName}`;
  if (info.whosTurn.socketID === myID) {
    console.log("ITS MY TURN");
    isMyTurn = true;
    turnBanner.innerText = "IT'S YOUR TURN";
    turnBanner.classList.remove("hidden");
    mySymbol = ["x", "o"];
  } else {
    turnBanner.innerText = `IT'S ${otherPlayerName}'s turn`;
    turnBanner.classList.remove("hidden");
    mySymbol = ["o", "x"];
  }
});

//get our mousePosition - this sets up a listener which will feed back the mouse
//position to the modules local variable
getMousePosition();
//this add our mouse move function attached to the mouse moving on the canvas.
canvas.addEventListener("mousemove", handleMouseActions);

//all board refresh options are fed through the mouse move
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
    canvas.height / numYRows,
    mySymbol[0]
  );

  //add other players o's - we minus 4 as the o image looks bad due to touching
  //the edges of the square
  createImage(
    ctx,
    otherPlayerChoices,
    canvas.width / numXRows - 4,
    canvas.height / numYRows - 4,
    mySymbol[1]
  );
}

//add an event listener which will add selection of square to the player choice array
canvas.addEventListener("click", () => {
  if (!isMyTurn) return applyHighlightTurn();
  if (checkIsClicked(currentSquare, playerChoices, otherPlayerChoices) === true)
    return;
  playerSelect(
    currentSquare,
    playerChoices,
    ctx,
    boardColor,
    canvas.width / numXRows,
    canvas.width / numYRows
  );
  createImage(
    ctx,
    playerChoices,
    canvas.width / numXRows,
    canvas.height / numYRows,
    mySymbol[0]
  );
  checkWin(playerChoices, isWinner);
  sendChoiceInfo();
});

//function to send player Info to other player
const sendChoiceInfo = () => {
  playSound("placeSymbol.wav");
  socket.emit("selectionInfo", playerChoices);
  isMyTurn = false;
  applyNotTurn(otherPlayerName);

  if (isWinner.playerWin) {
    //we emit the event in the case of a win
    socket.emit("player-wins", {
      playerName: myName,
      winningArray: isWinner.winningArray,
    });
    //we change the styles associated with winning
    applyWinStyle();
    //play winning Sound
    playSound("win.wav");
    //carry out win functions
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

  createImage(
    ctx,
    otherPlayerChoices,
    canvas.width / numXRows - 4,
    canvas.width / numYRows - 4,
    mySymbol[1]
  );
  isMyTurn = true;
  applyIsTurnStyle();
});

//when we receive the winning notification from the server
socket.on("other-player-wins", (winningInfo) => {
  applyLoseStyle();
  playSound("lose.wav");
  doWin(
    winningInfo.winningArray,
    winningInfo.playerName,
    isMyTurn,
    canvas,
    myName,
    handleMouseActions
  );
});

socket.on("set-turn", (turnInfo) => {
  console.log(turnInfo);
});
