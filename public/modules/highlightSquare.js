export function highlightSquare(userObject, boardObject) {
  const { currentSquare } = userObject;
  const { canvas, ctx, numXRows, numYRows, boardHighlight, boardLine } =
    boardObject;
  const width = canvas.width / numXRows;
  const height = canvas.height / numYRows;

  if (isAlreadyTaken(userObject)) return;
  ctx.fillStyle = boardHighlight;

  ctx.fillRect(
    currentSquare.current.center.x - (width / 2 - boardLine.width / 2),
    currentSquare.current.center.y - (height / 2 - boardLine.width / 2),
    width - boardLine.width,
    height - boardLine.width
  );
}

export function isAlreadyTaken(userObject) {
  const { currentSquare, playerChoices, otherPlayerChoices } = userObject;
  if (
    playerChoices.some(
      (elem) =>
        currentSquare.current.center.x.toFixed(3) ===
          elem.center.x.toFixed(3) &&
        currentSquare.current.center.y.toFixed(3) === elem.center.y.toFixed(3)
    ) ||
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
