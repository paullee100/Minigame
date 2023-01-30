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
        this.game.addEntity(this.player);
        this.game.addEntity(new Slime(this.game, 200, 200, this.player));
    };

    clearEntities() {
        this.game.entities.forEach((entity) => {
            entity.removeFromWorld = true;
        });
    }

    update() {
        let midpointwidth = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointheight = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.player.x - midpointwidth;
        this.y = this.player.y - midpointheight;

        if (this.player.health <= 0) {
            this.waitTime += this.game.clockTick;
            if (this.waitTime >= 0.5) {
                this.clearEntities();
                this.gameOver = true;
            }
        }

        this.spawnSlime();
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

                this.game.addEntity(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player));
                this.spawnTime = 0;
            }
        }
    };

    draw(ctx) {

        if (this.title) {

        } else if (this.gameOver) {
            ctx.font = "bold 180px Comic Sans MS";
            ctx.strokeStyle = "White";
            ctx.lineWidth = 2;
            ctx.strokeText("Game Over!", (this.x + 15) - this.x, (this.y + 180)- this.y);

            ctx.font = "bold 45px Comic Sans MS";
            ctx.strokeText("You scored: " + this.score + " points", (this.x + 15) - this.x, (this.y + 340) - this.y);
        
            ctx.font = "bold 50px Comic Sans MS";
            ctx.strokeText("Press \"space bar\" to try again", (this.x + 120) - this.x, (this.y + 600) - this.y);
        
            if (this.game.keys[" "]) {
                this.gameOver = false;
                this.game.addEntity(this.player);
                this.player.removeFromWorld = false;
                this.player.health = 300;
                this.player.dead = false;
                this.player.state = 0;
                this.score = 0;
                this.x = 0;
                this.y = 0; 
            }
        } else {
            ctx.font = "bold 90px Comic Sans MS";
            ctx.strokeStyle = "White";
            ctx.lineWidth = 2;
            ctx.strokeText("Score: " + this.score, (this.x + 30) - this.x, (this.y + 100) - this.y);
        }
    };
};