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
  //it does not look good if we have the edges of the "o" image touching
  //the gridlines so we subtract a small amount from the width and height in this case
  if (symbol === "o") {
    symbolImg = imgO;
    width -= 4;
    height -= 4;
  } else {
    symbolImg = imgX;
  }
  //for every element in a our selection or other players selection we draw the symbol
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
