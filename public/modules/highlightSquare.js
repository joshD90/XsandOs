//this will highlight the square that the mouse is hovered over
export function highlightSquare(userObject, boardObject) {
  const { currentSquare } = userObject;
  const { canvas, ctx, numXRows, numYRows, boardHighlight, boardLine } =
    boardObject;
  const width = canvas.width / numXRows;
  const height = canvas.height / numYRows;
  //we don't highlight the square if the square we are hovering over is already selected
  if (isAlreadyTaken(userObject)) return;
  ctx.fillStyle = boardHighlight;
  //we draw the square by going to the center of the square and subtacting half the width of the square
  //we must also take into account that the gridlines take up part of the square so we minus that value too
  ctx.fillRect(
    currentSquare.current.center.x - (width / 2 - boardLine.width / 2),
    currentSquare.current.center.y - (height / 2 - boardLine.width / 2),
    width - boardLine.width,
    height - boardLine.width
  );
}

export function isAlreadyTaken(userObject) {
  const { currentSquare, playerChoices, otherPlayerChoices } = userObject;
  //if the current mouse position x and y are equal to any x and y of our selected squares it has been selected already
  if (
    playerChoices.some(
      (elem) =>
        currentSquare.current.center.x.toFixed(3) ===
          elem.center.x.toFixed(3) &&
        currentSquare.current.center.y.toFixed(3) === elem.center.y.toFixed(3)
    ) ||
    //and the same for the other players selection
    otherPlayerChoices.some(
      (elem) =>
        currentSquare.current.center.x.toFixed(3) ===
          elem.center.x.toFixed(3) &&
        currentSquare.current.center.y.toFixed(3) === elem.center.y.toFixed(3)
    )
  ) {
    return true;
  } else return false;
}
