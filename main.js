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

// background //

// fence
ASSET_MANAGER.queueDownload("./sprites/fence/fence00.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence01.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence02.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence03.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence04.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence05.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence06.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence07.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence08.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence09.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence10.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence11.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence12.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence13.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence14.png");
ASSET_MANAGER.queueDownload("./sprites/fence/fence15.png");

// ground
ASSET_MANAGER.queueDownload("./sprites/ground/background.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground00.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground01.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground02.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground03.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground04.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground05.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground06.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground07.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground08.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground09.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground10.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground11.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground12.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground13.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground14.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground15.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground16.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground17.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground18.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground19.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground20.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground21.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground22.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground23.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground24.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground25.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground26.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground27.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground28.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground29.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground30.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground31.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground32.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground33.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground34.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground35.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground36.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground37.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground38.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground39.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground40.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground41.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground42.png");
ASSET_MANAGER.queueDownload("./sprites/ground/ground43.png");

// ground decor
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor0.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor1.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor2.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor3.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor4.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor5.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor6.png");
ASSET_MANAGER.queueDownload("./sprites/ground_decor/decor7.png");

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
