const DAY_CYCLE_LENGTH = 60000;
let dayCycleTime = 0;

export function updateDayCycle(deltaTime) {
  dayCycleTime += deltaTime;
  if (dayCycleTime > DAY_CYCLE_LENGTH) dayCycleTime -= DAY_CYCLE_LENGTH;
}

export function drawSky(dayCycleTime, ctx, WIDTH, HEIGHT) {
  const cycle = (dayCycleTime % DAY_CYCLE_LENGTH) / DAY_CYCLE_LENGTH;
  let colorTop, colorBottom;
  if (cycle < 0.25) {
    const t = cycle / 0.25;
    colorTop = `rgba(${Math.floor(10 + 60 * t)},${Math.floor(24 + 120 * t)},${Math.floor(58 + 160 * t)},1)`;
    colorBottom = `rgba(${Math.floor(30 + 120 * t)},${Math.floor(60 + 150 * t)},${Math.floor(120 + 130 * t)},1)`;
  } else if (cycle < 0.5) {
    colorTop = '#87CEEB';
    colorBottom = '#0099ff';
  } else if (cycle < 0.75) {
    const t = (cycle - 0.5) / 0.25;
    colorTop = `rgba(${Math.floor(135 - 125 * t)},${Math.floor(99 - 80 * t)},${Math.floor(50 + 50 * t)},1)`;
    colorBottom = `rgba(${Math.floor(255 - 200 * t)},${Math.floor(140 - 140 * t)},${Math.floor(70 + 90 * t)},1)`;
  } else {
    const t = (cycle - 0.75) / 0.25;
    colorTop = `rgba(${Math.floor(10 * (1 - t))},${Math.floor(24 * (1 - t))},${Math.floor(58 * (1 - t))},1)`;
    colorBottom = `rgba(0,0,0,1)`;
  }

  const skyGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  skyGradient.addColorStop(0, colorTop);
  skyGradient.addColorStop(1, colorBottom);

  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

export function drawMountains(roadScroll, ctx, WIDTH, HEIGHT) {
  ctx.fillStyle = '#2e3a1f';
  ctx.beginPath();
  ctx.moveTo(-100 + (roadScroll * 0.1) % WIDTH, HEIGHT * 0.6);
  ctx.lineTo(100 + (roadScroll * 0.1) % WIDTH, HEIGHT * 0.35);
  ctx.lineTo(230 + (roadScroll * 0.1) % WIDTH, HEIGHT * 0.6);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(280 + (roadScroll * 0.1) % WIDTH, HEIGHT * 0.6);
  ctx.lineTo(400 + (roadScroll * 0.1) % WIDTH, HEIGHT * 0.4);
  ctx.lineTo(520 + (roadScroll * 0.1) % WIDTH, HEIGHT * 0.6);
  ctx.closePath();
  ctx.fill();
}
