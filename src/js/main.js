// Import required modules
import { SceneManager } from './scenes/sceneManager.js';
import { Player } from './entities/player.js';
import { Girl } from './entities/girl.js';
import { Dialog } from './ui/dialog.js';
import { loadAssets } from './utils/assets.js';

// Game initialization
class DreamDateGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Initialize scene manager
        this.sceneManager = new SceneManager(this);
        
        // Start the game loop
        this.lastTime = 0;
        this.gameLoop(0);
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        if (this.sceneManager) {
            this.sceneManager.resize();
        }
    }
    
    gameLoop(timestamp) {
        const deltaTime = timestamp - (this.lastTime || 0);
        this.lastTime = timestamp;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and render current scene if available
        if (this.sceneManager) {
            this.sceneManager.update(deltaTime);
            this.sceneManager.render(this.ctx);
        }
        
        requestAnimationFrame((ts) => this.gameLoop(ts));
    }
}

// Start the game when assets are loaded
async function initGame() {
    try {
        // Show loading screen
        const loadingScreen = document.getElementById('loading');
        const loadingText = document.getElementById('loading-text');
        
        if (loadingText) {
            loadingText.textContent = 'Loading game assets...';
        }
        
        // Load assets
        await loadAssets();
        
        // Initialize game
        window.game = new DreamDateGame();
        
        // Hide loading screen with fade out
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
        
    } catch (error) {
        console.error('Failed to start the game:', error);
        
        // Show error message
        const errorElement = document.createElement('div');
        errorElement.style.color = 'white';
        errorElement.style.padding = '20px';
        errorElement.style.fontFamily = 'Arial, sans-serif';
        errorElement.style.maxWidth = '600px';
        errorElement.style.margin = '50px auto';
        errorElement.style.backgroundColor = '#1f2937';
        errorElement.style.borderRadius = '8px';
        errorElement.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        errorElement.innerHTML = `
            <h2 style="color: #f87171; font-size: 1.5rem; margin-bottom: 1rem;">😢 Failed to load the game</h2>
            <p style="margin-bottom: 1rem;">${error.message || 'An unknown error occurred'}</p>
            <div style="background: #374151; padding: 12px; border-radius: 4px; margin-bottom: 1rem; font-family: monospace; font-size: 0.9rem; overflow-x: auto;">
                ${error.stack || 'No stack trace available'}
            </div>
            <p>Please try refreshing the page. If the problem persists, please check the console for more details.</p>
            <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Refresh Page
            </button>
        `;
        
        // Clear the body and show error
        document.body.innerHTML = '';
        document.body.style.backgroundColor = '#111827';
        document.body.style.margin = '0';
        document.body.style.padding = '20px';
        document.body.appendChild(errorElement);
    }
}

// Start the game when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
