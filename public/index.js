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
import { initiateRestart } from "./modules/restart.js";

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
let gridSquares = [];
//set up a variable that updates depending on which square the mouse is hovered over
let currentSquare = { current: {} };
//set up array to hold all the squares the player has clicked
let playerChoices = [];
//set up the other players choice array
let otherPlayerChoices = [];
//board variables
const numXRows = 7;
const numYRows = 7;
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

let userObject = {
  myName: null,
  otherPlayerName: null,
  myID: null,
  mySymbol: null,
  isMyTurn: null,
  isWinner: { playerWin: false, winningArray: [] },
  playerChoices: [],
  otherPlayerChoices: [],
  currentSquare: { current: {} },
};
let boardObject = {
  canvas: document.getElementById("canvas"),
  ctx: canvas.getContext("2d"),
  gridSquares: [],
  numXRows: 4,
  numYRows: 4,
  boardColor: "#31572f",
  boardHighlight: "#87e082",
};

function doStart(e) {
  e.preventDefault();

  userObject.myName = nameInput.value;
  socket.emit("send-username", { name: userObject.myName });
  startDiv.classList.add("hidden");
}

//recieve the id for the socket that we are ussing so that we
//can use this later
socket.on("my-id", (id) => {
  userObject.myID = id;
});

//call our grid / squares set up
setUpGrid(boardObject);

//now we wait until the server detects that both players are detected and have set a name
socket.on("set-turn", (info) => {
  //get our mousePosition - this sets up a listener which will feed back the mouse
  //position to the modules local variable
  getMousePosition();
  //this add our mouse move function attached to the mouse moving on the canvas.
  canvas.addEventListener("mousemove", handleMouseActions);

  //add an event listener which will add selection of square to the player choice array
  canvas.addEventListener("click", canvasClick);

  userObject.otherPlayerName = info.allPlayers.filter(
    (elem) => elem.socketID !== userObject.myID
  )[0].socketName.name;
  //we check if the win banner is in place from a previous match and update the banner text
  const winBanner = document.querySelector(".winBanner");
  winBanner && winBanner.remove();

  const playerBanner = document.querySelector(".playerConnectionBanner");
  playerBanner.classList.remove("hidden");
  playerBanner.innerText = `You have connected with ${userObject.otherPlayerName}`;
  //if our player has been randomly assigned as starter
  if (info.whosTurn.socketID === userObject.myID) {
    //set turn variable and update styles and innertext
    userObject.isMyTurn = true;
    applyIsTurnStyle();
    //when setting our own symbol we will always take the first element of the symbol array for ourselves and the second
    // element for the opponent, so rather than passing a variable into the set symbol function we simply change the arrangement of the symbol array
    userObject.mySymbol = ["x", "o"];
  } else {
    userObject.isMyTurn = false;
    applyNotTurn(userObject.otherPlayerName);
    userObject.mySymbol = ["o", "x"];
  }
});

//all board refresh options are fed through the mouse move
function handleMouseActions() {
  //check to see if there is a winner and stop drawing if so
  if (userObject.isWinner.playerWin) return;
  //set up our event listeners to see whether the mouse is on the canvas

  checkWhichSquare(boardObject, userObject);

  //hope to combine these two functions into one function where we can pass
  //an o or an x as a param
  //add all x's
  createImage(boardObject, userObject.playerChoices, userObject.mySymbol[0]);

  //add other players o's - we minus 4 as the o image looks bad due to touching
  //the edges of the square
  createImage(
    boardObject,
    userObject.otherPlayerChoices,
    userObject.mySymbol[1]
  );
}

//function to send player Info to other player
const sendChoiceInfo = () => {
  playSound("placeSymbol.wav");
  socket.emit("selectionInfo", userObject.playerChoices);
  userObject.isMyTurn = false;
  applyNotTurn(userObject.otherPlayerName);

  if (userObject.isWinner.playerWin) {
    //we emit the event in the case of a win
    socket.emit("player-wins", {
      playerName: userObject.myName,
      winningArray: userObject.isWinner.winningArray,
    });
    //we change the styles associated with winning
    applyWinStyle();
    //play winning Sound
    playSound("win.wav");
    //remove the click on canvas listener so board can't be altered
    canvas.removeEventListener("click", canvasClick);
    //carry out win functions
    doWin(userObject.myName, boardObject, handleMouseActions, userObject);
    userObject.playerChoices = [];
    userObject.otherPlayerChoices = [];
    userObject.isWinner.winningArray = [];
    userObject.isWinner.playerWin = false;

    initiateRestart(socket, userObject, boardObject);
  }
};

//sets up a listener to check for any new input from other user
socket.on("selectionInfo", (choiceArray) => {
  userObject.otherPlayerChoices = choiceArray;

  createImage(
    boardObject,
    userObject.otherPlayerChoices,
    userObject.mySymbol[1]
  );
  userObject.isMyTurn = true;
  applyIsTurnStyle();
});

//when we receive the winning notification from the server
socket.on("other-player-wins", (winningInfo) => {
  applyLoseStyle();
  playSound("lose.wav");
  //remove the click on canvas listener so board can't be altered
  canvas.removeEventListener("click", canvasClick);

  userObject.isWinner.winningArray = winningInfo.winningArray;
  console.log(winningInfo.playerName, "socketon otherplayerwin");
  doWin(winningInfo.playerName, boardObject, handleMouseActions, userObject);
  userObject.playerChoices = [];
  userObject.otherPlayerChoices = [];
  userObject.isWinner.winningArray = [];
  userObject.isWinner.playerWin = false;
  console.log(boardObject, "otherPlayerWins Board object");
  initiateRestart(socket, userObject, boardObject);
});

function canvasClick() {
  if (!userObject.isMyTurn) return applyHighlightTurn();
  if (checkIsClicked(userObject) === true) return;
  playerSelect(userObject, boardObject);
  createImage(boardObject, userObject.playerChoices, userObject.mySymbol[0]);
  checkWin(userObject, boardObject);
  sendChoiceInfo();
}
