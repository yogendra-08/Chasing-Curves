class Player {
    constructor(game) {
        this.game = game;
        this.x = 100;
        this.y = 300;
        this.width = 40;
        this.height = 80;
        this.speed = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.facing = 'right';
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.sprites = {
            idle: { frames: 1, row: 0 },
            walk: { frames: 4, row: 1 },
            // Add more animations as needed
        };
        this.currentAnimation = 'idle';
        this.spriteSheet = null;
        this.frameWidth = 64;
        this.frameHeight = 64;
    }

    async init() {
        // Load the player sprite
        this.sprite = await this.game.assetLoader.loadImage('player', '/assets/sprites/player.svg');
        this.width = 40;
        this.height = 60;
    }

    update(deltaTime) {
        // Update position based on velocity
        this.x += this.velocityX * this.speed;
        this.y += this.velocityY * this.speed;

        // Update animation frame
        if (this.isMoving) {
            this.animationFrame += this.animationSpeed;
            if (this.animationFrame >= this.sprites[this.currentAnimation].frames) {
                this.animationFrame = 0;
            }
        } else {
            this.animationFrame = 0;
        }

        // Keep player in bounds
        this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
        this.y = Math.max(0, Math.min(this.y, this.game.canvas.height - this.height));
    }

    render(ctx) {
        if (this.sprite) {
            // Save the current context state
            ctx.save();
            
            // Move to the player's position
            ctx.translate(this.x, this.y);
            
            // Flip horizontally if facing left
            if (this.facing === 'left') {
                ctx.scale(-1, 1);
                ctx.drawImage(this.sprite, -this.width, 0, this.width, this.height);
            } else {
                ctx.drawImage(this.sprite, 0, 0, this.width, this.height);
            }
            
            // Restore the context state
            ctx.restore();
        } else {
            // Fallback rectangle if sprite doesn't load
            ctx.fillStyle = '#3498db';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // In a real game, you would draw the sprite here
        // if (this.spriteSheet) {
        //     const frameX = Math.floor(this.animationFrame) * this.frameWidth;
        //     const frameY = this.sprites[this.currentAnimation].row * this.frameHeight;
        //     
        //     ctx.save();
        //     if (this.facing === 'left') {
        //         ctx.scale(-1, 1);
        //         ctx.drawImage(
        //             this.spriteSheet,
        //             frameX, frameY, this.frameWidth, this.frameHeight,
        //             -this.x - this.width, this.y, this.width, this.height
        //         );
        //     } else {
        //         ctx.drawImage(
        //             this.spriteSheet,
        //             frameX, frameY, this.frameWidth, this.frameHeight,
        //             this.x, this.y, this.width, this.height
        //         );
        //     }
        //     ctx.restore();
        // }
    }

    move(direction) {
        this.isMoving = true;
        this.currentAnimation = 'walk';
        
        switch(direction) {
            case 'up':
                this.velocityY = -1;
                break;
            case 'down':
                this.velocityY = 1;
                break;
            case 'left':
                this.velocityX = -1;
                this.facing = 'left';
                break;
            case 'right':
                this.velocityX = 1;
                this.facing = 'right';
                break;
        }
    }

    stop(direction) {
        switch(direction) {
            case 'up':
            case 'down':
                this.velocityY = 0;
                break;
            case 'left':
            case 'right':
                this.velocityX = 0;
                break;
        }
        
        // If no movement in any direction, set to idle
        if (this.velocityX === 0 && this.velocityY === 0) {
            this.isMoving = false;
            this.currentAnimation = 'idle';
        }
    }
}

export { Player };
