class Player {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y});

        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};
        this.health = 300;
        this.damage = 1;
        this.facing = 1; // right = 1, left = -1
        this.state = 0; // idle = 0, walk = 1, attack = 2, dead = 3

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
        this.animation.push(new Animator(this.spritesheet[3], 11, 26, 22, 19, 3, 0.1, 29, false, true));
    
        this.updateBB();
    };

    updateBB() {
        this.lastBB = this.BB;
        this.lastSwordBB = this.SwordBB;

        if (this.state == 2) {
            if (this.facing == 1) {
                this.SwordBB = new BoundingBox(this.position.x + 80, this.position.y, 100, 110);
            } else if (this.facing == -1) {
                this.SwordBB = new BoundingBox(this.position.x - 100, this.position.y, 100, 110);
            }
        } else {
            this.SwordBB = new BoundingBox(0, 0, 0, 0);
        }
        this.BB = new BoundingBox(this.position.x, this.position.y, 80, 110);

    };

    update() {
        const RUN = 500;

        const TICK = this.game.clockTick;
        if (this.health <= 0) {
            this.state = 3;
        }

        if (this.game.keys["a"] || this.game.keys["A"] || this.game.keys["ArrowLeft"]) { // move left
            this.facing = -1;
            this.state = 1;
            this.velocity.x = -RUN;

        } else if (this.game.keys["d"] || this.game.keys["D"] || this.game.keys["ArrowRight"]) { // move right
            this.facing = 1;
            this.state = 1;
            this.velocity.x = RUN;

        } else if (this.game.keys["w"] || this.game.keys["W"] || this.game.keys["ArrowUp"]) { // move up
            this.state = 1;
            this.velocity.y = -RUN;
        } else if (this.game.keys["s"] || this.game.keys["S"] || this.game.keys["ArrowDown"]) { // move down
            this.state = 1;
            this.velocity.y = RUN;
        } else if (this.game.keys["k"] || this.game.keys["K"] || this.game.click) { // attack
            this.state = 2
        } else {
            this.state = 0;
            this.velocity.x = 0;
            this.velocity.y = 0;
        };

        this.position.x += this.velocity.x * TICK;
        this.position.y += this.velocity.y * TICK;
        this.updateBB();

        this.game.entities.forEach(entity => {
            if (entity.BB && this.SwordBB.collide(entity.BB)) {
                if (entity instanceof Slime && this.state == 2) {
                    entity.health -= this.damage;
                    entity.state = 3;
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

    };

    draw(ctx) {
        let canvas = document.getElementById("gameWorld");
        canvas.style.backgroundColor = "green";

        ctx.strokeStyle = "red";
        ctx.strokeRect(this.position.x, this.position.y, 80, 110);

        ctx.strokeStyle = "purple";
        ctx.strokeRect(this.position.x + 80, this.position.y, 100, 110);

        ctx.strokeRect(this.position.x - 100, this.position.y, 100, 110);

        if (this.facing == -1) {
            ctx.save();
            ctx.scale(-1, 1);
        } else if (this.facing == 1) {
            ctx.save();
            ctx.scale(1, 1);
        }

        let stateModX = 0;
        let stateModY = 0;

        if (this.facing == 1) {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.position.x - stateModX), (this.position.y - stateModY), 5);
        } else {
            this.animation[this.state].drawFrame(this.game.clockTick, ctx, (this.position.x * this.facing) - 80 + (stateModX * this.facing), (this.position.y - stateModY), 5);
        }
        ctx.restore();
    };
}