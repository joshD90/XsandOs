const canvas = document.getElementById("canvas");
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

//Check which square the mouse is over and highlight this, this also
//updates our current square variable which is fed into the click listener
export function checkWhichSquare(
  gridSquares,
  gsWidth,
  gsHeight,
  ctx,
  currentSquare,
  playerSquares,
  otherPlayerSquares,
  boardColor,
  boardHighlight
) {
  if (!mouseOnCanvas) return console.log("not on canvas");
  const lineWidth = 4;
  //we iterate through each element of the gridsquares array to see whether the
  //mouse position is within its borders
  gridSquares.forEach((elem) => {
    if (
      mousePos.x > elem.center.x - gsWidth &&
      mousePos.x < elem.center.x + gsWidth
    ) {
      if (
        mousePos.y > elem.center.y - gsHeight &&
        mousePos.y < elem.center.y + gsHeight
      ) {
        currentSquare.current = elem;
        //now we check to see whether this square we are hovering has already
        //been selected by our player
        if (
          !playerSquares.some(
            (playElem) =>
              playElem.coord.x === elem.coord.x &&
              playElem.coord.y === elem.coord.y
          ) &&
          //and also check to see whether the other player has selected the hovered
          //square already
          !otherPlayerSquares.some(
            (otherElem) =>
              otherElem.coord.x === elem.coord.x &&
              otherElem.coord.y === elem.coord.y
          )
        ) {
          //if not we can highlight the square
          ctx.beginPath();
          ctx.fillStyle = boardHighlight;
          ctx.fillRect(
            elem.center.x - (gsWidth - lineWidth / 2),
            elem.center.y - (gsHeight - lineWidth / 2),
            gsWidth * 2 - lineWidth,
            gsHeight * 2 - lineWidth
          );
        }
      } else {
        //we return each square to the board color for those squares that
        //arent hovered over in the y access
        if (
          !playerSquares.some(
            (playElem) =>
              playElem.coord.x === elem.coord.x &&
              playElem.coord.y === elem.coord.y
          )
        ) {
          ctx.beginPath();
          ctx.fillStyle = boardColor;
          ctx.fillRect(
            elem.center.x - (gsWidth - lineWidth / 2),
            elem.center.y - (gsHeight - lineWidth / 2),
            gsWidth * 2 - lineWidth,
            gsHeight * 2 - lineWidth
          );
        }
      }
    } else {
      //and we return all the squares to their boardcolor if they fall outside the current square x axis
      if (
        !playerSquares.some(
          (playElem) =>
            playElem.coord.x === elem.coord.x &&
            playElem.coord.y === elem.coord.y
        )
      ) {
        ctx.beginPath();
        ctx.fillStyle = boardColor;
        ctx.fillRect(
          elem.center.x - (gsWidth - lineWidth / 2),
          elem.center.y - (gsHeight - lineWidth / 2),
          gsWidth * 2 - lineWidth,
          gsHeight * 2 - lineWidth
        );
      }
    }
  });
}
