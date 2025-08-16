class Girl {
    constructor(game, player) {
        this.game = game;
        this.player = player;
        this.x = 200;
        this.y = 300;
        this.width = 40;
        this.height = 80;
        this.speed = 3;
        this.followDistance = 100;
        this.facing = 'left';
        this.isMoving = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.15;
        this.sprites = {
            idle: { frames: 1, row: 0 },
            walk: { frames: 4, row: 1 },
            // Add more animations as needed
        };
        this.currentAnimation = 'idle';
        this.spriteSheet = null;
        this.frameWidth = 64;
        this.frameHeight = 64;
        this.mood = 50; // 0-100
        this.affection = 30; // 0-100
        this.personality = {
            openness: 0.7,    // Willingness to try new activities
            conscientiousness: 0.6, // How organized and dependable
            extraversion: 0.5, // How outgoing and social
            agreeableness: 0.8, // How cooperative and compassionate
            neuroticism: 0.3   // Emotional stability
        };
    }

    async init() {
        // Load the girl sprite
        this.sprite = await this.game.assetLoader.loadImage('girl', '/assets/sprites/girl.svg');
        this.width = 40;
        this.height = 60;
    }

    update(deltaTime) {
        // Follow the player with some randomness
        this.followPlayer();
        
        // Update animation frame
        if (this.isMoving) {
            this.animationFrame += this.animationSpeed;
            if (this.animationFrame >= this.sprites[this.currentAnimation].frames) {
                this.animationFrame = 0;
            }
        } else {
            this.animationFrame = 0;
        }
        
        // Randomly perform idle actions
        if (Math.random() < 0.01) { // 1% chance per frame
            this.performIdleAction();
        }
    }

    followPlayer() {
        const dx = this.player.x - this.x;
        const dy = this.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only move if outside follow distance
        if (distance > this.followDistance) {
            this.isMoving = true;
            this.currentAnimation = 'walk';
            
            // Normalize direction and apply speed
            const nx = dx / distance;
            const ny = dy / distance;
            
            this.x += nx * this.speed;
            this.y += ny * this.speed;
            
            // Update facing direction
            this.facing = nx > 0 ? 'right' : 'left';
            
            // Randomly adjust speed for more natural movement
            this.speed = 2.5 + Math.random() * 1.5;
        } else {
            this.isMoving = false;
            this.currentAnimation = 'idle';
        }
    }

    performIdleAction() {
        const actions = [
            'blink',
            'lookAround',
            'adjustHair',
            'smile',
            'laugh'
        ];
        
        const action = actions[Math.floor(Math.random() * actions.length)];
        // In a real game, you would trigger an animation here
        console.log(`Girl performs action: ${action}`);
        
        // Small chance to say something
        if (Math.random() < 0.3) {
            this.sayRandomPhrase();
        }
    }

    sayRandomPhrase() {
        const phrases = [
            "This is fun!",
            "Where should we go next?",
            "I'm having a great time!",
            "You're really good at this!",
            "I love spending time with you.",
            "What should we do now?",
            "This place is beautiful!"
        ];
        
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];
        this.game.dialog.show(phrase, [], { speaker: 'Girl', temporary: true });
    }

    reactToPlayerAction(action) {
        // Modify affection and mood based on player actions
        switch(action.type) {
            case 'compliment':
                this.affection = Math.min(100, this.affection + 5);
                this.mood = Math.min(100, this.mood + 10);
                this.showHeart();
                break;
            case 'gift':
                this.affection = Math.min(100, this.affection + 10);
                this.mood = Math.min(100, this.mood + 15);
                this.showHeart();
                break;
            case 'insult':
                this.affection = Math.max(0, this.affection - 15);
                this.mood = Math.max(0, this.mood - 20);
                break;
            case 'activity':
                this.mood = Math.min(100, this.mood + 5);
                break;
        }
        
        // Update game state
        this.game.gameState.relationship = Math.floor(this.affection);
        this.game.gameState.mood = Math.floor(this.mood);
    }

    showHeart() {
        // In a real game, you would show a heart animation above the girl's head
        console.log('❤️');
    }

    render(ctx) {
        if (this.sprite) {
            // Save the current context state
            ctx.save();
            
            // Move to the girl's position
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
            ctx.fillStyle = '#e91e63';
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // In a real game, you would draw the sprite here
        // if (this.spriteSheet) {
        //     const frameX = Math.floor(this.animationFrame) * this.frameWidth;
        //     const frameY = this.sprites[this.currentAnimation].row * this.frameHeight;
            
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
}

export { Girl };
