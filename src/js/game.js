import { SceneManager } from './scenes/sceneManager.js';
import { DialogSystem } from './ui/dialog.js';
import { loadAssets } from './utils/assets.js';

class DreamDateGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 1000/60; // 60 FPS
        this.sceneManager = new SceneManager(this);
        this.dialog = new DialogSystem();
        this.gameState = {
            energy: 100,
            mood: 80,
            relationship: 30,
            currentScene: 'mainMenu',
            playerName: 'Player',
            girlName: 'Emma'
        };

        // Bind methods
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.handleResize = this.handleResize.bind(this);
    }

    async init() {
        // Set up event listeners
        window.addEventListener('resize', this.handleResize);
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        
        // Set initial canvas size
        this.handleResize();
        
        // Load assets
        await loadAssets();
        
        // Initialize scene manager
        await this.sceneManager.init();
        
        // Start the game loop
        requestAnimationFrame(this.gameLoop);
    }

    startGame() {
        document.getElementById('main-menu').style.display = 'none';
        this.gameState.currentScene = 'longDrive';
        this.sceneManager.changeScene('longDrive');
    }

    update(deltaTime) {
        this.sceneManager.update(deltaTime);
    }

    render() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render current scene
        this.sceneManager.render(this.ctx);
        
        // Render UI elements on top
        this.updateUI();
    }

    updateUI() {
        // Update status bars
        document.getElementById('energy-bar').style.width = `${this.gameState.energy}%`;
        document.getElementById('mood-bar').style.width = `${this.gameState.mood}%`;
        document.getElementById('relationship-bar').style.width = `${this.gameState.relationship}%`;
    }

    gameLoop(timestamp) {
        // Calculate delta time
        let deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Prevent spiral of death
        if (deltaTime > 1000) deltaTime = this.timestep;
        
        // Update game logic with fixed timestep
        this.accumulator += deltaTime;
        while (this.accumulator >= this.timestep) {
            this.update(this.timestep);
            this.accumulator -= this.timestep;
        }
        
        // Render at maximum frame rate
        this.render();
        
        // Continue the game loop
        requestAnimationFrame(this.gameLoop);
    }

    handleResize() {
        const container = document.getElementById('game-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // Notify scene manager about resize
        if (this.sceneManager) {
            this.sceneManager.handleResize(this.canvas.width, this.canvas.height);
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new DreamDateGame();
    game.init();
});
