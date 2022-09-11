import { highlightSquare } from "./highlightSquare.js";
import { drawGrid } from "./setUpGrid.js";
import { createImage } from "./xAndO.js";

export function drawBoard(userObject, boardObject) {
  const { canvas, ctx, boardColor } = boardObject;
  const { playerChoices, otherPlayerChoices, mySymbol, currentSquare } =
    userObject;
  //clear the background
  ctx.fillStyle = boardColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  //draw our grid lines over
  drawGrid(boardObject);
  //add our highlighted square if there is one
  if (currentSquare.current.x) highlightSquare(userObject, boardObject);
  //if symbols have been assigned yet
  if (mySymbol) {
    //add our own symbols
    createImage(boardObject, playerChoices, mySymbol[0]);
    //add other player symbols
    createImage(boardObject, otherPlayerChoices, mySymbol[1]);
  }
}
