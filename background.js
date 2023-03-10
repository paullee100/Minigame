class Fence {
    constructor(game, x, y, state) {
        Object.assign(this, {game, x, y, state});

        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    };

    update() {

    };

    draw(ctx) {
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(this.x - this.game.camera.x, this.y - this.game.camera.y, 16, 16);
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

    };
}

class GroundDecor {
    constructor(game, image, x, y) {
        Object.assign(this, {game, image, x, y});

        };

    update() {

    };

    draw(ctx) {

    };
}