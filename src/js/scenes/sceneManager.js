import { LongDriveScene } from './longDriveScene.js';

class SceneManager {
    constructor(game) {
        this.game = game;
        this.scenes = {};
        this.currentScene = null;
    }

    async init() {
        // Initialize all scenes
        this.scenes.longDrive = new LongDriveScene(this.game);
        // Add other scenes here as they're created
        
        // Initialize all scenes
        for (const scene of Object.values(this.scenes)) {
            await scene.init();
        }
    }

    changeScene(sceneName, params = {}) {
        if (this.currentScene) {
            this.currentScene.exit();
        }

        const newScene = this.scenes[sceneName];
        if (newScene) {
            this.currentScene = newScene;
            this.currentScene.enter(params);
            this.game.gameState.currentScene = sceneName;
            document.getElementById('scene-title').textContent = this.getSceneTitle(sceneName);
        } else {
            console.error(`Scene '${sceneName}' not found!`);
        }
    }

    getSceneTitle(sceneName) {
        const titles = {
            'longDrive': 'Long Drive',
            'park': 'Walk in the Park',
            'dance': 'Dance Hall',
            'shopping': 'Shopping Street',
            'temple': 'Temple Visit',
            'cafe': 'Cafe Date',
            'ending': 'Stargazing'
        };
        return titles[sceneName] || 'Dream Date Journey';
    }

    update(deltaTime) {
        if (this.currentScene && this.currentScene.update) {
            this.currentScene.update(deltaTime);
        }
    }

    render(ctx) {
        if (this.currentScene && this.currentScene.render) {
            this.currentScene.render(ctx);
        }
    }

    handleResize(width, height) {
        if (this.currentScene && this.currentScene.handleResize) {
            this.currentScene.handleResize(width, height);
        }
    }
}

export { SceneManager };
