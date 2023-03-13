class Slime {
    constructor(game, x, y, player, health, damage, boss) {
        Object.assign(this, {game, x, y, player, health, damage, boss});

        this.game.Slime = this;

        let dist = getDistance(this, this.player);
        this.maxSpeed = boss === true ? 50 : 125;
        this.velocity = {x: (this.player.x - this.x) / dist * this.maxSpeed, y: (this.player.y - this.y) / dist * this.maxSpeed};

        this.state = 0; // idle = 0, walk = 1, attack = 2, hurt = 3, dead = 4
        this.facing = 1; // right = 1, left = -1

        this.health = boss === true ? 200 : 50 * health;
        this.maxhealth = boss === true ? 200 : 50 * health;
        this.damage = boss === true ? 50 : 25 * damage;
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
        this.animation.push(new Animator(this.spritesheet[2], 6, 5, 19, 23, 7, 0.1, 13, false, false));
        this.animation.push(new Animator(this.spritesheet[3], 7, 9, 17, 19, 3, 0.1, 15, false, false));
        this.animation.push(new Animator(this.spritesheet[4], 7, 6, 18, 22, 5, 0.1, 14, false, false));
    
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        if (this.boss === true) {
            this.BB = new BoundingBox(this.x, this.y, 270 * PARAMS.SCALE, 195 * PARAMS.SCALE);
        } else {
            this.BB = new BoundingBox(this.x, this.y, 36 * PARAMS.SCALE, 26 * PARAMS.SCALE);
        }
    };

    update() {
        if (!this.game.camera.screen.pause && !this.game.camera.screen.upgrade) {
            
            if (this.health <= 0) {
                this.state = 4;
                this.deadCounter += this.game.clockTick;
                if (this.animation[this.state].isDone()) {
                    this.game.camera.slimeDefeat++;
                    this.game.camera.score += 100;
                    if (this.game.camera.mode.endless) {
                        this.game.camera.player.expPoint += 5;
                    }
                    this.dead = true;
                    this.removeFromWorld = true;
                    if (this.boss === true) {
                        this.game.camera.clearEntities();
                        this.game.camera.screen.win = true;
                        this.game.camera.screen.gameplay = false;
                    }
                }
            } else if (this.state == 1) {
                let dist = getDistance(this, this.player);
                this.velocity = {x: (this.player.x - this.x) / dist * this.maxSpeed, y: (this.player.y - this.y) / dist * this.maxSpeed};
            } else if (this.state == 3) {
                this.velocity.x = 0;
                this.velocity.y = 0;
                if (this.animation[this.state].isDone()) {
                    this.state = 1;
                    this.animation[3].elapsedTime = 0;
                }
            } else {
                this.state = 1;
            }

            if (this.player.x > this.x) { // player is on right side
                this.facing = 1;
            } else if (this.player.x < this.x) { // player is on left side
                this.facing = -1;
            }

            this.x += this.velocity.x * this.game.clockTick;
            this.y += this.velocity.y * this.game.clockTick;

            this.game.entities.forEach(entity => {
                if (entity.BB && this.BB.collide(entity.BB)) {
                    if (entity instanceof Player && this.health > 0) {
                        this.state = 2;
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                        if (this.animation[this.state].isDone()) {
                            if (entity.BB && this.BB.collide(entity.BB)) {
                                entity.health -= this.damage;
                            }
                            this.state = 1;
                            this.animation[2].elapsedTime = 0;
                        }
                    }
                }
            });

            this.updateBB();
        }

        if (this.animation[this.state].isDone()) {
            let tempState = this.state;
            this.state = 0;
            this.animation[tempState].elapsedTime = 0;
        }
    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            if (this.boss === false) {
                ctx.strokeStyle = "red";
                ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, 36 * PARAMS.SCALE, 26 * PARAMS.SCALE);
            } else if (this.boss === true) {
                ctx.strokeStyle = "red";
                ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, 270 * PARAMS.SCALE, 195 * PARAMS.SCALE);
            }
        }

        if (this.facing == -1) {
            ctx.save();
            ctx.scale(-1, 1);
        } else if (this.facing == 1) {
            ctx.save();
            ctx.scale(1, 1);
        }

        let stateModX = 0;
        let stateModY = 0;

        if (this.boss === false) {
            if (this.state == 1) stateModX = 4 * PARAMS.SCALE, stateModY = 12 * PARAMS.SCALE;
            else if (this.state == 2) stateModY = 10 * PARAMS.SCALE;
            else if (this.state == 3) stateModY = 5.6 * PARAMS.SCALE;
            else if (this.state == 4) stateModY = 8.6 * PARAMS.SCALE;
        } else if (this.boss === true) {
            if (this.state == 1) stateModX = 30 * PARAMS.SCALE, stateModY = 90 * PARAMS.SCALE;
            else if (this.state == 2) stateModX = 10 * PARAMS.SCALE, stateModY = 150 * PARAMS.SCALE;
            else if (this.state == 3) stateModY = 84 * PARAMS.SCALE;
            else if (this.state == 4) stateModY = 129 * PARAMS.SCALE;
        }
    
        if (this.boss === false) {
            if (this.facing == 1) {
                this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x - stateModX) - this.game.camera.x, (this.y - stateModY) - this.game.camera.y, 2 * PARAMS.SCALE);
            } else if (this.facing == -1) {
                this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x * this.facing) - (36 * PARAMS.SCALE) + (stateModX * this.facing) - (this.game.camera.x * this.facing), (this.y - stateModY) - this.game.camera.y, 2 * PARAMS.SCALE);
            }
        } else if (this.boss === true) {
            if (this.facing == 1) {
                this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x - stateModX) - this.game.camera.x, (this.y - stateModY) - this.game.camera.y, 15 * PARAMS.SCALE);
            } else if (this.facing == -1) {
                this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x * this.facing) - (270 * PARAMS.SCALE) + (stateModX * this.facing) - (this.game.camera.x * this.facing), (this.y - stateModY) - this.game.camera.y, 15 * PARAMS.SCALE);
            }
        }

        ctx.restore();
    };
}