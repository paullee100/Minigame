class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.velocity = {x: 0, y: 0};
        this.health = 300;
        this.maxhealth = 300;
        this.damage = 1;
        this.attackYBB = 22;
        this.attackXBB = 20;
        this.experience = 0;
        this.facing = 1; // right = 1, left = -1
        this.state = 0; // idle = 0, walk = 1, attack = 2, dead = 3

        this.deathCounter = 0;
        this.dead = false;

        this.spritesheet = [];
        this.animation = [];

        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/player_idle.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/player_walk.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/player_attack.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/player_dead.png"));

        //spritesheet, xStart, yStart, width, height, frameCount, frameDuration, framePadding, reverse, loop
        this.animation.push(new Animator(this.spritesheet[0], 16, 21, 16, 22, 6, 0.1, 32, false, true));
        this.animation.push(new Animator(this.spritesheet[1], 16, 18, 16, 24, 6, 0.1, 32, false, true));
        this.animation.push(new Animator(this.spritesheet[2], 8, 22, 36, 25, 4, 0.1, 10, false, false));
        this.animation.push(new Animator(this.spritesheet[3], 11, 26, 22, 19, 3, 0.1, 29, false, false));
    
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.lastSwordBB = this.SwordBB;

        if (this.state == 2) {
            if (this.facing == 1) {
                this.SwordBB = new BoundingBox((this.x + (16 * PARAMS.SCALE)), this.y, 20 * PARAMS.SCALE, 22 * PARAMS.SCALE);
            } else if (this.facing == -1) {
                this.SwordBB = new BoundingBox((this.x - (20 * PARAMS.SCALE)), this.y, 20 * PARAMS.SCALE, 22 * PARAMS.SCALE);
            }
        } else {
            this.SwordBB = new BoundingBox(0, 0, 0, 0);
        }
        this.BB = new BoundingBox(this.x, this.y, 16 * PARAMS.SCALE, 22 * PARAMS.SCALE);

    };

    update() {
        // When resuming, player won't immediately attack.
        if (this.game.click != null) {
            this.game.click = null;
        }
        if (!this.game.camera.pause) {
            if (!this.dead) {
                const RUN = 500;

                const TICK = this.game.clockTick;
                this.damage *= this.game.camera.additionalStat.Attack;
                this.attackXBB *= this.game.camera.additionalStat.AttackBoundX;
                this.attackYBB *= this.game.camera.additionalStat.AttackBoundY;
                this.health *= this.game.camera.additionalStat.Health;
                this.maxhealth *= this.game.camera.additionalStat.Health;

                if (this.health <= 0 && this.game.camera.additionalStat.Revive == 0) {
                    this.velocity.x = 0;
                    this.velocity.y = 0;
                    this.health = 0;
                    this.state = 3;
                    this.deathCounter += TICK;
                    if (this.animation[this.state].isDone()) {
                        this.dead = true;
                        this.removeFromWorld = true;
                        
                    }
                } else {
                    this.game.camera.additionalStat.Revive--;
                    this.health = this.maxhealth;
                }

                if (this.state !== 2) {
                    if (this.game.keys["A"]) { // move left
                        this.facing = -1;
                        this.state = 1;
                        this.velocity.x = -RUN;

                    } else if (this.game.keys["D"]) { // move right
                        this.facing = 1;
                        this.state = 1;
                        this.velocity.x = RUN;

                    } else if (this.game.keys["W"]) { // move up
                        this.state = 1;
                        this.velocity.y = -RUN;
                    } else if (this.game.keys["S"]) { // move down
                        this.state = 1;
                        this.velocity.y = RUN;
                    } else {
                        this.state = 0;
                        this.velocity.x = 0;
                        this.velocity.y = 0;
                    }
                }

                if (this.game.keys["K"] || this.game.click) { // attack
                    this.state = 2;
                }

                let secret = false;
                if (this.game.keys["K"] && this.game.keys["Z"]) {
                    secret = true;
                };

                if (secret == true) {
                    this.game.entities.forEach(entity => {
                        if (entity instanceof Slime) {
                            if (entity.boss !== true) {
                                entity.health -= 50;
                            }
                        }
                    })
                    secret = false;
                }

                this.x += this.velocity.x * TICK;
                this.y += this.velocity.y * TICK;
                this.updateBB();

                this.game.entities.forEach(entity => {
                    if (entity.BB && this.SwordBB.collide(entity.BB)) {
                        if (entity instanceof Slime && this.state == 2) {
                            entity.health -= this.damage;
                            entity.state = 3;
                        }
                    }
                    
                    if (entity.BB && this.BB.collide(entity.BB)) {
                        if (entity instanceof Fence) {
                            if (entity.state == 4) {
                                if (this.BB.left <= entity.BB.right && this.velocity.x < 0) {
                                    this.x = entity.BB.right;
                                } else if (this.BB.right >= entity.BB.left && this.velocity.x > 0) {
                                    this.x = entity.BB.left - PARAMS.BLOCKWIDTH;
                                }
                            }

                            if (entity.state == 14) {
                                if (this.BB.top <= entity.BB.bottom && this.velocity.y < 0) {
                                    this.y = entity.BB.bottom;
                                } else if (this.BB.bottom >= entity.BB.top && this.velocity.y > 0) {
                                    this.y = entity.BB.top - PARAMS.BLOCKWIDTH;
                                }
                            }
                        }
                    }
                })

                if (this.animation[this.state].isDone()) {
                    let tempState = this.state;
                    this.state = 0;
                    this.animation[tempState].elapsedTime = 0;
                    if (this.game.click != null) {
                        this.game.click = null;
                    }
                }
            }
        }

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, 16 * PARAMS.SCALE, 22 * PARAMS.SCALE);

            ctx.strokeStyle = "purple";
            ctx.strokeRect((this.x + (16 * PARAMS.SCALE)) - this.game.camera.x, this.y - this.game.camera.y, 20 * PARAMS.SCALE, 22 * PARAMS.SCALE);

            ctx.strokeRect((this.x - (20 * PARAMS.SCALE)) - this.game.camera.x, this.y - this.game.camera.y, 20 * PARAMS.SCALE, 22 * PARAMS.SCALE);
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

        if (this.dead == true) {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x - stateModX) - this.game.camera.x, (this.y - stateModY) - this.game.camera.y, PARAMS.SCALE);
        } else if (this.facing == 1) {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x - stateModX) - this.game.camera.x, (this.y - stateModY) - this.game.camera.y, PARAMS.SCALE);
        } else if (this.facing == -1) {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.x * this.facing) - (16 * PARAMS.SCALE) + (stateModX * this.facing) - (this.game.camera.x * this.facing), (this.y - stateModY) - this.game.camera.y, PARAMS.SCALE);
        }
        ctx.restore();
    };
}