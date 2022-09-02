//set up our canvas consts
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

export const lineWidth = 4;

//use loop to draw x and y grid lines
function drawGrid(gridSquares, xGrid, yGrid) {
  console.log("i am being called here drawgrid function");

  //draw a verticle line from top to bottom of canvas at intervals set by xGrid param
  for (let i = 0; i < xGrid; i++) {
    ctx.beginPath();
    const middlePoint = gridSquares.find((elem) => elem.coord.x === i);
    const gridWidth = canvas.width / xGrid;
    console.log(gridWidth);
    const startPointX = middlePoint.center.x + gridWidth / 2 - lineWidth / 2;

    ctx.fillStyle = "black";
    ctx.fillRect(startPointX, 0, lineWidth, canvas.height);
  }
  //do the same for the horizontal lines
  for (let i = 0; i < yGrid; i++) {
    ctx.beginPath();
    const middlePoint = gridSquares.find((elem) => elem.coord.y === i);
    const gridHeight = canvas.height / yGrid;
    const startPointY = middlePoint.center.y + gridHeight / 2 - lineWidth / 2;

    ctx.fillRect(0, startPointY, canvas.width, lineWidth);
  }
}

//giving each square some properties which we can work with in future
function setGridSquares(gridSquares, numXRows, numYRows) {
  const gridWidth = canvas.width / numXRows;
  const gridHeight = canvas.height / numYRows;
  //create a nested for loop, we run down the y values and for each of these
  //we run through all the x values
  for (let i = 0; i < numXRows; i++) {
    for (let y = 0; y < numYRows; y++) {
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
}
//just a way of checking whether the gridCenter, center property is returning the correct value
function drawGridCenter(gridSquares) {
  gridSquares.forEach((elem) => {
    ctx.beginPath();
    ctx.fillRect(elem.center.x, elem.center.y, 3, 3);
  });
}
//this function draws a line between any two points.
function drawLine(pointA, pointB, color) {
  ctx.lineWidth = 6;
  ctx.strokeStyle = color;
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.stroke();
}

function setUpGrid(gridSquares, xGrid, yGrid) {
  //fill  the gridSquares properties for each square
  setGridSquares(gridSquares, xGrid, yGrid);
  //now draw lines based on grid points
  drawGrid(gridSquares, xGrid, yGrid);
}

export { setUpGrid, drawLine, setGridSquares, drawGrid, drawGridCenter };
