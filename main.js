const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

// title
ASSET_MANAGER.queueDownload("./sprites/title/titleBackground.png");

// player
ASSET_MANAGER.queueDownload("./sprites/player_idle.png");
ASSET_MANAGER.queueDownload("./sprites/player_walk.png");
ASSET_MANAGER.queueDownload("./sprites/player_attack.png");
ASSET_MANAGER.queueDownload("./sprites/player_dead.png");

// upgrades
ASSET_MANAGER.queueDownload("./sprites/upgrade/strength.png");
ASSET_MANAGER.queueDownload("./sprites/upgrade/fishing_rodX.png");
ASSET_MANAGER.queueDownload("./sprites/upgrade/fishing_rodY.png");
ASSET_MANAGER.queueDownload("./sprites/upgrade/health_boost.png");
ASSET_MANAGER.queueDownload("./sprites/upgrade/totem_of_undying.png");

// enemies
ASSET_MANAGER.queueDownload("./sprites/slime_idle.png");
ASSET_MANAGER.queueDownload("./sprites/slime_walk.png");
ASSET_MANAGER.queueDownload("./sprites/slime_attack.png");
ASSET_MANAGER.queueDownload("./sprites/slime_hurt.png");
ASSET_MANAGER.queueDownload("./sprites/slime_dead.png");

// ground
ASSET_MANAGER.queueDownload("./sprites/ground/background.png");

// music
ASSET_MANAGER.queueDownload("./sound/music/backgroundMusic.mp4");

ASSET_MANAGER.downloadAll(() => {
	
	ASSET_MANAGER.autoRepeat("./sound/music/backgroundMusic.mp4");
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
