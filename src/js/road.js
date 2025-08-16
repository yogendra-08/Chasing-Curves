let roadCurve = 0;
let curveTarget = 0;

export function updateRoad(deltaTime) {
  if (Math.abs(roadCurve - curveTarget) < 0.01) {
    curveTarget = (Math.random() - 0.5) * 2; // Random new curve target between -1 and 1
  }
  roadCurve += (curveTarget - roadCurve) * deltaTime * 0.001;
}

export function drawRoad(roadScroll, ctx, WIDTH, HEIGHT) {
  const centerX = WIDTH / 2 + roadCurve * 100;
  const roadHeight = HEIGHT;
  const roadBaseWidth = WIDTH / 2;

  // Road shape
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.moveTo(centerX - roadBaseWidth / 2, 0);
  ctx.lineTo(centerX + roadBaseWidth / 2, 0);
  ctx.lineTo(centerX + roadBaseWidth / 3, roadHeight);
  ctx.lineTo(centerX - roadBaseWidth / 3, roadHeight);
  ctx.closePath();
  ctx.fill();

  // Lane divider
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 5;
  ctx.setLineDash([30, 30]);
  ctx.lineDashOffset = -(roadScroll * 10) % 60;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, roadHeight);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function getRoadCurve() {
  return roadCurve;
}
