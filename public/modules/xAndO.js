const canvas = document.getElementById("canvas");

export function createImage(ctx, xPos, yPos, width, height) {
  let link = new Image();
  link.src = "/assets/xImage.png";
  link.onload = function () {
    ctx.drawImage(link, xPos, yPos, width, height);
  };
}
