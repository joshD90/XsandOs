export function playSound(name) {
  let audio = new Audio(`/assets/sounds/${name}`);
  audio.play();
}
