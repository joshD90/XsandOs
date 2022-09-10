const turnBanner = document.querySelector(".turnBanner");
const connectionBanner = document.querySelector(".playerConnectionBanner");
const winBanner = document.querySelector(".winBanner");

export function bannerWaiting(userObject) {
  const { myName } = userObject;

  turnBanner.classList.add("hidden");
  winBanner.classList.add("hidden");

  connectionBanner.classList.remove("hidden");
  connectionBanner.innerText = `Welcome ${myName}: Awaiting Connection With Another Player`;
}

export function bannerConnection(userObject) {
  const { otherPlayerName } = userObject;

  winBanner.classList.add("hidden");

  connectionBanner.classList.remove("hidden");
  connectionBanner.innerText = `Connected to ${otherPlayerName}`;
  bannerTurn(userObject);
}

export function bannerTurn(userObject) {
  console.log("being called here");
  const { isMyTurn, otherPlayerName } = userObject;

  turnBanner.classList.remove("hidden");
  turnBanner.innerText = isMyTurn
    ? "IT'S YOUR TURN"
    : `IT'S ${otherPlayerName.toUpperCase()}'S TURN`;
}

export function bannerWin(userObject, whoWins) {
  const { myName, otherPlayerName } = userObject;
  turnBanner.classList.add("hidden");
  connectionBanner.classList.add("hidden");
  //connectionBanner.classList.add("hidden");
  winBanner.classList.remove("hidden");

  if (whoWins === myName) winBanner.innerText = "CONGRATS - YOU WON!!";
  else winBanner.innerText = `${otherPlayerName.toUpperCase()} HAS WON`;
}

export function bannerRematchWait() {
  winBanner.classList.remove("hidden");
  winBanner.innerText = "Waiting on Other Player to Confirm Rematch";
}

export function bannerDisconnect(playerName) {
  turnBanner.classList.add("hidden");
  connectionBanner.classList.add("hidden");
  winBanner.classList.remove("hidden");
  winBanner.innerText = `${playerName} has Disconnected - Attempting to Connected with Another Player`;
}
