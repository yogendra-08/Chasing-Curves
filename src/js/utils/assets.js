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
        // Music - using placeholder sounds from free sources
        'bgm_driving': { 
            path: 'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3', 
            options: { loop: true, volume: 0.3 } 
        },
        'bgm_park': { 
            path: 'https://assets.mixkit.co/music/preview/mixkit-sunny-happy-32.mp3', 
            options: { loop: true, volume: 0.3 } 
        },
        // Sound effects - using placeholder sounds from free sources
        'sfx_click': { 
            path: 'https://assets.mixkit.co/active_button/sounds/545/small_btn-2001.mp3', 
            options: { volume: 0.5 } 
        },
        'sfx_success': { 
            path: 'https://assets.mixkit.co/active_button/sounds/540/success-2001.mp3', 
            options: { volume: 0.7 } 
        },
        'sfx_car': {
            path: 'https://assets.mixkit.co/sound-effects/preview/mixkit-car-engine-on-idle-1380.mp3',
            options: { volume: 0.4, loop: true }
        }
    }
};

// Load all assets
async function loadAssets() {
    try {
        console.log('Loading assets...');
        
        // Count total assets to load
        assetLoader.totalAssets = 
            Object.keys(assets.images).length + 
            Object.keys(assets.sounds).length;
        
        // Load images
        const imagePromises = [];
        for (const [key, path] of Object.entries(assets.images)) {
            imagePromises.push(assetLoader.loadImage(key, path));
        }
        
        // Load sounds
        const soundPromises = [];
        for (const [key, { path, options }] of Object.entries(assets.sounds)) {
            soundPromises.push(assetLoader.loadSound(key, path, options));
        }
        
        // Wait for all assets to load
        await Promise.all([...imagePromises, ...soundPromises]);
        
        console.log('All assets loaded successfully!');
        return true;
    } catch (error) {
        console.error('Error loading assets:', error);
        return false;
    }
}

export { assetLoader, loadAssets };
