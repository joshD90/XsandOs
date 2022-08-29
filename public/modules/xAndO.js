const canvas = document.getElementById("canvas");
//this image goes to the center point of a square and subtracts half the
//width and height to get to the top left hand corner where it can then draw
//the image
export function createImage(ctx, playerSelectArray, width, height, symbol) {
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

export function checkIsClicked(
  currentSquare,
  playerChoices,
  otherPlayerChoices
) {
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

export function playerSelect(
  currentSquare,
  playerChoice,
  ctx,
  boardColor,
  width,
  height
) {
  if (
    playerChoice.some(
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
  playerChoice.push(currentSquare.current);
}
