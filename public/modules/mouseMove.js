const canvas = document.getElementById("canvas");
export let mouseOnCanvas = false;
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

export function checkWhichSquare(
  gridSquares,
  gsWidth,
  gsHeight,
  ctx,
  currentSquare,
  playerSquares,
  otherPlayerSquares
) {
  if (!mouseOnCanvas) return console.log("not on canvas");
  const lineWidth = 4;

  gridSquares.forEach((elem) => {
    if (
      mousePos.x > elem.center.x - gsWidth &&
      mousePos.x < elem.center.x + gsWidth
    ) {
      if (
        mousePos.y > elem.center.y - gsHeight &&
        mousePos.y < elem.center.y + gsHeight
      ) {
        currentSquare.current = elem;
        if (
          !playerSquares.some(
            (playElem) =>
              playElem.coord.x === elem.coord.x &&
              playElem.coord.y === elem.coord.y
          ) &&
          !otherPlayerSquares.some(
            (otherElem) =>
              otherElem.coord.x === elem.coord.x &&
              otherElem.coord.y === elem.coord.y
          )
        ) {
          ctx.beginPath();
          ctx.fillStyle = "#87e082";
          ctx.fillRect(
            elem.center.x - (gsWidth - lineWidth / 2),
            elem.center.y - (gsHeight - lineWidth / 2),
            gsWidth * 2 - lineWidth,
            gsHeight * 2 - lineWidth
          );
        }
      } else {
        if (
          !playerSquares.some(
            (playElem) =>
              playElem.coord.x === elem.coord.x &&
              playElem.coord.y === elem.coord.y
          )
        ) {
          ctx.beginPath();
          ctx.fillStyle = "#346b31";
          ctx.fillRect(
            elem.center.x - (gsWidth - lineWidth / 2),
            elem.center.y - (gsHeight - lineWidth / 2),
            gsWidth * 2 - lineWidth,
            gsHeight * 2 - lineWidth
          );
        }
      }
    } else {
      if (
        !playerSquares.some(
          (playElem) =>
            playElem.coord.x === elem.coord.x &&
            playElem.coord.y === elem.coord.y
        )
      ) {
        ctx.beginPath();
        ctx.fillStyle = "#346b31";
        ctx.fillRect(
          elem.center.x - (gsWidth - lineWidth / 2),
          elem.center.y - (gsHeight - lineWidth / 2),
          gsWidth * 2 - lineWidth,
          gsHeight * 2 - lineWidth
        );
      }
    }
  });
}
