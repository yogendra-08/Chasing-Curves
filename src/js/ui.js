const hudElement = document.getElementById('hud');

export function updateHUD(speed, score = 0) {
  hudElement.textContent = `Speed: ${Math.round(speed * 7)} km/h  |  Distance: ${Math.floor(score)} m`;
}

// Example for adding a simple start menu overlay (can be expanded later)
export function showStartMenu() {
  let menu = document.createElement('div');
  menu.id = 'startMenu';
  menu.style.position = 'absolute';
  menu.style.top = '50%';
  menu.style.left = '50%';
  menu.style.transform = 'translate(-50%, -50%)';
  menu.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  menu.style.color = 'white';
  menu.style.padding = '30px';
  menu.style.borderRadius = '10px';
  menu.style.textAlign = 'center';
  menu.style.fontFamily = 'Arial, sans-serif';
  menu.innerHTML = `<h1>Chasing Curves</h1>
                    <p>Press <strong>Enter</strong> to Start</p>`;
  document.body.appendChild(menu);
}

export function hideStartMenu() {
  const menu = document.getElementById('startMenu');
  if (menu) {
    menu.remove();
  }
}
