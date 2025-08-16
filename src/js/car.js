const WIDTH = 480;
const HEIGHT = 640;

const CAR_Y = HEIGHT - 140;
const STEER_STEP = 6;
const ROAD_WIDTH_BASE = WIDTH / 2;

let carX = WIDTH / 2;
let targetX = carX;

export let steerAngle = 0; // For car rotation animation

export function initCar() {
  // Preload car image
  carImg.src = 'src/assets/images/car_red.png';
}

const carImg = new Image();

export function updateCar(deltaTime, speed, roadScroll) {
  // Get current road curve
  const curve = getRoadCurve();

  // Calculate target car position based on curve
  const roadCenter = WIDTH / 2 + curve * 100;

  // Handle keyboard steering
  if (keys['ArrowLeft'] || keys['a']) {
    targetX -= STEER_STEP;
    steerAngle = -1;
  } else if (keys['ArrowRight'] || keys['d']) {
    targetX += STEER_STEP;
    steerAngle = 1;
  } else {
    steerAngle = 0;
  }

  // Clamp inside road boundaries
  const minX = WIDTH / 2 - ROAD_WIDTH_BASE / 2 + 30;
  const maxX = WIDTH / 2 + ROAD_WIDTH_BASE / 2 - 30;
  targetX = Math.min(maxX, Math.max(minX, targetX));

  // Smooth transition towards road center + steering offset
  carX += (roadCenter - carX + (targetX - carX)) * deltaTime * 0.005;

  // Clamp carX
  carX = Math.min(maxX, Math.max(minX, carX));
}

export function drawCar(ctx) {
  ctx.save();
  ctx.translate(carX, CAR_Y);
  ctx.rotate(steerAngle * 0.04);
  ctx.drawImage(carImg, -carImg.width / 2, -carImg.height / 2);
  ctx.restore();
}

import { keys } from './input.js';
import { getRoadCurve } from './road.js';
