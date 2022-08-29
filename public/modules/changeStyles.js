const turnBanner = document.querySelector(".turnBanner");
const body = document.querySelector("body");
const canvas = document.getElementById("canvas");

export function applyNotTurn(otherPlayerName) {
  turnBanner.innerText = `It is ${otherPlayerName}'s turn`;
  body.style.backgroundImage = "radial-gradient(#9e9d9d,black)";
  canvas.style.filter = "brightness(0.5)";
}

export function applyIsTurnStyle() {
  turnBanner.classList.remove("hidden");
  turnBanner.innerText = "IT'S YOUR TURN";

  body.style.backgroundImage = "radial-gradient(white,black)";
  canvas.style.filter = "brightness(1)";
}

export function applyWinStyle() {
  body.style.backgroundImage = "radial-gradient(white, #ffbf00,	#261d00)"; //#614901
  canvas.style.filter = "brightness(1)";
}

export function applyLoseStyle() {
  body.style.backgroundImage = "radial-gradient(white,#cc3010,black)";
  canvas.style.filter = "brightness(1)";
}

export function applyHighlightTurn() {
  turnBanner.style.color = "white";
  turnBanner.style.fontWeight = "800";
  setTimeout(() => {
    turnBanner.style.color = "black";
    turnBanner.style.fontWeight = "500";
  }, 400);
}
