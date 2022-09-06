//this image goes to the center point of a square and subtracts half the
//width and height to get to the top left hand corner where it can then draw
//the image
export function createImage(boardObject, playerSelectArray, symbol) {
  const { ctx, canvas, numXRows, numYRows } = boardObject;

  let width = canvas.width / numXRows;
  let height = canvas.height / numYRows;

  if (symbol === "o") {
    width -= 4;
    height -= 4;
  }

  playerSelectArray.forEach((elem) => {
    let img = new Image();
    img.src = `/assets/${symbol}Image.png`;
    img.onload = function () {
      ctx.drawImage(
        img,
        elem.center.x - width / 2,
        elem.center.y - height / 2,
        width,
        height
      );
    };
  });
}

export function checkIsClicked(userObject) {
  const { currentSquare, playerChoices, otherPlayerChoices } = userObject;
  if (
    playerChoices.some(
      (elem) =>
        elem.center.x === currentSquare.current.center.x &&
        elem.center.y === currentSquare.current.center.y
    )
  ) {
    return true;
  }

  if (
    otherPlayerChoices.some(
      (elem) =>
        elem.center.x === currentSquare.current.center.x &&
        elem.center.y === currentSquare.current.center.y
    )
  ) {
    return true;
  }

  return false;
}

export function playerSelect(userObject, boardObject) {
  const { currentSquare, playerChoices } = userObject;
  const { canvas, ctx, boardColor, numXRows, numYRows } = boardObject;
  const width = canvas.width / numXRows;
  const height = canvas.height / numYRows;
  if (
    playerChoices.some(
      (elem) =>
        elem.center.x === currentSquare.current.center.x &&
        elem.center.y === currentSquare.current.center.y
    )
  )
    return;

  ctx.beginPath();
  ctx.fillStyle = boardColor;
  ctx.fillRect(
    currentSquare.current.center.x - (width / 2 - 2),
    currentSquare.current.center.y - (height / 2 - 2),
    width - 4,
    height - 4
  );

  playerChoices.push(currentSquare.current);
}
