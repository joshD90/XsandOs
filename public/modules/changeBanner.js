const turnBanner = document.querySelector(".turnBanner");
const connectionBanner = document.querySelector(".playerConnectionBanner");
const winBanner = document.querySelector(".winBanner");
//when waiting for another player to join / submit their name
export function bannerWaiting(userObject) {
  const { myName } = userObject;

  turnBanner.classList.add("hidden");
  winBanner.classList.add("hidden");

  connectionBanner.classList.remove("hidden");
  connectionBanner.innerText = `Welcome ${myName}: Awaiting Connection With Another Player`;
}
//Once connected to another user display this banner text
export function bannerConnection(userObject) {
  const { otherPlayerName } = userObject;

  winBanner.classList.add("hidden");

  connectionBanner.classList.remove("hidden");
  connectionBanner.innerText = `Connected to ${otherPlayerName}`;
  //on connecting with another user, the turn will be set so we can automatically update
  //who's turn it is
  bannerTurn(userObject);
}
//this displays who's turn it is
export function bannerTurn(userObject) {
  const { isMyTurn, otherPlayerName } = userObject;

  turnBanner.classList.remove("hidden");
  turnBanner.innerText = isMyTurn
    ? "IT'S YOUR TURN"
    : `IT'S ${otherPlayerName.toUpperCase()}'S TURN`;
}
//if either player wins this will display winning or losing text
export function bannerWin(userObject, whoWins) {
  const { myName, otherPlayerName } = userObject;
  turnBanner.classList.add("hidden");
  connectionBanner.classList.add("hidden");
  //connectionBanner.classList.add("hidden");
  winBanner.classList.remove("hidden");

  if (whoWins === myName) winBanner.innerText = "CONGRATS - YOU WON!!";
  else winBanner.innerText = `${otherPlayerName.toUpperCase()} HAS WON`;
}
//this will be displayed when a player clicks rematch but the other player hasnt yet
export function bannerRematchWait() {
  winBanner.classList.remove("hidden");
  winBanner.innerText = "Waiting on Other Player to Confirm Rematch";
}
//this will be displayed if a player disconnects from the game
export function bannerDisconnect(playerName) {
  turnBanner.classList.add("hidden");
  connectionBanner.classList.add("hidden");
  winBanner.classList.remove("hidden");
  winBanner.innerText = `${playerName} has Disconnected - Attempting to Connected with Another Player`;
}
