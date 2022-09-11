import { drawLine, setUpGrid } from "./modules/setUpGrid.js";
import { getMousePosition, getCurrentSquare } from "./modules/mouseMove.js";
import { createImage } from "./modules/xAndO.js";
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
import { drawBoard } from "./modules/drawBoard.js";
import { isAlreadyTaken } from "./modules/highlightSquare.js";
import {
  bannerConnection,
  bannerDisconnect,
  bannerTurn,
} from "./modules/changeBanner.js";

//set up our socket
const socket = io();

//set up our starting button + name
const startButton = document.getElementById("usernameButton");
const nameInput = document.getElementById("usernameInput");
const startDiv = document.querySelector(".enterInfo");
const turnBanner = document.querySelector(".turnBanner");
//this is the button to enter the user name
startButton.addEventListener("click", doStart);

//set up our canvas consts
const canvas = document.getElementById("canvas");

//set up our user object so that it can be updated by reference through modular functions
let userObject = {
  myName: null,
  otherPlayerName: null,
  myID: null,
  mySymbol: null,
  isMyTurn: null,
  isWinner: { playerWin: false, winningArray: [] },
  playerChoices: [],
  otherPlayerChoices: [],
  currentSquare: { current: {}, previous: {} },
};
//set up our board object so that it can be updated by reference through modular functions
let boardObject = {
  canvas: document.getElementById("canvas"),
  ctx: canvas.getContext("2d"),
  gridSquares: [],
  numXRows: 3,
  numYRows: 3,
  boardColor: "#31572f",
  boardHighlight: "#87e082",
  boardLine: { width: 4, color: "black" },
  winLine: { width: 6, color: "white" },
};

//this function covers submitting the players name
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
//if the other player disconnects then we attempt to switch rooms
socket.on("user-disconnected", (disconnectedName) => {
  disconnectedName
    ? bannerDisconnect(disconnectedName.name)
    : bannerDisconnect("Other Player");
  setTimeout(() => {
    console.log("im requesting to switch rooms now");

    socket.emit("switchRooms");
  }, 2000);
});

//call our grid / squares set up
setUpGrid(boardObject);

//now we wait until the server detects that both players are detected and have set a name
socket.on("set-turn", (info) => {
  //we need to reset these values if there has been any room switches
  userObject.playerChoices = [];
  userObject.otherPlayerChoices = [];
  userObject.isWinner.playerWin = false;
  drawBoard(userObject, boardObject);
  //get our mousePosition - this sets up a listener which will feed back the mouse
  //position to the modules local variable
  getMousePosition();
  //this add our mouse move function attached to the mouse moving on the canvas.
  canvas.addEventListener("mousemove", handleMouseActions);

  //add an event listener which will add selection of square to the player choice array
  canvas.addEventListener("click", canvasClick);
  //we can get the other players name by checking all names and seeing whether the id matches out socket id
  userObject.otherPlayerName = info.allPlayers.filter(
    (elem) => elem.socketID !== userObject.myID
  )[0].socketName.name;

  //if our player has been randomly assigned as starter
  if (info.whosTurn.socketID === userObject.myID) {
    //set turn variable and update styles and innertext
    userObject.isMyTurn = true;
    applyIsTurnStyle();
    //change banner text
    bannerConnection(userObject);
    //when setting our own symbol we will always take the first element of the symbol array for ourselves and the second
    // element for the opponent, so rather than passing a variable into the set symbol function we simply change the arrangement of the symbol array
    userObject.mySymbol = ["x", "o"];
  } else {
    userObject.isMyTurn = false;
    //change banner text
    bannerConnection(userObject);
    applyNotTurn(userObject.otherPlayerName);
    userObject.mySymbol = ["o", "x"];
  }
});

//sets up a listener to check for any new input from other user
socket.on("selectionInfo", (choiceArray) => {
  //we update our user object
  userObject.otherPlayerChoices = choiceArray;
  //redraw the board to reflect the new changes
  drawBoard(userObject, boardObject);
  userObject.isMyTurn = true;
  //applies the highlighted style and changes the banner text to reflect whos turn it is
  applyIsTurnStyle();
  bannerTurn(userObject);
});

//when we receive the winning notification from the server
socket.on("other-player-wins", (winningInfo) => {
  applyLoseStyle();
  playSound("lose.wav");
  //remove the click on canvas listener so board can't be altered
  canvas.removeEventListener("click", canvasClick);

  userObject.isWinner.winningArray = winningInfo.winningArray;
  //carry out win function
  doWin(winningInfo.playerName, boardObject, handleMouseActions, userObject);
  //this will bring up the restart div after a short timeout
  initiateRestart(socket, userObject, boardObject);
});

//all board refresh options are fed through the mouse move
function handleMouseActions() {
  getCurrentSquare(boardObject, userObject);
  //if our mouse hasn't moved over a different grid square then we dont need to update the board
  if (userObject.currentSquare.current === userObject.currentSquare.previous)
    return;
  drawBoard(userObject, boardObject);
}

function canvasClick() {
  //if it's not our turn do nothing except highlight the turnBanner
  if (!userObject.isMyTurn) return applyHighlightTurn();
  //if we're clicking on an already marked square leave function
  if (isAlreadyTaken(userObject)) return;
  //add the selection to our selection array
  userObject.playerChoices.push(userObject.currentSquare.current);
  drawBoard(userObject, boardObject);
  //check to see whether there is winning combo in this latest selection and emit to server if so
  checkWin(userObject, boardObject);
  //else just send over the latest array
  sendChoiceInfo();
}

//function to send player Info to other player
const sendChoiceInfo = () => {
  playSound("placeSymbol.wav");
  socket.emit("selectionInfo", userObject.playerChoices);
  userObject.isMyTurn = false;
  applyNotTurn(userObject.otherPlayerName);
  //change banner text
  bannerConnection(userObject);

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
    initiateRestart(socket, userObject, boardObject);
  }
};
