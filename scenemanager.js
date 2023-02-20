class SceneManager {
    constructor(game) {
        Object.assign(this, {game});
        this.game.camera = this;
        this.score = 0;

        this.min = 0;
        this.second = 0;
        this.slimeDefeat = 0;
        this.bossSlimeSpawn = false;

        this.spawnTime = 0;
        this.waitTime = 0;
        this.win = false;
        this.gameOver = false;
        this.title = true;
        
        this.x = 0;
        this.y = 0;
        this.player = new Player(this.game, 500, 500)
    };

    loadLevel(level) {
        this.game.addEntity(this.player);

        this.min = 0;
        this.second = 0;
        this.player.removeFromWorld = false;
        this.player.health = 300;
        this.player.dead = false;
        this.player.state = 0;
        this.slimeDefeat = 0;
        this.bossSlimeSpawn = false;
        this.score = 0;
        this.spawnTime = 0;
        this.waitTime = 0;
        this.x = 0;
        this.y = 0;

        if (level.Fence) {
            for (let i = 0; i < level.Fence.length; i++) {
                let fence = level.Fence[i];
                this.game.addEntity(new Fence(this.game, fence.x * PARAMS.BLOCKWIDTH, fence.y * PARAMS.BLOCKWIDTH, fence.state));
            }
        }

        if (level.Ground) {
            for (let i = 0; i < level.Ground.length; i++) {
                let ground = level.Ground[i];
                for (let row = 0; row < ground.size; row++) {
                    for (let col = 0; col < ground.size; col++) {
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
        PARAMS.DEBUG = document.getElementById("debug").checked;

        let midpointwidth = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointheight = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.player.x - midpointwidth;
        this.y = this.player.y - midpointheight;

        if (!this.title && !this.gameOver && !this.win) {

            this.second += this.game.clockTick;
            if (this.second >= 60) {
                this.second = 0;
                this.min++;
            }

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
            if (this.slimeDefeat < 50) {
                this.spawnTime += this.game.clockTick;
                if (this.spawnTime >= 2.5) {
                    let posOrNeg = Math.floor(Math.random() * 2);
                    let rand = Math.floor((Math.random() * (3)) + 5)

                    if (posOrNeg % 2 == 0) {
                        rand *= -1;
                    }

                    this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, false), 1);
                    this.spawnTime = 0;
                }
            } else if (!this.bossSlimeSpawn) {
                this.game.addEntityAtIndex(new Slime(this.game, 0, 0, this.player, true), 1);
                this.bossSlimeSpawn = true;
            }
        }
    };

    draw(ctx) {
        let canvas = document.getElementById("gameWorld");
        canvas.style.backgroundColor = "black";

        this.timer += this.game.clockTick;

        if (this.title) {
            ctx.font = "100px serif";
            ctx.fillStyle = "White";
            ctx.fillText("Survival Game", 13 * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);

            ctx.fillText("Controls:", 1 * PARAMS.BLOCKWIDTH, 12 * PARAMS.BLOCKWIDTH);

            ctx.font = "50px serif";
            ctx.fillText("W - Move Up", 2 * PARAMS.BLOCKWIDTH, 16 * PARAMS.BLOCKWIDTH);
            ctx.fillText("S - Move Down", 2 * PARAMS.BLOCKWIDTH, 19 * PARAMS.BLOCKWIDTH);
            ctx.fillText("A - Move Left", 2 * PARAMS.BLOCKWIDTH, 22 * PARAMS.BLOCKWIDTH);
            ctx.fillText("D - Move Right", 2 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            ctx.fillText("K/Mouse click - Attack", 2 * PARAMS.BLOCKWIDTH, 28 * PARAMS.BLOCKWIDTH);

            ctx.fillText("Press F to play", 23 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);

            ctx.font = "100px serif";
            ctx.fillText("Objective: ", 2 * PARAMS.BLOCKWIDTH, 34 * PARAMS.BLOCKWIDTH);
            ctx.font = "75px serif";
            ctx.fillStyle = "Red";
            ctx.fillText("Defeat 50 slimes", 29 * PARAMS.BLOCKWIDTH, 34 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Then defeat the giant slime", 2 * PARAMS.BLOCKWIDTH, 40 * PARAMS.BLOCKWIDTH);

            if (this.game.keys["F"] || this.game.keys["f"]) {
                this.title = false;
                this.loadLevel(level);
            }

        } else if (this.gameOver) {
            ctx.font = "100px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;
            ctx.fillText("Game Over!", 16 * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);

            ctx.font = "90px serif";
            ctx.fillText("You scored: " + this.score + " points", 1 * PARAMS.BLOCKWIDTH, 15 * PARAMS.BLOCKWIDTH);
            ctx.fillText("You survived for ", 1 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            ctx.fillText(this.second < 10 ? this.min + ":0" + Math.floor(this.second) : this.min + ":" + Math.floor(this.second), 41 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
        
            ctx.font = "80px serif";
            ctx.fillText("Press \"F\" to play again", 9 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);
        
            if (this.game.keys["f"] || this.game.keys["F"]) {
                this.gameOver = false;
                this.loadLevel(level);
            }
        } else if (this.win) {
            ctx.font = "100px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;

            ctx.fillText("You Win!", 18 * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
            
            ctx.font = "90px serif";
            ctx.fillText("You scored: " + this.score + " points", 1 * PARAMS.BLOCKWIDTH, 15 * PARAMS.BLOCKWIDTH);
            ctx.fillText("You defeated the game in ", 1 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            ctx.fillText(this.second < 10 ? this.min + ":0" + Math.floor(this.second) : this.min + ":" + Math.floor(this.second), 1 * PARAMS.BLOCKWIDTH, 30 * PARAMS.BLOCKWIDTH);
            
            ctx.font = "80px serif";
            ctx.fillText("Press \"W\" to play again", 9 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);

            if (this.game.keys["w"] || this.game.keys["W"]) {
                this.win = false;
                this.loadLevel(level);
            }

        } else {
            ctx.font = "45px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;
            ctx.fillText("Health: " + this.player.health, 1 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Score: " + this.score, 1 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Slimes defeated: " + this.slimeDefeat + "/50", 1 * PARAMS.BLOCKWIDTH, 9 * PARAMS.BLOCKWIDTH);
            ctx.fillText(this.second < 10 ? this.min + ":0" + Math.floor(this.second) : this.min + ":" + Math.floor(this.second), 1 * PARAMS.BLOCKWIDTH, 12 * PARAMS.BLOCKWIDTH);
            let ratio = this.player.health / this.player.maxhealth;
            ctx.strokeStyle = "black";
            ctx.fillStyle = ratio < 0.2 ? "red" : ratio < 0.5 ? "yellow" : "green";
            if (this.player.health > 0) {
                ctx.fillRect(15 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH * ratio, 2 * PARAMS.BLOCKWIDTH);
            }
            ctx.strokeRect(15 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);

        }
    };
};