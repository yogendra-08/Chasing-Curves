class LongDriveScene {
    constructor(game) {
        this.game = game;
        this.background = null;
        this.car = null;
        this.backgrounds = [];
        this.backgroundSpeed = 1;
        this.obstacles = [];
        this.lastObstacleTime = 0;
        this.obstacleInterval = 2000; // ms
        this.gameOver = false;
        this.distance = 0;
        this.maxDistance = 5000; // pixels to next scene
    }

    async init() {
        // Load background image
        this.background = await this.game.assetLoader.loadImage('longDriveBg', '/assets/backgrounds/long_drive.svg');
        
        // Set up parallax layers
        this.parallaxLayers = [
            { img: this.background, x: 0, y: 0, width: this.game.canvas.width * 3, height: this.game.canvas.height, speed: 0.2 },
            { img: this.background, x: this.game.canvas.width, y: 0, width: this.game.canvas.width * 3, height: this.game.canvas.height, speed: 0.2 }
        ];
        
        // Load car sound
        this.carSound = this.game.assetLoader.getSound('sfx_car');

        // Create car
        this.car = {
            x: 100,
            y: this.game.canvas.height - 250,
            width: 120,
            height: 70,
            speed: 0,
            maxSpeed: 8,
            acceleration: 0.1,
            braking: 0.2,
            handling: 0.05,
            color: '#FF4136',
            wheelAngle: 0
        };
        
        // Car image (rectangle with details)
        this.carImg = document.createElement('canvas');
        this.carImg.width = this.car.width;
        this.carImg.height = this.car.height;
        const carCtx = this.carImg.getContext('2d');
        
        // Draw car body
        carCtx.fillStyle = this.car.color;
        carCtx.beginPath();
        carCtx.roundRect(10, 10, this.car.width - 20, this.car.height - 20, 10);
        carCtx.fill();
        
        // Windows
        carCtx.fillStyle = '#3498db';
        carCtx.fillRect(30, 15, 30, 15);
        carCtx.fillRect(70, 15, 30, 15);
        
        // Wheels
        carCtx.fillStyle = '#333';
        carCtx.beginPath();
        carCtx.arc(30, this.car.height - 15, 10, 0, Math.PI * 2);
        carCtx.arc(this.car.width - 30, this.car.height - 15, 10, 0, Math.PI * 2);
        carCtx.fill();
        
        // Start car engine sound
        if (this.carSound) {
            this.carSound.play();
        }

        // Set up keyboard controls
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            ' ': false // space for brake
        };

        window.addEventListener('keydown', this.handleKeyDown.bind(this));
        window.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    handleKeyDown(event) {
        if (this.keys.hasOwnProperty(event.key)) {
            this.keys[event.key] = true;
            event.preventDefault();
        }
    }

    handleKeyUp(event) {
        if (this.keys.hasOwnProperty(event.key)) {
            this.keys[event.key] = false;
            event.preventDefault();
        }
    }

    enter() {
        console.log('Entering Long Drive scene');
        this.game.dialog.show("Let's go for a long drive together! Use arrow keys to drive. Avoid obstacles!");
    }

    exit() {
        // Clean up event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
    }

    update(deltaTime) {
        if (this.gameOver) return;
        
        // Update car physics
        if (this.keys.ArrowUp) {
            this.car.speed = Math.min(this.car.speed + this.car.acceleration, this.car.maxSpeed);
        } else if (this.keys.ArrowDown) {
            this.car.speed = Math.max(this.car.speed - this.car.braking, -this.car.maxSpeed * 0.5);
        } else {
            // Air resistance and friction
            this.car.speed *= 0.97;
            if (Math.abs(this.car.speed) < 0.1) this.car.speed = 0;
        }
        
        // Steering
        if (Math.abs(this.car.speed) > 0.5) {
            if (this.keys.ArrowLeft) {
                this.car.wheelAngle = Math.max(-Math.PI/6, this.car.wheelAngle - 0.05);
            } else if (this.keys.ArrowRight) {
                this.car.wheelAngle = Math.min(Math.PI/6, this.car.wheelAngle + 0.05);
            } else {
                // Return wheel to center when not steering
                this.car.wheelAngle *= 0.9;
            }
            
            // Update car position based on speed and wheel angle
            const moveAngle = this.car.wheelAngle * (this.car.speed * 0.02);
            this.car.x += Math.sin(moveAngle) * 5;
        } else {
            this.car.wheelAngle *= 0.9; // Return wheel to center when stopped
        }
        
        // Update car position
        this.car.x += this.car.speed;
        
        // Keep car in bounds
        this.car.x = Math.max(100, Math.min(this.car.x, this.game.canvas.width - 100));
        
        // Update parallax background
        const bgSpeed = -this.car.speed * 0.5;
        for (let layer of this.parallaxLayers) {
            layer.x += bgSpeed * layer.speed;
            
            // Wrap background for infinite scrolling
            if (layer.x <= -layer.width) {
                layer.x = layer.width - 10;
            } else if (layer.x >= layer.width) {
                layer.x = -layer.width + 10;
            }
        }

        // Update distance
        this.distance += Math.abs(this.car.speed);

        // Check if we've reached the destination
        if (this.distance >= this.maxDistance) {
            this.gameOver = true;
            this.game.dialog.show("We've arrived at the park! Ready for a walk?", [
                { text: "Let's go!", action: () => this.game.sceneManager.changeScene('park') }
            ]);
        }
    }

    render(ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Draw parallax background
        for (let layer of this.parallaxLayers) {
            ctx.drawImage(layer.img, layer.x, 0, layer.width, this.game.canvas.height);
        }
        
        // Draw road
        const roadGradient = ctx.createLinearGradient(0, this.game.canvas.height - 100, 0, this.game.canvas.height);
        roadGradient.addColorStop(0, '#555');
        roadGradient.addColorStop(1, '#222');
        ctx.fillStyle = roadGradient;
        ctx.fillRect(0, this.game.canvas.height - 100, this.game.canvas.width, 100);
        
        // Draw road markings
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.setLineDash([40, 30]);
        ctx.beginPath();
        ctx.moveTo(0, this.game.canvas.height - 50);
        ctx.lineTo(this.game.canvas.width, this.game.canvas.height - 50);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw car with rotation based on wheel angle
        ctx.save();
        ctx.translate(this.car.x, this.car.y);
        
        // Add some tilt when turning
        const tilt = this.car.wheelAngle * 5;
        ctx.rotate(tilt * 0.01);
        
        // Draw car image
        ctx.drawImage(
            this.carImg,
            -this.car.width / 2,
            -this.car.height / 2,
            this.car.width,
            this.car.height
        );
        ctx.restore();
        
        // Draw HUD
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, 200, 60);
        
        // Draw speed and distance
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Speed: ${Math.abs(Math.round(this.car.speed * 10))} km/h`, 20, 35);
        ctx.fillText(`Distance: ${Math.floor(this.distance/10)}m`, 20, 55);
    }

    handleResize(width, height) {
        // Update canvas dimensions
        this.canvasWidth = width;
        this.canvasHeight = height;
        
        // Update parallax layers
        if (this.parallaxLayers && this.parallaxLayers.length > 0) {
            this.parallaxLayers.forEach(layer => {
                layer.width = width * 3;
                layer.height = height;
            });
        }
        
        // Update car position
        if (this.car) {
            this.car.y = height - 250;
        }
        
        // Update background layers
        this.parallaxLayers = [
            { img: this.background, x: 0, y: 0, width: width * 3, height: height, speed: 0.2 },
            { img: this.background, x: width, y: 0, width: width * 3, height: height, speed: 0.2 }
        ];
    }
}

export { LongDriveScene };
