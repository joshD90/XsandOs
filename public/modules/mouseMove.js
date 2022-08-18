const canvas = document.getElementById("canvas");
let mouseOnCanvas = false;
let mousePos = {};

canvas.addEventListener("mouseenter", () => {
  mouseOnCanvas = true;
});

canvas.addEventListener("mouseleave", () => {
  mouseOnCanvas = false;
});

export function getMousePosition() {
  document.addEventListener("mousemove", (e) => {
    if (mouseOnCanvas) {
      mousePos = { x: e.offsetX, y: e.offsetY };
    }
  });
}

export function checkWhichSquare(gridSquares, gsWidth, gsHeight, ctx) {
  document.addEventListener("mousemove", () => {
    if (!mouseOnCanvas) return console.log("not on canvas");

    gridSquares.forEach((elem) => {
      ctx.beginPath();
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 5, gsHeight);

      const lineWidth = 4;

      if (
        mousePos.x > elem.center.x - gsWidth &&
        mousePos.x < elem.center.x + gsWidth
      ) {
        if (
          mousePos.y > elem.center.y - gsHeight &&
          mousePos.y < elem.center.y + gsHeight
        ) {
          ctx.beginPath();
          ctx.fillStyle = "lightblue";
          ctx.fillRect(
            elem.center.x - (gsWidth - lineWidth / 2),
            elem.center.y - (gsHeight - lineWidth / 2),
            gsWidth * 2 - lineWidth,
            gsHeight * 2 - lineWidth
          );
        } else {
          ctx.beginPath();
          ctx.fillStyle = "blue";
          ctx.fillRect(
            elem.center.x - (gsWidth - lineWidth / 2),
            elem.center.y - (gsHeight - lineWidth / 2),
            gsWidth * 2 - lineWidth,
            gsHeight * 2 - lineWidth
          );
        }
      } else {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(
          elem.center.x - (gsWidth - lineWidth / 2),
          elem.center.y - (gsHeight - lineWidth / 2),
          gsWidth * 2 - lineWidth,
          gsHeight * 2 - lineWidth
        );
      }
    });
  });
}
