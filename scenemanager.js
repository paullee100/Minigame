class SceneManager {
    constructor(game) {
        Object.assign(this, {game});
        this.game.camera = this;
        this.score = 0;

        this.slimeDefeat = 0;
        this.bossSlimeSpawn = false;

        this.additionalStat = {
            Attack: 1,
            AttackBoundX: 1,
            AttackBoundY: 1,
            Health: 1,
            Revive: 0,
        };

        this.maxExp = 100;

        this.clock = {
            min: 0,
            sec: 0
        };

        this.timers = {
            spawnTime: 0,
            waitTime: 0,
        };

        this.screen = {
            title: true,
            gameOver: false,
            controls: false,
            objective: false,
            pause: false,
            upgrade: false,
            win: false
        };

        this.titleSelect = {
            campaign: false,
            endless: false,
            controls: false
        };

        this.controlSelect = {
            back: false
        };

        this.gameOverSelect = {
            playagain: false,
            title: false
        };

        this.winSelect = {
            playagain: false,
            title: false
        };

        this.mode = {
            campaign: false,
            endless: false
        };
        
        this.x = 0;
        this.y = 0;
        this.player = new Player(this.game, 500, 500);
    };

    loadLevel(level) {
        this.clock.min = 0;
        this.clock.second = 0;
        this.player.removeFromWorld = false;
        this.player.health = 300;
        this.player.dead = false;
        this.player.state = 0;
        this.slimeDefeat = 0;
        this.bossSlimeSpawn = false;
        this.score = 0;
        this.timers.spawnTime = 0;
        this.timers.waitTime = 0;
        this.x = 0;
        this.y = 0;
        if (!this.screen.title && !this.screen.gameOver && !this.screen.controls && !this.screen.objective && !this.screen.win) {
            this.clearBackground();
            this.game.addEntity(this.player);
        }

        if (level.Fence) {
            for (let i = 0; i < level.Fence.length; i++) {
                let fence = level.Fence[i];
                this.game.addEntity(new Fence(this.game, fence.x * PARAMS.BLOCKWIDTH, fence.y * PARAMS.BLOCKWIDTH, fence.state));
            }
        }

        if (level.Ground) {
            const ground = level.Ground[0];
            this.game.addEntity(new Ground(this.game, ground.sprite, ground.x * PARAMS.BLOCKWIDTH, ground.y * PARAMS.BLOCKWIDTH));
        }

        if (level.Background) {
            const background = level.Background[0];
            this.game.addEntity(new Background(this.game, background.sprite, background.x * PARAMS.BLOCKWIDTH, background.y * PARAMS.BLOCKWIDTH));
        }
    };

    clearEntities() {
        this.game.entities.forEach((entity) => {
            entity.removeFromWorld = true;
        });
    };

    clearBackground() {
        this.game.entities.forEach((entity) => {
            if (entity instanceof Background) {
                entity.removeFromWorld = true;
            }
        })
    }

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;

        let midpointwidth = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointheight = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.player.x - midpointwidth;
        this.y = this.player.y - midpointheight;

        if (this.game.keys["Escape"] && this.screen.pause == false) {
            console.log("pause");
            this.screen.pause = true;
            this.game.keys["Escape"] = false;
        } else if (this.game.keys["Escape"] && this.screen.pause == true) {
            console.log("resume");
            this.screen.pause = false;
            this.game.keys["Escape"] = false;
        }

        if (this.screen.title) {
            if (this.game.mouse && this.game.mouse.y < 20 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 15 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 11 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 53 * PARAMS.BLOCKWIDTH) {
                    this.titleSelect.campaign = true;
                    if (this.titleSelect.campaign && this.game.click) {
                        this.screen.title = false;
                        this.titleSelect.campaign = false;
                        this.mode.campaign = true;
                        this.screen.objective = true;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else if (this.game.mouse && this.game.mouse.y < 30 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 25 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 14 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 49.5 * PARAMS.BLOCKWIDTH) {
                    this.titleSelect.endless = true;
                    if (this.titleSelect.endless && this.game.click) {
                        this.screen.title = false;
                        this.titleSelect.endless = false;
                        this.mode.endless = true;
                        this.loadLevel(level);
                        if (this.game.click != null) this.game.click = null;
                    }
            } else if (this.game.mouse && this.game.mouse.y < 40 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 35 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 21 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 43 * PARAMS.BLOCKWIDTH) {
                    this.titleSelect.controls = true;
                    if (this.titleSelect.controls && this.game.click) {
                        this.screen.title = false;
                        this.screen.controls = true;
                        this.titleSelect.controls = false;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else {
                this.titleSelect.campaign = false;
                this.titleSelect.endless = false;
                this.titleSelect.controls = false;
                if (this.game.click != null) this.game.click = null;
            }
        }

        if (this.screen.controls) {
            if (this.game.mouse && this.game.mouse.y < 40 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 34 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 10 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 50.5 * PARAMS.BLOCKWIDTH) {
                    this.controlSelect.back = true;
                    if (this.controlSelect.back && this.game.click) {
                        this.controlSelect.back = false;
                        this.screen.controls = false;
                        this.screen.title = true;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else {
                this.controlSelect.back = false;
                if (this.game.click != null) this.game.click = null;
            }
        }

        if (this.screen.objective) {
            if (this.game.click) {
                this.screen.objective = false;
                this.loadLevel(level);
                if (this.game.click != null) this.game.click = null;
            }
        }

        if (this.screen.gameOver) {
            if (this.game.mouse && this.game.mouse.y < 38 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 35 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 10 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 55 * PARAMS.BLOCKWIDTH) {
                    this.gameOverSelect.playagain = true;
                    if (this.gameOverSelect.playagain && this.game.click) {
                        this.gameOverSelect.playagain = false;
                        this.screen.gameOver = false;
                        this.loadLevel(level);
                        if (this.game.click != null) this.game.click = null;
                    }
            } else if (this.game.mouse && this.game.mouse.y < 46 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 43 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 10 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 54 * PARAMS.BLOCKWIDTH) {
                    this.gameOverSelect.title = true;
                    if (this.gameOverSelect.title && this.game.click) {
                        this.gameOverSelect.title = false;
                        this.screen.gameOver = false;
                        this.screen.title = true;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else {
                this.gameOverSelect.playagain = false;
                this.gameOverSelect.title = false;
                if (this.game.click != null) this.game.click = null;
            }
        }

        if (this.screen.win) {
            if (this.game.mouse && this.game.mouse.y < 38 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 35 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 10 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 55 * PARAMS.BLOCKWIDTH) {
                    this.winSelect.playagain = true;
                    if (this.winSelect.playagain && this.game.click) {
                        this.winSelect.playagain = false;
                        this.screen.win = false;
                        this.loadLevel(level);
                        if (this.game.click != null) this.game.click = null;
                    }
            } else if (this.game.mouse && this.game.mouse.y < 46 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 43 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 10 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 54 * PARAMS.BLOCKWIDTH) {
                    this.winSelect.title = true;
                    if (this.winSelect.title && this.game.click) {
                        this.winSelect.title = false;
                        this.screen.win = false;
                        this.screen.title = true;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else {
                this.winSelect.playagain = false;
                this.winSelect.title = false;
                if (this.game.click != null) this.game.click = null;
            }
        }

        if (!this.screen.title && !this.screen.pause && !this.screen.controls && !this.screen.objective) {
            if (!this.screen.gameOver && !this.screen.win) {

                this.clock.second += this.game.clockTick;
                if (this.clock.second >= 60) {
                    this.clock.second = 0;
                    this.clock.min++;
                }

                if (this.player.health <= 0) {
                    this.timers.waitTime += this.game.clockTick;
                    if (this.timers.waitTime >= 0.5) {
                        this.clearEntities();
                        this.screen.gameOver = true;
                    }
                }

                if (this.player.expPoint >= this.maxExp) {
                    this.screen.upgrade = true;
                    this.player.expPoint -= this.maxExp;
                    this.maxExp *= 1.1

                }
                this.spawnSlime();
            }
        }
    };

    spawnSlime() {
        if (!this.screen.gameOver) {
            if (this.slimeDefeat < 50) {
                this.timers.spawnTime += this.game.clockTick;
                if (this.timers.spawnTime >= 2.5) {
                    let posOrNeg = Math.floor(Math.random() * 2);
                    let rand = Math.floor((Math.random() * (3)) + 5)

                    if (posOrNeg % 2 == 0) {
                        rand *= -1;
                    }

                    this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, false), 1);
                    this.timers.spawnTime = 0;
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

        if (this.screen.title) {
            this.loadLevel(title);
            ctx.font = "100px serif";
            ctx.fillStyle = "Black";
            ctx.fillText("Survival Game", 13 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);

            if (this.titleSelect.campaign) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Campaign Mode", 11 * PARAMS.BLOCKWIDTH, 20 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Campaign Mode", 11 * PARAMS.BLOCKWIDTH, 20 * PARAMS.BLOCKWIDTH);
            }

            if (this.titleSelect.endless) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Endless Mode", 14 * PARAMS.BLOCKWIDTH, 30 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Endless Mode", 14 * PARAMS.BLOCKWIDTH, 30 * PARAMS.BLOCKWIDTH);
            }

            if (this.titleSelect.controls) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Controls", 21 * PARAMS.BLOCKWIDTH, 40 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Controls", 21 * PARAMS.BLOCKWIDTH, 40 * PARAMS.BLOCKWIDTH);
            }
        }

        if (this.screen.objective) {
            ctx.font = "100px serif";
            ctx.fillStyle = "Black";

            ctx.fillText("Objective: ", 20 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);

            ctx.font = "75px serif";
            ctx.fillText("1) Defeat 50 slimes", 1 * PARAMS.BLOCKWIDTH, 20 * PARAMS.BLOCKWIDTH);
            ctx.fillText("2) Defeat the Giant Slime", 1 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Click anywhere to play", 10 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);

        }

        if (this.screen.controls) {
            ctx.font = "100px serif";
            ctx.fillStyle = "Black";

            ctx.fillText("W - Move Up", 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);
            ctx.fillText("S - Move Down", 1 * PARAMS.BLOCKWIDTH, 15 * PARAMS.BLOCKWIDTH);
            ctx.fillText("A - Move Left", 1 * PARAMS.BLOCKWIDTH, 20 * PARAMS.BLOCKWIDTH);
            ctx.fillText("D - Move Right", 1 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            ctx.fillText("K - Attack", 1 * PARAMS.BLOCKWIDTH, 30 * PARAMS.BLOCKWIDTH);

            if (this.controlSelect.back) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Go back to Title", 10 * PARAMS.BLOCKWIDTH, 40 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Go back to Title", 10 * PARAMS.BLOCKWIDTH, 40 * PARAMS.BLOCKWIDTH);
            }

        }

        if (this.screen.gameOver) {
            this.loadLevel(title);
            ctx.font = "100px serif";
            ctx.fillStyle = "Black";
            ctx.fillText("Game Over!", 17 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);

            ctx.font = "75px serif";
            ctx.fillText("You scored:", 22 * PARAMS.BLOCKWIDTH, 18 * PARAMS.BLOCKWIDTH);
            ctx.fillText(this.score + " points", 26 * PARAMS.BLOCKWIDTH, 23 * PARAMS.BLOCKWIDTH);
            ctx.fillText("You survived for:", 17 * PARAMS.BLOCKWIDTH, 29 * PARAMS.BLOCKWIDTH);

            let format = "99:99";

            if (this.clock.sec < 10) {
                format = this.clock.min + ":0" + Math.floor(this.clock.sec);
            } else {
                format = this.clock.min + ":" + Math.floor(this.clock.sec);
            }

            ctx.fillText(format, 29 * PARAMS.BLOCKWIDTH, 34 * PARAMS.BLOCKWIDTH);
            if (this.gameOverSelect.playagain) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Click here to play again", 10 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Click here to play again", 10 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
            }

            if (this.gameOverSelect.title) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Go back to Title Screen", 10 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Go back to Title Screen", 10 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);
            }

        } 
        if (this.screen.win) {
            this.loadLevel(title);
            ctx.font = "100px serif";
            ctx.fillStyle = "Gold";

            ctx.fillText("You Win!", 20 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);

            ctx.fillStyle = "Black";
            
            ctx.font = "75px serif";
            ctx.fillText("You scored:", 22 * PARAMS.BLOCKWIDTH, 18 * PARAMS.BLOCKWIDTH);
            ctx.fillText(this.score + " points", 26 * PARAMS.BLOCKWIDTH, 23 * PARAMS.BLOCKWIDTH);
            
            let format = "99:99";
            if (this.clock.sec < 10) {
                format = this.clock.min + ":0" + Math.floor(this.clock.sec);
            } else {
                format = this.clock.min + ":" + Math.floor(this.clock.sec);
            }

            ctx.fillText("You defeated the game in: ", 10 * PARAMS.BLOCKWIDTH, 29 * PARAMS.BLOCKWIDTH);
            ctx.fillText(format, 29 * PARAMS.BLOCKWIDTH, 34 * PARAMS.BLOCKWIDTH);
            
            if (this.winSelect.playagain) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Click here to play again", 10 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Click here to play again", 10 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
            }

            if (this.winSelect.title) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Go back to Title Screen", 10 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Go back to Title Screen", 10 * PARAMS.BLOCKWIDTH, 46 * PARAMS.BLOCKWIDTH);
            }
        } 
        if (!this.screen.title && !this.screen.gameOver && !this.screen.controls && !this.screen.objective && !this.screen.win) {
            ctx.font = "45px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;
            ctx.fillText("Health: " + this.player.health, 1 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Score: " + this.score, 1 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Slimes defeated: " + this.slimeDefeat + "/50", 1 * PARAMS.BLOCKWIDTH, 9 * PARAMS.BLOCKWIDTH);
            ctx.fillText(this.clock.sec < 10 ? this.clock.min + ":0" + Math.floor(this.clock.sec) : this.clock.min + ":" + Math.floor(this.clock.sec), 1 * PARAMS.BLOCKWIDTH, 12 * PARAMS.BLOCKWIDTH);
            let ratio = this.player.health / this.player.maxhealth;
            ctx.strokeStyle = "black";
            ctx.fillStyle = ratio < 0.2 ? "red" : ratio < 0.5 ? "yellow" : "green";
            if (this.player.health > 0) {
                ctx.fillRect(15 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH * ratio, 2 * PARAMS.BLOCKWIDTH);
            }
            ctx.strokeRect(15 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);

            let ratioEXP = this.player.expPoint / this.maxExp;
            ctx.strokeStyle = "black";
            ctx.fillStyle = "green";
            ctx.fillRect(0 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH, PARAMS.CANVAS_WIDTH * ratioEXP, 0.5 * PARAMS.BLOCKWIDTH);
            ctx.strokeRect(0 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH, PARAMS.CANVAS_WIDTH, 0.5 * PARAMS.BLOCKWIDTH);
        }
    };
};