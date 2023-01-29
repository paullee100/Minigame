class SceneManager {
    constructor(game) {
        Object.assign(this, {game});
        this.game.camera = this;

        this.spawnTime = 0;
        this.xPos = 0;
        this.yPos = 0;
        
        this.x = 0;
        this.y = 0;
        this.player = new Player(this.game, 500, 500)
        this.game.addEntity(this.player);
        this.game.addEntity(new Slime(this.game, 200, 200, this.player));
    };

    update() {
        let midpointwidth = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointheight = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.player.position.x - midpointwidth;
        this.y = this.player.position.y - midpointheight;
        this.spawnSlime();
    };

    spawnSlime() {
        this.spawnTime += this.game.clockTick;
        if (this.spawnTime >= 5) {
            this.game.addEntity(new Slime(this.game, 200 + this.xPos, 200 + this.yPos, this.player));
            this.xPos += 100;
            this.yPos += 100;
            this.spawnTime = 0;
        }
    };

    draw(ctx) {
        
    };
};