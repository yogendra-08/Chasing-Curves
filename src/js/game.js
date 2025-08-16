// Game Variables
let gameArea, ctx;
let player;
let enemies = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameSpeed = 1;
let gameRunning = false;
let animationId;
let roadOffset = 0;
let engineSound, crashSound;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const gameOverScreen = document.getElementById('game-over');
const scoreElement = document.querySelector('#score span');
const highScoreElement = document.querySelector('#high-score span');
const finalScoreElement = document.getElementById('final-score');
const finalHighScoreElement = document.getElementById('final-high-score');
const speedElement = document.querySelector('#speed span');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');

// Player Car
class Player {
    constructor() {
        this.width = 60;
        this.height = 100;
        this.x = gameContainer.offsetWidth / 2 - 30;
        this.y = gameContainer.offsetHeight - 140;
        this.speed = 5;
        this.element = document.getElementById('player-car');
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    move(direction) {
        switch(direction) {
            case 'left':
                this.x = Math.max(20, this.x - this.speed);
                break;
            case 'right':
                this.x = Math.min(gameContainer.offsetWidth - this.width - 20, this.x + this.speed);
                break;
            case 'up':
                this.y = Math.max(20, this.y - this.speed);
                break;
            case 'down':
                this.y = Math.min(gameContainer.offsetHeight - this.height - 20, this.y + this.speed);
                break;
        }
        this.updatePosition();
    }
}

// Enemy Car
class Enemy {
    constructor() {
        this.width = 60;
        this.height = 100;
        this.x = Math.random() * (gameContainer.offsetWidth - 100) + 20;
        this.y = -this.height;
        this.speed = 2 + Math.random() * 3;
        this.element = document.createElement('div');
        this.element.className = 'enemy-car';
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        gameArea.appendChild(this.element);
        this.updatePosition();
    }

    update() {
        this.y += this.speed * gameSpeed;
        this.updatePosition();
        return this.y > gameContainer.offsetHeight;
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    remove() {
        if (this.element.parentNode === gameArea) {
            gameArea.removeChild(this.element);
        }
    }
}

// Initialize Game
function init() {
    gameArea = document.getElementById('game-area');
    
    // Set up road
    const road = document.createElement('div');
    road.className = 'road';
    gameArea.appendChild(road);
    
    // Initialize audio
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        engineSound = new AudioContext();
        crashSound = new AudioContext();
    } catch (e) {
        console.warn('Web Audio API is not supported in this browser');
        engineSound = { state: 'closed', resume: () => {}, createOscillator: () => ({}), createGain: () => ({}) };
        crashSound = { state: 'closed', resume: () => {}, createOscillator: () => ({}), createGain: () => ({}) };
    }
    
    // Set up event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    
    // Handle audio context on user interaction (required by some browsers)
    const handleFirstInteraction = () => {
        if (engineSound.state === 'suspended') {
            engineSound.resume();
        }
        if (crashSound.state === 'suspended') {
            crashSound.resume();
        }
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        switch(e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                player.move('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                player.move('right');
                break;
            case 'ArrowUp':
            case 'w':
            case 'W':
                player.move('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                player.move('down');
                break;
        }
    });
    
    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    gameArea.addEventListener('touchstart', (e) => {
        if (!gameRunning) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, false);
    
    gameArea.addEventListener('touchmove', (e) => {
        if (!gameRunning) return;
        e.preventDefault();
        
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        
        const diffX = touchX - touchStartX;
        const diffY = touchY - touchStartY;
        
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal movement
            if (diffX > 0) player.move('right');
            else player.move('left');
        } else {
            // Vertical movement
            if (diffY > 0) player.move('down');
            else player.move('up');
        }
        
        touchStartX = touchX;
        touchStartY = touchY;
    }, { passive: false });
    
    // Update high score display
    highScoreElement.textContent = highScore;
}

// Start Game
function startGame() {
    // Reset game state
    gameRunning = true;
    score = 0;
    gameSpeed = 1;
    scoreElement.textContent = score;
    speedElement.textContent = gameSpeed.toFixed(1);
    
    // Clear existing enemies
    enemies.forEach(enemy => enemy.remove());
    enemies = [];
    
    // Create player
    player = new Player();
    
    // Show game area, hide other screens
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    
    // Start audio
    if (engineSound && engineSound.state === 'suspended') {
        engineSound.resume();
    }
    
    // Start game loop
    gameLoop();
}

// Game Over
function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    
    // Play crash sound
    if (crashSound) {
        const osc = crashSound.createOscillator();
        const gain = crashSound.createGain();
        
        osc.connect(gain);
        gain.connect(crashSound.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, crashSound.currentTime);
        osc.frequency.exponentialRampToValueAtTime(0.01, crashSound.currentTime + 0.5);
        
        gain.gain.setValueAtTime(0.5, crashSound.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, crashSound.currentTime + 0.5);
        
        osc.start();
        osc.stop(crashSound.currentTime + 0.5);
    }
    
    // Update high score
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
    
    // Update game over screen
    finalScoreElement.textContent = score;
    finalHighScoreElement.textContent = highScore;
    
    // Show game over screen
    gameOverScreen.style.display = 'flex';
}

// Check Collisions
function checkCollisions() {
    const playerRect = {
        x: player.x,
        y: player.y,
        width: player.width,
        height: player.height
    };
    
    for (let enemy of enemies) {
        const enemyRect = {
            x: enemy.x,
            y: enemy.y,
            width: enemy.width,
            height: enemy.height
        };
        
        if (isColliding(playerRect, enemyRect)) {
            gameOver();
            return true;
        }
    }
    return false;
}

// Check if two rectangles are colliding
function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Game Loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Move road
    roadOffset = (roadOffset + 2 * gameSpeed) % 100;
    document.querySelector('.road').style.backgroundPosition = `0 ${roadOffset}px`;
    
    // Update engine sound based on speed
    if (engineSound && engineSound.state === 'running') {
        const osc = engineSound.createOscillator();
        const gain = engineSound.createGain();
        
        osc.connect(gain);
        gain.connect(engineSound.destination);
        
        osc.type = 'sawtooth';
        const frequency = 80 + (gameSpeed * 30);
        osc.frequency.setValueAtTime(frequency, engineSound.currentTime);
        
        gain.gain.setValueAtTime(0.1 + (gameSpeed * 0.1), engineSound.currentTime);
        
        osc.start();
        osc.stop(engineSound.currentTime + 0.1);
    }
    
    // Spawn new enemies
    if (Math.random() < 0.02) {
        enemies.push(new Enemy());
    }
    
    // Update enemies
    enemies = enemies.filter(enemy => {
        const isOffScreen = enemy.update();
        if (isOffScreen) {
            enemy.remove();
            return false;
        }
        return true;
    });
    
    // Update score
    score += Math.floor(0.1 * gameSpeed);
    scoreElement.textContent = score;
    
    // Increase game speed based on score
    gameSpeed = 1 + Math.min(score / 500, 3); // Cap at 4x speed
    speedElement.textContent = gameSpeed.toFixed(1);
    
    // Check for collisions
    checkCollisions();
    
    // Continue game loop
    if (gameRunning) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Start the game when the page loads
window.onload = init;
