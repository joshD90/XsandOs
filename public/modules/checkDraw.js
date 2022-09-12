import { applyDrawStyle } from "./changeStyles.js";
import { bannerDraw } from "./changeBanner.js";
import { initiateRestart } from "./restart.js";

export function checkDraw(socket, userObject, boardObject) {
  const { gridSquares } = boardObject;
  const {
    playerChoices,
    otherPlayerChoices,
    isWinner: { playerWin },
  } = userObject;
  if (
    !(playerChoices.length + otherPlayerChoices.length === gridSquares.length)
  )
    return console.log("not a draw please continue");
  socket.emit("draw");
}

export function doDraw(socket, userObject, boardObject, canvasClick) {
  console.log("a draw has taken place");
  const { canvas } = boardObject;
  let {
    isWinner: { isDraw },
  } = userObject;
  canvas.removeEventListener("click", canvasClick);
  isDraw = true;
  applyDrawStyle();
  bannerDraw();
  initiateRestart(socket, userObject, boardObject);
}
