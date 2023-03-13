class Fence {
    constructor(game, x, y, state) {
        Object.assign(this, {game, x, y, state});

        if (x == 63 * PARAMS.BLOCKWIDTH && state == 4) {
            this.BB = new BoundingBox(x - PARAMS.BLOCKWIDTH, y, 2 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
        } else if (y == 63 * PARAMS.BLOCKWIDTH && state == 14) {
            this.BB = new BoundingBox(x, y - PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
        } else {
            this.BB = new BoundingBox(x, y, 2 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
        }
    };

    update() {

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            if (this.x == 63 * PARAMS.BLOCKWIDTH && this.state == 4) {
                ctx.strokeRect(this.x - PARAMS.BLOCKWIDTH - this.game.camera.x, this.y - this.game.camera.y, 32, 32);
            } else if (this.y == 63 * PARAMS.BLOCKWIDTH && this.state == 14) {
                ctx.strokeRect(this.x - this.game.camera.x, this.y - PARAMS.BLOCKWIDTH - this.game.camera.y, 32, 32);
            } else {
                ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, 32, 32);
            }
        }
    };
}

class Ground {
    constructor(game, image, x, y) {
        Object.assign(this, {game, image, x, y});
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x - this.game.camera.x, this.y - this.game.camera.y, 1024 * PARAMS.SCALE, 1024 * PARAMS.SCALE);
    };
}

class Background {
    constructor(game, image, x, y) {
        Object.assign(this, {game, image, x, y});

    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x, this.y, 1024, 768);
    };
}