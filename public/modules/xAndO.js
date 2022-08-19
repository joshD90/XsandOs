const canvas = document.getElementById("canvas");

export function createImage(ctx, playerSelectArray, width, height) {
  playerSelectArray.forEach((elem) => {
    let link = new Image();
    link.src = "/assets/xImage.png";
    link.onload = function () {
      ctx.drawImage(
        link,
        elem.center.x - width / 2,
        elem.center.y - height / 2,
        width,
        height
      );
    };
  });
}

export function createOImage(ctx, otherPlayerArray, width, height) {
  otherPlayerArray.forEach((elem) => {
    let o = new Image();
    o.src = "/assets/oImage.png";
    ctx.drawImage(
      o,
      elem.center.x - width / 2,
      elem.center.y - height / 2,
      width,
      height
    );
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

export function playerSelect(currentSquare, playerChoice, ctx) {
  if (
    playerChoice.some(
      (elem) =>
        elem.center.x === currentSquare.current.center.x &&
        elem.center.y === currentSquare.current.center.y
    )
  )
    return;
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.fillRect(
    currentSquare.current.center.x - 48,
    currentSquare.current.center.y - 48,
    96,
    96
  );
  playerChoice.push(currentSquare.current);
}
