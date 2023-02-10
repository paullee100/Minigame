class Fence {
    constructor(game, x, y, state) {
        Object.assign(this, {game, x, y, state});

        this.spritesheet = [];

        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence00.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence01.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence02.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence03.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence04.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence05.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence06.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence07.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence08.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence09.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence10.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence11.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence12.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence13.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence14.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/fence/fence15.png"));

        this.BB = new BoundingBox(this.x, this.y, 16, 16);
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(this.spritesheet[this.state], this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    };
}

class Ground {
    constructor(game, image, x, y) {
        Object.assign(this, {game, image, x, y});
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    };
}

class GroundDecor {
    constructor(game, image, x, y) {
        Object.assign(this, {game, image, x, y});

        this.spritesheet = [];

        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor0.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor1.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor2.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor3.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor4.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor5.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor6.png"));
        this.spritesheet.push(ASSET_MANAGER.getAsset("./sprites/ground_decor/decor7.png"));
    };

    update() {

    };

    draw(ctx) {
        ctx.drawImage(ASSET_MANAGER.getAsset(this.image), this.x - this.game.camera.x, this.y - this.game.camera.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    };
}