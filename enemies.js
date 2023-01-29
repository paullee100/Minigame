class Slime {
    constructor(game, x, y, player) {
        Object.assign(this, {game, x, y, player});

        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};
        this.state = 0; // idle = 0, walk = 1, attack = 2, hurt = 3, dead = 4
        this.facing = 1; // right = 1, left = -1

        this.size = {small: 50, large: 200};
        this.health = 50;
        this.changeHealth = this.health;
        this.damage = {small: 10, large: 35};
        this.spritesheet = [];
        this.animation = [];

        this.deadCounter = 0;
        this.dead = false;
        this.waitTime = 0;

        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/slime_idle.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/slime_walk.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/slime_attack.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/slime_hurt.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/slime_dead.png")); 
        
        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animation.push(new Animator(this.spritesheet[0], 7, 11, 17, 13, 4, 0.1, 15, false, true));
        this.animation.push(new Animator(this.spritesheet[1], 5, 8, 21, 19, 6, 0.1, 11, false, true));
        this.animation.push(new Animator(this.spritesheet[2], 6, 5, 19, 23, 7, 0.1, 13, false, true));
        this.animation.push(new Animator(this.spritesheet[3], 7, 9, 17, 19, 3, 0.1, 15, false, true));
        this.animation.push(new Animator(this.spritesheet[4], 7, 6, 18, 22, 5, 0.1, 14, false, true));
    
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.BB = new BoundingBox(this.position.x, this.position.y, 90, 65);
    };

    update() {
        if (this.health <= 0) {
            this.state = 4;
            this.deadCounter += this.game.clockTick;
            if (this.deadCounter >= 0.5) {
                this.dead = true;
                this.removeFromWorld = true;
            }
        }
        if (this.state == 3) {
            this.waitTime += this.game.clockTick;
            if (this.waitTime >= 0.25) {
                this.state = 0;
                this.waitTime = 0;
            }
        }

        if (this.player.position.x > this.position.x) { // player is on right side
            this.facing = 1;
        } else if (this.player.position.x < this.position.x) { // player is on left side
            this.facing = -1;
        }

        this.game.entities.forEach(entity => {
            if (entity.BB && this.BB.collide(entity.BB)) {
                if (entity instanceof Player) {
                    this.state = 2
                }
            }
        })
    };

    draw(ctx) {
        ctx.strokeStyle = "red";
        ctx.strokeRect(this.position.x, this.position.y, 90, 65);

        if (this.facing == -1) {
            ctx.save();
            ctx.scale(-1, 1);
        } else if (this.facing == 1) {
            ctx.save();
            ctx.scale(1, 1);
        }

        let stateModX = 0;
        let stateModY = 0;

        if (this.state == 2) stateModY = 50;
        else if (this.state == 3) stateModY = 28;
        else if (this.state == 4) stateModY = 43;
    
        if (this.dead == true) {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, this.position.x, this.position.y, 5);
        } else if (this.facing == 1) {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.position.x - stateModX), (this.position.y - stateModY), 5);
        } else {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.position.x * this.facing) - 90 + (stateModX * this.facing), (this.position.y - stateModY), 5);
        }

        ctx.restore();
    };
}