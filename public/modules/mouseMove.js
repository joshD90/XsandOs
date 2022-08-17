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
            elem.center.x - gsWidth,
            elem.center.y - gsHeight,
            gsWidth * 2,
            gsHeight * 2
          );
        }
      } else {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.fillRect(
          elem.center.x - gsWidth - 1,
          elem.center.y - gsHeight - 1,
          (gsWidth - 1) * 2,
          (gsHeight - 1) * 2
        );
      }
    });
  });
}
