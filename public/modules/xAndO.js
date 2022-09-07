//we need to set this up when we call this module as loading the image in the function
//will cause a flicker
let imgX = new Image();
imgX.src = `/assets/xImage.png`;
let imgO = new Image();
imgO.src = `/assets/oImage.png`;

//this image goes to the center point of a square and subtracts half the
//width and height to get to the top left hand corner where it can then draw
//the image

export function createImage(boardObject, playerSelectArray, symbol) {
  const { ctx, canvas, numXRows, numYRows } = boardObject;

  let width = canvas.width / numXRows;
  let height = canvas.height / numYRows;

  let symbolImg;

  if (symbol === "o") {
    symbolImg = imgO;
    width -= 4;
    height -= 4;
  } else {
    symbolImg = imgX;
  }

  playerSelectArray.forEach((elem) => {
    ctx.drawImage(
      symbolImg,
      elem.center.x - width / 2,
      elem.center.y - height / 2,
      width,
      height
    );
  });
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
