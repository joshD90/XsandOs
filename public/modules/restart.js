import { drawGrid } from "./setUpGrid.js";
import { drawBoard } from "./drawBoard.js";
import { bannerRematchWait } from "./changeBanner.js";

//restart div constants

const restartDiv = document.querySelector(".restartDiv");
const btnRematch = document.querySelector(".btnRematch");
const btnDisconnect = document.querySelector(".btnDisconnect");

//banner element constants

// const bannerDiv = document.querySelector(".displayBanner");
// const connectionBanner = document.querySelector(".playerConnectionBanner");
// const turnBanner = document.querySelector(".turnBanner");

//board
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export function initiateRestart(socket, userObject, boardObject) {
  //dont destructure as they will have to be destructured as variables
  //and so decouple with the object reference
  userObject.playerChoices = [];
  userObject.otherPlayerChoices = [];
  userObject.isWinner.winningArray = [];
  userObject.isWinner.playerWin = false;

  setTimeout(() => {
    restartDiv.classList.remove("hidden");
    document.querySelector(".playBoard").classList.add("blurFilter");
    btnRematch.addEventListener("click", () => {
      doRematch(socket, boardObject, userObject);
    });
    btnDisconnect.addEventListener("click", disconnect);
  }, 1000);
}

function doRematch(socket, boardObject, userObject) {
  const { myName, isWinner } = userObject;
  const { gridSquares, boardColor } = boardObject;
  socket.emit("restart-game", { name: myName });

  //remove the blur filter from the baord form rematch
  document.querySelector(".playBoard").classList.remove("blurFilter");
  //draw over the whole board with background color
  drawBoard(userObject, boardObject);
  //hide our restart div button
  restartDiv.classList.add("hidden");
  //change banner
  bannerRematchWait();
}

function disconnect() {
  console.log("Player wants to disconnect");
}
