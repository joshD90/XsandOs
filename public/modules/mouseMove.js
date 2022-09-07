export let mouseOnCanvas = false;
let mousePos = {};
//only get the mouse position if our mouse is on the board as offset
//will return numbers in relation to body when outside it
canvas.addEventListener("mouseenter", () => {
  mouseOnCanvas = true;
});

canvas.addEventListener("mouseleave", () => {
  mouseOnCanvas = false;
});

export function getMousePosition() {
  canvas.addEventListener("mousemove", (e) => {
    if (mouseOnCanvas) {
      mousePos = { x: e.offsetX, y: e.offsetY };
    }
  });
}

//update our current square
export function getCurrentSquare(boardObject, userObject) {
  //destructure the board object
  const { gridSquares, canvas, numXRows, numYRows } = boardObject;
  const { currentSquare } = userObject;
  //find our square dimensions from boardObject values
  const squareWidth = canvas.width / numXRows;
  const squareHeight = canvas.height / numYRows;
  //iterate through all the board squares and see whether the mouse is inside any square
  gridSquares.forEach((square) => {
    if (checkIfInside(mousePos, square, squareWidth, squareHeight)) {
      //keep track of this square and last square to see if square has changed
      currentSquare.previous = currentSquare.current;
      currentSquare.current = square;
    }
  });
}
//this function checks whether the x and y value of the mouse pointer falls within
//a squares range
export function checkIfInside(mousePosition, gridSquare, width, height) {
  if (
    mousePosition.x > gridSquare.center.x - width / 2 &&
    mousePosition.x < gridSquare.center.x + width / 2
  ) {
    if (
      mousePosition.y > gridSquare.center.y - height / 2 &&
      mousePosition.y < gridSquare.center.y + height / 2
    ) {
      return true;
    } else return false;
  } else return false;
}
