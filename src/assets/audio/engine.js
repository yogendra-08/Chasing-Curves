// This is a placeholder for the engine sound effect
// In a real implementation, you would have actual audio files here
// For now, we'll create a simple audio context to generate an engine sound

class EngineSound {
    constructor() {
        this.audioCtx = null;
        this.oscillator = null;
        this.gainNode = null;
        this.isPlaying = false;
    }

    start() {
        if (this.isPlaying) return;
        
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.oscillator = this.audioCtx.createOscillator();
            this.gainNode = this.audioCtx.createGain();
            
            this.oscillator.connect(this.gainNode);
            this.gainNode.connect(this.audioCtx.destination);
            
            this.oscillator.type = 'sawtooth';
            this.oscillator.frequency.value = 80;
            this.gainNode.gain.value = 0.1;
            
            this.oscillator.start();
            this.isPlaying = true;
        } catch (e) {
            console.warn('Web Audio API not supported in this browser');
        }
    }

    stop() {
        if (!this.isPlaying) return;
        
        if (this.audioCtx) {
            this.gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + 0.5);
            this.oscillator.stop(this.audioCtx.currentTime + 0.5);
            
            // Clean up
            setTimeout(() => {
                if (this.audioCtx) {
                    this.audioCtx.close();
                    this.audioCtx = null;
                    this.oscillator = null;
                    this.gainNode = null;
                }
            }, 600);
        }
        
        this.isPlaying = false;
    }

    updateSpeed(speed) {
        if (!this.isPlaying || !this.oscillator) return;
        
        // Map speed (0-1) to frequency range (80-200)
        const frequency = 80 + (speed * 120);
        this.oscillator.frequency.setTargetAtTime(
            frequency, 
            this.audioCtx.currentTime, 
            0.1
        );
        
        // Adjust volume based on speed
        const volume = 0.1 + (speed * 0.3);
        this.gainNode.gain.setTargetAtTime(
            Math.min(volume, 0.4), 
            this.audioCtx.currentTime, 
            0.1
        );
    }
}

// Export the class for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EngineSound };
}
