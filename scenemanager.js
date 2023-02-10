class SceneManager {
    constructor(game) {
        Object.assign(this, {game});
        this.game.camera = this;
        this.score = 0;

        this.spawnTime = 0;
        this.waitTime = 0;
        this.gameOver = false;
        this.title = true;
        
        this.x = 0;
        this.y = 0;
        this.player = new Player(this.game, 500, 500)
    };

    loadLevel(level) {
        this.title = false;
        this.game.addEntity(this.player);

        if (level.Fence) {
            for (let i = 0; i < level.Fence.length; i++) {
                let fence = level.Fence[i];
                console.log(fence.y);
                this.game.addEntity(new Fence(this.game, fence.x, fence.y, fence.state));
            }
        }

        if (level.Ground) {
            for (let i = 0; i < level.Ground.length; i++) {
                let ground = level.Ground[i];
                for (let row = 0; row < ground.size; row++) {
                    for (let col = 0; col < ground.size; col++) {
                        console.log(PARAMS.BLOCKWIDTH);
                        this.game.addEntity(new Ground(this.game, ground.sprite, ground.x + col * PARAMS.BLOCKWIDTH, ground.y + row * PARAMS.BLOCKWIDTH));
                    }
                }
            }
        }
    };

    clearEntities() {
        this.game.entities.forEach((entity) => {
            entity.removeFromWorld = true;
        });
    };

    update() {
        let midpointwidth = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointheight = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.player.x - midpointwidth;
        this.y = this.player.y - midpointheight;

        if (!this.title) {

            if (this.player.health <= 0) {
                this.waitTime += this.game.clockTick;
                if (this.waitTime >= 0.5) {
                    this.clearEntities();
                    this.gameOver = true;
                }
            }

            this.spawnSlime();
        }
    };

    spawnSlime() {
        if (!this.gameOver) {
            this.spawnTime += this.game.clockTick;
            if (this.spawnTime >= 2.5) {
                let posOrNeg = Math.floor(Math.random() * 2);
                let rand = Math.floor((Math.random() * (3)) + 5)

                if (posOrNeg % 2 == 0) {
                    rand *= -1;
                }

                this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player), 1);
                this.spawnTime = 0;
            }
        }
    };

    draw(ctx) {
        let canvas = document.getElementById("gameWorld");
        canvas.style.backgroundColor = "black";

        if (this.title) {
            ctx.font = "130px serif";
            ctx.fillStyle = "White";
            ctx.fillText("Survival Game", this.x + 75, this.y);

            ctx.font = "130px serif";
            ctx.fillText("Controls:", this.x + 240, this.y + 180)

            ctx.font = "50px serif";
            ctx.fillText("W/Up Arrow - Move Up", this.x + 150, this.y + 260);
            ctx.fillText("S/Down Arrow - Move Down", this.x + 150, this.y + 310);
            ctx.fillText("A/Left Arrow - Move Left", this.x + 150, this.y + 360);
            ctx.fillText("D/Right Arrow - Move Right", this.x + 150, this.y + 410);
            ctx.fillText("Mouse click - Attack", this.x + 150, this.y + 460);

            ctx.fillText("Press F to play", this.x + 275, this.y + 575);

            if (this.game.keys["F"] || this.game.keys["f"]) {
                this.loadLevel(level);
            }

        } else if (this.gameOver) {
            ctx.font = "180px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;
            ctx.fillText("Game Over!", (this.x + 50) - this.x, (this.y + 180)- this.y);

            ctx.font = "90px serif";
            ctx.fillText("You scored: " + this.score + " points", (this.x + 140) - this.x, (this.y + 340) - this.y);
        
            ctx.font = "80px serif";
            ctx.fillText("Press \"space bar\" to try again", (this.x + 45) - this.x, (this.y + 600) - this.y);
        
            if (this.game.keys[" "]) {
                this.gameOver = false;
                this.player.removeFromWorld = false;
                this.player.health = 300;
                this.player.dead = false;
                this.player.state = 0;
                this.score = 0;
                this.x = 0;
                this.y = 0;

                this.loadLevel(level);
            }
        } else {
            ctx.font = "90px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;
            ctx.fillText("Score: " + this.score, (this.x + 30) - this.x, (this.y + 100) - this.y);

            ctx.fillText("Health: " + this.player.health, (this.x + 30) - this.x, (this.y + 200) - this.y);
        }
    };
};