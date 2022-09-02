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
  mySelection,
  otherPlayerSelection,
  socket,
  myName,
  gridSquares,
  numXRows,
  lineWidth,
  boardColor
) {
  mySelection = [];
  otherPlayerSelection = [];
  setTimeout(() => {
    restartDiv.classList.remove("hidden");
    btnRematch.addEventListener("click", () => {
      doRematch(socket, myName, gridSquares, numXRows, lineWidth, boardColor);
    });
    btnDisconnect.addEventListener("click", disconnect);
  }, 3000);
}

function doRematch(
  socket,
  myName,
  gridSquares,
  numXRows,
  lineWidth,
  boardColor
) {
  socket.emit("send-username", { name: myName });

  console.log(gridSquares, "gridSquares from rematch");

  // gridSquares.forEach((square) => {
  //   const width = canvas.width / numXRows;
  //   const startPointX = square.center.x - (width / 2 - lineWidth / 2);
  //   const startPointY = square.center.y - (width / 2 - lineWidth / 2);

  //   ctx.fillStyle = boardColor;
  //   ctx.fillRect(
  //     startPointX,
  //     startPointY,
  //     width - lineWidth,
  //     width - lineWidth
  //   );
  // });
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid(gridSquares, 5, 5);
  console.log("grid should have been drawn now");

  restartDiv.classList.add("hidden");
}

function disconnect() {
  console.log("Player wants to disconnect");
}
