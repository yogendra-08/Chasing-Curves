class AssetLoader {
    constructor() {
        this.images = {};
        this.sounds = {};
        this.loaded = false;
        this.loadingProgress = 0;
        this.totalAssets = 0;
        this.loadedAssets = 0;
    }

    async loadImage(key, path) {
        return new Promise((resolve, reject) => {
            if (this.images[key]) {
                resolve(this.images[key]);
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.images[key] = img;
                this.loadedAssets++;
                this.updateProgress();
                resolve(img);
            };
            img.onerror = reject;
            img.src = path;
        });
    }

    async loadSound(key, path, options = {}) {
        return new Promise((resolve, reject) => {
            if (this.sounds[key]) {
                resolve(this.sounds[key]);
                return;
            }

            const sound = new Howl({
                src: [path],
                volume: options.volume || 0.5,
                loop: options.loop || false,
                onload: () => {
                    this.sounds[key] = sound;
                    this.loadedAssets++;
                    this.updateProgress();
                    resolve(sound);
                },
                onloaderror: (_, error) => {
                    console.error('Error loading sound:', error);
                    reject(error);
                }
            });
        });
    }

    updateProgress() {
        if (this.totalAssets > 0) {
            this.loadingProgress = (this.loadedAssets / this.totalAssets) * 100;
            console.log(`Loading assets: ${Math.round(this.loadingProgress)}%`);
            
            if (this.loadingProgress >= 100) {
                this.loaded = true;
                console.log('All assets loaded!');
            }
        }
    }

    getImage(key) {
        return this.images[key];
    }

    getSound(key) {
        return this.sounds[key];
    }

    playSound(key) {
        const sound = this.sounds[key];
        if (sound) {
            sound.play();
        }
    }

    stopSound(key) {
        const sound = this.sounds[key];
        if (sound) {
            sound.stop();
        }
    }
}

// Create a global asset loader instance
const assetLoader = new AssetLoader();

// Asset manifest
const assets = {
    images: {
        // Character sprites
        'player': '/assets/sprites/player.svg',
        'girl': '/assets/sprites/girl.svg',
        // Backgrounds
        'longDriveBg': '/assets/backgrounds/long_drive.svg',
        'parkBg': '/assets/backgrounds/long_drive.svg', // Using same bg for now
        // UI elements
        'ui_heart': '/assets/ui/heart.svg',
        'ui_energy': '/assets/ui/heart.svg', // Using heart as placeholder
        'ui_mood': '/assets/ui/heart.svg'    // Using heart as placeholder
    },
    sounds: {
        // Music - using silent audio as fallback
        'bgm_driving': { 
            path: '/assets/audio/sfx/silent.wav', 
            options: { loop: true, volume: 0.0 } 
        },
        'bgm_park': { 
            path: '/assets/audio/sfx/silent.wav', 
            options: { loop: true, volume: 0.0 } 
        },
        // Sound effects - using silent audio as fallback
        'sfx_click': { 
            path: '/assets/audio/sfx/silent.wav', 
            options: { volume: 0.0 } 
        },
        'sfx_success': { 
            path: '/assets/audio/sfx/silent.wav', 
            options: { volume: 0.0 } 
        },
        'sfx_car': {
            path: '/assets/audio/sfx/silent.wav',
            options: { volume: 0.0, loop: true }
        }
    }
};

// Load all assets
async function loadAssets() {
    try {
        console.log('Loading assets...');
        const loadingBar = document.getElementById('loading-bar');
        const loadingText = document.getElementById('loading-text');
        const errorMessage = document.getElementById('error-message');
        
        const updateProgress = (progress) => {
            if (loadingBar) loadingBar.style.width = `${progress}%`;
            if (loadingText) loadingText.textContent = `${Math.round(progress)}%`;
        };
        
        // Count total assets to load
        assetLoader.totalAssets = 
            Object.keys(assets.images).length + 
            Object.keys(assets.sounds).length;
        
        // Load images
        const imageKeys = Object.keys(assets.images);
        for (let i = 0; i < imageKeys.length; i++) {
            const key = imageKeys[i];
            try {
                await assetLoader.loadImage(key, assets.images[key]);
                updateProgress((i + 1) / (imageKeys.length + 1) * 100);
                console.log(`Loaded image: ${key}`);
            } catch (error) {
                console.error(`Error loading image ${key}:`, error);
                throw new Error(`Failed to load image: ${key}. Please check your internet connection and try again.`);
            }
        }
        
        // Load sounds
        const soundPromises = [];
        for (const [key, { path, options }] of Object.entries(assets.sounds)) {
            soundPromises.push(assetLoader.loadSound(key, path, options));
        }
        
        // Wait for all assets to load
        await Promise.all(soundPromises);
        
        console.log('All assets loaded successfully');
        updateProgress(100);
        
        // Hide loading screen after a short delay
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading');
            if (loadingScreen) {
                loadingScreen.style.opacity = '0';
                setTimeout(() => loadingScreen.style.display = 'none', 500);
            }
        }, 500);
        
        return true;
    } catch (error) {
        console.error('Error loading assets:', error);
        const errorMessage = document.getElementById('error-message');
        if (errorMessage) {
            errorMessage.textContent = `Error: ${error.message || 'Failed to load game assets'}`;
            errorMessage.classList.remove('hidden');
        }
        throw error;
    }
}

export { assetLoader, loadAssets };
