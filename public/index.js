const socket = io();
//set up our chat and socket constants
const sendButton = document.getElementById("sendButton");
const textInput = document.getElementById("textInput");
//set up our canvas consts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//set up an array to put our grid co-ordinates as well as properties for each square
const gridSquares = [];

//use loop to draw x and y grid lines
function drawGrid(xGrid, yGrid) {
  //draw a verticle line from top to bottom of canvas at intervals set by gridX param
  for (let i = 1; i < xGrid; i++) {
    ctx.beginPath();
    const gridWidth = canvas.width / xGrid;
    ctx.fillRect(gridWidth * i, 0, 3, canvas.height);
  }
  //do the same for the horizontal lines
  for (let i = 1; i < yGrid; i++) {
    ctx.beginPath();
    const gridHeight = canvas.height / yGrid;
    ctx.fillRect(0, gridHeight * i, canvas.width, 3);
  }
  //fill  the gridSquares properties for each square
  setGridSquares(xGrid, yGrid);
  //draw a square at the center of each square
  drawGridCenter();
  //checking whether a diagonal line runs through the centers to make sure they aren't off center
  //drawLine(gridSquares[2].center, gridSquares[6].center);
  drawLine({ x: 0, y: 0 }, { x: 500, y: 500 });
}
//call our grid / squares set up
drawGrid(3, 3);

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

//giving each square some properties which we can work with in future
function setGridSquares(numXRows, numYRows) {
  const gridWidth = canvas.width / numXRows;
  const gridHeight = canvas.height / numYRows;
  //create a nested for loop, we run down the y values and for each of these
  //we run through all the x values
  for (i = 0; i < numXRows; i++) {
    for (y = 0; y < numYRows; y++) {
      //each square gets an x and y coordinate - may not be necessary
      const coord = { x: y, y: i };
      //each square has its center plotted.  We can use this later for seeing whether
      //3 are in a line, and to check against our mouse pointer
      const center = {
        x: y * gridWidth + gridWidth / 2,
        y: i * gridWidth + gridHeight / 2,
      };
      //for each iteration, add the square properties to the gridSquare array
      gridSquares.push({ coord: coord, center: center });
    }
  }
  return console.log(gridSquares);
}
//just a way of checking whether the gridCenter, center property is returning the correct value
function drawGridCenter() {
  gridSquares.forEach((elem) => {
    ctx.beginPath();
    ctx.fillRect(elem.center.x, elem.center.y, 3, 3);
  });
}
//this function draws a line between any two points.
function drawLine(pointA, pointB) {
  ctx.lineWidth = 4;
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.stroke();
}
