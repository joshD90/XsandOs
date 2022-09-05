import { drawGrid } from "./setUpGrid.js";

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

export function initiateRestart(
  socket,
  myName,
  gridSquares,
  boardColor,
  isWinner
) {
  setTimeout(() => {
    restartDiv.classList.remove("hidden");
    document.querySelector(".playBoard").classList.add("blurFilter");
    btnRematch.addEventListener("click", () => {
      doRematch(socket, myName, gridSquares, boardColor, isWinner);
    });
    btnDisconnect.addEventListener("click", disconnect);
  }, 1000);
}

function doRematch(socket, myName, gridSquares, boardColor, isWinner) {
  socket.emit("restart-game", { name: myName });

  //remove the blur filter from the baord form rematch
  document.querySelector(".playBoard").classList.remove("blurFilter");
  //draw over the whole board with background color
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //add in the grid lines
  drawGrid(gridSquares, 5, 5);
  //hide our restart div button
  restartDiv.classList.add("hidden");
  //Change message for the banner
  document.querySelector(".winBanner").innerText =
    "Waiting on Other Player to Confirm Rematch";
}

function disconnect() {
  console.log("Player wants to disconnect");
}
