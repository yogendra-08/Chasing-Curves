import { initCar, updateCar, drawCar, steerAngle } from './car.js';
import { updateRoad, drawRoad, getRoadCurve } from './road.js';
import { drawSky, drawMountains, updateDayCycle } from './background.js';
import { handleInput, keys } from './input.js';
import { updateAudio, initAudio } from './audio.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let speed = 0;
const MAX_SPEED = 20;
const MIN_SPEED = 0;
const ACCELERATION = 0.2;
const DECELERATION = 0.3;

let roadScroll = 0;
let dayCycleTime = 0;
const DAY_CYCLE_LENGTH = 60000;

initCar();

window.addEventListener('keydown', e => {
  handleInput(e, true);
});
window.addEventListener('keyup', e => {
  handleInput(e, false);
});

const hud = document.getElementById('hud');

function update(deltaTime) {
  // Update input and speed
  if (keys['ArrowUp'] || keys['w']) {
    speed += ACCELERATION;
  } else {
    speed -= DECELERATION;
  }
  if (keys['ArrowDown'] || keys['s']) {
    speed -= DECELERATION * 2;
  }
  speed = Math.min(MAX_SPEED, Math.max(MIN_SPEED, speed));

  // Update road scroll and curves
  roadScroll += speed * deltaTime * 0.06;
  updateRoad(deltaTime);

  // Update car controls
  updateCar(deltaTime, speed, roadScroll);

  // Update day/night cycle
  updateDayCycle(deltaTime);

  // Update HUD
  hud.textContent = `Speed: ${Math.round(speed * 7)} km/h`;

  // Update audio based on speed (optional)
  updateAudio(speed);
}

function draw() {
  drawSky(dayCycleTime, ctx, WIDTH, HEIGHT);
  drawMountains(roadScroll, ctx, WIDTH, HEIGHT);
  drawRoad(roadScroll, ctx, WIDTH, HEIGHT);
  drawCar(ctx);
}

let lastTime = 0;
function gameLoop(timestamp = 0) {
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;

  update(deltaTime);
  draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
