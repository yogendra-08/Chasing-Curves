let engineSound;

export function initAudio() {
  engineSound = new Audio('src/assets/audio/engine.mp3');
  engineSound.loop = true;
  engineSound.volume = 0.3;
  engineSound.play().catch(() => {});
}

export function updateAudio(speed) {
  if (!engineSound) return;
  
  engineSound.volume = 0.1 + (speed / 20) * 0.4;
  engineSound.playbackRate = 0.75 + (speed / 20);
}
