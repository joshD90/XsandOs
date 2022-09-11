export const lineWidth = 4;

//use loop to draw x and y grid lines
function drawGrid(boardObject) {
  const { gridSquares, numXRows, numYRows, canvas, ctx, boardLine } =
    boardObject;

  //draw a verticle line from top to bottom of canvas at intervals set by xGrid param
  for (let i = 0; i < numXRows; i++) {
    ctx.beginPath();
    const middlePoint = gridSquares.find((elem) => elem.coord.x === i);
    const gridWidth = canvas.width / numXRows;

    const startPointX = middlePoint.center.x + gridWidth / 2 - lineWidth / 2;
    //draw the line
    ctx.fillStyle = boardLine.color;
    ctx.fillRect(startPointX, 0, boardLine.width, canvas.height);
  }
  //do the same for the horizontal lines
  for (let i = 0; i < numYRows; i++) {
    ctx.beginPath();
    const middlePoint = gridSquares.find((elem) => elem.coord.y === i);
    const gridHeight = canvas.height / numYRows;
    const startPointY = middlePoint.center.y + gridHeight / 2 - lineWidth / 2;
    ctx.fillStyle = boardLine.color;
    ctx.fillRect(0, startPointY, canvas.width, boardLine.width);
  }
}

//giving each square some properties which we can work with in future
function setGridSquares(boardObject) {
  const { gridSquares, numXRows, numYRows, canvas } = boardObject;
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
        y: i * gridHeight + gridHeight / 2,
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
function drawLine(pointA, pointB, color, ctx, lineWidth) {
  ctx.lineWidth = 6;
  ctx.strokeStyle = color;
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.stroke();
}

function setUpGrid(boardObject) {
  const { gridSquares, numXRows, numYRows } = boardObject;
  //fill  the gridSquares properties for each square
  setGridSquares(boardObject);
  //now draw lines based on grid points
  drawGrid(boardObject);
}

export { setUpGrid, drawLine, setGridSquares, drawGrid, drawGridCenter };
