//name of the sound file is passed into this function
export function playSound(name) {
  let audio = new Audio(`/assets/sounds/${name}`);
  audio.play();
}
