const turnBanner = document.querySelector(".turnBanner");
const body = document.querySelector("body");
const canvas = document.getElementById("canvas");
//When it is not your turn the brightness will be dimmed
export function applyNotTurn(otherPlayerName) {
  body.style.backgroundImage = "radial-gradient(#9e9d9d,black)";
  canvas.style.filter = "brightness(0.5)";
}
//when it is the player's turn, the brightness will return to normal
export function applyIsTurnStyle() {
  body.style.backgroundImage = "radial-gradient(white,black)";
  canvas.style.filter = "brightness(1)";
}
//on winning, the background willl dsiplay a golden color
export function applyWinStyle() {
  body.style.backgroundImage = "radial-gradient(white, #ffbf00,	#261d00)"; //#614901
  canvas.style.filter = "brightness(1)";
}
//on losing the background will display a red color
export function applyLoseStyle() {
  body.style.backgroundImage = "radial-gradient(white,#cc3010,black)";
  canvas.style.filter = "brightness(1)";
}
//if the player trys to click on the board when it is not their turn, the turn banner will highlight
//to show them it is not their turn.
export function applyHighlightTurn() {
  turnBanner.style.color = "white";
  turnBanner.style.fontWeight = "800";
  //we remove the highlight after 400 ms
  setTimeout(() => {
    turnBanner.style.color = "black";
    turnBanner.style.fontWeight = "600";
  }, 400);
}
