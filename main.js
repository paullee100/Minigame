const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// player
ASSET_MANAGER.queueDownload("./sprites/player_idle.png");
ASSET_MANAGER.queueDownload("./sprites/player_walk.png");
ASSET_MANAGER.queueDownload("./sprites/player_attack.png");
ASSET_MANAGER.queueDownload("./sprites/player_dead.png");

// enemies
ASSET_MANAGER.queueDownload("./sprites/slime_idle.png");
ASSET_MANAGER.queueDownload("./sprites/slime_walk.png");
ASSET_MANAGER.queueDownload("./sprites/slime_attack.png");
ASSET_MANAGER.queueDownload("./sprites/slime_hurt.png");
ASSET_MANAGER.queueDownload("./sprites/slime_dead.png");

// background
ASSET_MANAGER.queueDownload("./sprites/plains.png");
ASSET_MANAGER.queueDownload("./sprites/fences.png");
ASSET_MANAGER.queueDownload("./sprites/decor_16x16.png");

ASSET_MANAGER.downloadAll(() => {
	PARAMS.BLOCKWIDTH = PARAMS.BITWIDTH * PARAMS.SCALE;

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	PARAMS.CANVAS_WIDTH = canvas.width;
	PARAMS.CANVAS_HEIGHT = canvas.height;
	ctx.imageSmoothingEnabled = false;

	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();
});