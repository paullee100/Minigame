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

        this.upgradeImage = [];
        this.upgradeImage.push(ASSET_MANAGER.getAsset("./sprites/upgrade/strength.png"));
        this.upgradeImage.push(ASSET_MANAGER.getAsset("./sprites/upgrade/fishing_rodX.png"));
        this.upgradeImage.push(ASSET_MANAGER.getAsset("./sprites/upgrade/fishing_rodY.png"));
        this.upgradeImage.push(ASSET_MANAGER.getAsset("./sprites/upgrade/health_boost.png"));
        this.upgradeImage.push(ASSET_MANAGER.getAsset("./sprites/upgrade/totem_of_undying.png"));

        // 0 - Attack
        // 1 - AttackBoundX
        // 2 - AttackBoundY
        // 3 - Health
        // 4 - Revive
        this.upgrades = [0, 1, 2, 3, 4];
        this.upgradeSlot = [];

        this.maxExp = 250;

        this.clock = {
            min: 0,
            sec: 0
        };

        this.timers = {
            spawnTime: 0,
            randomTime: 3
        };

        this.screen = {
            title: true,
            gameOver: false,
            controls: false,
            objective: false,
            endless: false,
            pause: false,
            upgrade: false,
            win: false,
            gameplay: false
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

        this.pauseSelect = {
            resume: false,
            return: false
        };

        this.upgradeSelect = {
            one: false,
            two: false,
            three: false
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
        if (level != title) {
            this.clock.min = 0;
            this.clock.sec = 0;
            this.player.expPoint = 0;
            this.player.removeFromWorld = false;
            this.player.health = this.player.maxhealth;
            this.player.dead = false;
            this.player.state = 0;
            this.player.x = 500;
            this.player.y = 500;
            this.slimeDefeat = 0;
            this.bossSlimeSpawn = false;
            this.score = 0;
            this.maxExp = 250;
            this.timers.spawnTime = 0;
            this.x = 0;
            this.y = 0;
        }
        if (!this.screen.title && !this.screen.gameOver && !this.screen.controls && !this.screen.objective && !this.screen.win) {
            this.clearBackground();
            this.screen.gameplay = true;
            this.game.addEntity(this.player);
        }

        if (level.Music && !this.screen.title) {
            ASSET_MANAGER.pauseBackgroundMusic();
            ASSET_MANAGER.playAsset(level.Music);
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

    updateAudio() {
        let mute = document.getElementById("mute").checked;
        let volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    }

    update() {
        PARAMS.DEBUG = document.getElementById("debug").checked;

        let midpointwidth = PARAMS.CANVAS_WIDTH / 2 - PARAMS.BLOCKWIDTH / 2;
        let midpointheight = PARAMS.CANVAS_HEIGHT / 2 - PARAMS.BLOCKWIDTH / 2;
        this.x = this.player.x - midpointwidth;
        this.y = this.player.y - midpointheight;

        if (!this.screen.gameplay) {
            ASSET_MANAGER.pauseBackgroundMusic();
        }

        if (!this.screen.upgrade) {
            if (this.game.keys["Escape"] && this.screen.gameplay && this.screen.pause == false) {
                console.log("pause");
                this.screen.pause = true;
                this.game.keys["Escape"] = false;
            } else if (this.game.keys["Escape"] && this.screen.gameplay && this.screen.pause == true) {
                console.log("resume");
                this.screen.pause = false;
                this.game.keys["Escape"] = false;
            }
        }

        if (this.screen.title) {
            this.mode.campaign = false;
            this.mode.endless = false;
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
                        this.screen.endless = true;
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

        if (this.screen.endless) {
            if (this.game.click) {
                this.screen.endless = false;
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

        if (this.screen.upgrade) {
            if (this.game.mouse && this.game.mouse.y < 38 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 15 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 0 && this.game.mouse.x < 20 * PARAMS.BLOCKWIDTH) {
                    this.upgradeSelect.one = true;
                    if (this.upgradeSelect.one && this.game.click) {
                        this.upgradeSelect.one = false;
                        this.screen.upgrade = false;
                        if (this.upgradeSlot[0] == 0) {
                            this.additionalStat.Attack += 0.05;
                            this.player.damage *= this.additionalStat.Attack;
                        } else if (this.upgradeSlot[0] == 1) {
                            this.additionalStat.AttackBoundX += 0.025;
                            this.player.attackXBB *= this.additionalStat.AttackBoundX;
                        } else if (this.upgradeSlot[0] == 2) {
                            this.additionalStat.AttackBoundY += 0.025;
                            this.player.attackYBB *= this.additionalStat.AttackBoundY;
                        } else if (this.upgradeSlot[0] == 3) {
                            this.additionalStat.Health = Math.floor(this.additionalStat.Health) + 0.1;
                            this.player.health = Math.floor(this.player.health * this.additionalStat.Health);
                            this.player.maxhealth = Math.floor(this.player.maxhealth * this.additionalStat.Health);
                        } else if (this.upgradeSlot[0] == 4) {
                            this.additionalStat.Revive++;
                        }
                        this.resetUpgradeArray();
                        if (this.game.click != null) this.game.click = null;

                    }

            } else if (this.game.mouse && this.game.mouse.y < 38 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 15 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 23 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 43 * PARAMS.BLOCKWIDTH) {
                    this.upgradeSelect.two = true;
                    if (this.upgradeSelect.two && this.game.click) {
                        this.upgradeSelect.two = false;
                        this.screen.upgrade = false;
                        if (this.upgradeSlot[1] == 0) {
                            this.additionalStat.Attack += 0.05;
                            this.player.damage *= this.additionalStat.Attack;
                        } else if (this.upgradeSlot[1] == 1) {
                            this.additionalStat.AttackBoundX += 0.025;
                            this.player.attackXBB *= this.additionalStat.AttackBoundX;
                        } else if (this.upgradeSlot[1] == 2) {
                            this.additionalStat.AttackBoundY += 0.025;
                            this.player.attackYBB *= this.additionalStat.AttackBoundY;
                        } else if (this.upgradeSlot[1] == 3) {
                            this.additionalStat.Health = Math.floor(this.additionalStat.Health) + 0.1;
                            this.player.health = Math.floor(this.player.health * this.additionalStat.Health);
                            this.player.maxhealth = Math.floor(this.player.maxhealth * this.additionalStat.Health);
                        } else if (this.upgradeSlot[1] == 4) {
                            this.additionalStat.Revive++;
                        }
                        this.resetUpgradeArray();
                        if (this.game.click != null) this.game.click = null;
                    }

            } else if (this.game.mouse && this.game.mouse.y < 38 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 15 * PARAMS.BLOCKWIDTH
                && this.game.mouse.x > 46 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 66 * PARAMS.BLOCKWIDTH) {
                    this.upgradeSelect.three = true;
                    if (this.upgradeSelect.three && this.game.click) {
                        this.upgradeSelect.three = false;
                        this.screen.upgrade = false;
                        if (this.upgradeSlot[2] == 0) {
                            this.additionalStat.Attack += 0.05;
                            this.player.damage *= this.additionalStat.Attack;
                        } else if (this.upgradeSlot[2] == 1) {
                            this.additionalStat.AttackBoundX += 0.025;
                            this.player.attackXBB *= this.additionalStat.AttackBoundX;
                        } else if (this.upgradeSlot[2] == 2) {
                            this.additionalStat.AttackBoundY += 0.025;
                            this.player.attackYBB *= this.additionalStat.AttackBoundY;
                        } else if (this.upgradeSlot[2] == 3) {
                            this.additionalStat.Health = Math.floor(this.additionalStat.Health) + 0.1;
                            this.player.health = Math.floor(this.player.health * this.additionalStat.Health);
                            this.player.maxhealth = Math.floor(this.player.maxhealth * this.additionalStat.Health);
                        } else if (this.upgradeSlot[2] == 4) {
                            this.additionalStat.Revive++;
                        }
                        this.resetUpgradeArray();
                        if (this.game.click != null) this.game.click = null;
                    }

            } else {
                this.upgradeSelect.one = false;
                this.upgradeSelect.two = false;
                this.upgradeSelect.three = false;
                if (this.game.click != null) this.game.click = null;
            }
        }

        if (this.screen.pause && this.screen.gameplay && !this.screen.upgrade) {
            if (this.game.mouse && this.game.mouse.y < 25 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 20 * PARAMS.BLOCKWIDTH &&
                this.game.mouse.x > 22 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 42 * PARAMS.BLOCKWIDTH) {
                    this.pauseSelect.resume = true;
                    if (this.pauseSelect.resume && this.game.click) {
                        this.pauseSelect.resume = false;
                        this.screen.pause = false;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else if (this.game.mouse && this.game.mouse.y < 35 * PARAMS.BLOCKWIDTH && this.game.mouse.y > 30 * PARAMS.BLOCKWIDTH &&
                this.game.mouse.x > 14 * PARAMS.BLOCKWIDTH && this.game.mouse.x < 50.5 * PARAMS.BLOCKWIDTH) {
                    this.pauseSelect.return = true;
                    if (this.pauseSelect.return && this.game.click) {
                        this.pauseSelect.return = false;
                        this.screen.pause = false;
                        this.screen.gameplay = false;
                        this.clearEntities();
                        this.screen.title = true;
                        if (this.game.click != null) this.game.click = null;
                    }
            } else {
                this.pauseSelect.resume = false;
                this.pauseSelect.return = false;
                if (this.game.click != null) this.game.click = null;
            }
        }

        // gameplay
        if (this.screen.gameplay && !this.screen.pause & !this.screen.upgrade) {
            if (!this.screen.gameOver && !this.screen.win) {

                this.clock.sec += this.game.clockTick;
                if (this.clock.sec >= 60) {
                    this.clock.sec = 0;
                    this.clock.min++;
                }

                if (this.player.dead) {
                    this.clearEntities();
                    this.screen.gameOver = true;
                    this.screen.gameplay = false;
                }

                if (this.player.expPoint >= this.maxExp) {
                    this.screen.upgrade = true;
                    this.player.expPoint -= Math.floor(this.maxExp);
                    console.log("player exp: " + this.player.expPoint);
                    this.maxExp *= 1.1

                    if (this.mode.endless) {
                        if (this.additionalStat.Revive > 0) {
                            this.upgrades.pop();
                        }

                        for (let i = 0; i < 3; i++) {
                            let upgrade = Math.floor(Math.random() * this.upgrades.length);
                            this.upgradeSlot.push(this.upgrades[upgrade]);
                            this.upgrades.splice(upgrade, 1);
                        }
                    }
                }
                this.updateAudio();
                this.spawnSlime();
            }
        }
    };

    resetUpgradeArray() {
        while (this.upgradeSlot.length) {
            this.upgradeSlot.pop();
        }
        this.upgrades = [0, 1, 2, 3, 4];
    };

    spawnSlime() {
        if (!this.screen.gameOver) {
            if (this.mode.campaign) {
                if (this.slimeDefeat < 50) {
                    this.timers.spawnTime += this.game.clockTick;
                    if (this.timers.spawnTime >= Math.floor(Math.random() * this.timers.randomTime) + 1) {
                        let posOrNeg = Math.floor(Math.random() * 2);
                        let rand = Math.floor((Math.random() * (3)) + 5)

                        if (posOrNeg % 2 == 0) {
                            rand *= -1;
                        }

                        this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, 1, 1, false), 1);
                        this.timers.spawnTime = 0;
                    }
                } else if (!this.bossSlimeSpawn) {
                    this.game.addEntityAtIndex(new Slime(this.game, 0, 0, this.player, 1, 1, true), 1);
                    this.bossSlimeSpawn = true;
                }
            } else if (this.mode.endless) {
                this.timers.spawnTime += this.game.clockTick;
                if (this.clock.min < 3) {
                    if (this.timers.spawnTime >= Math.floor(Math.random() * this.timers.randomTime) + 1) {
                        let posOrNeg = Math.floor(Math.random() * 2);
                        let rand = Math.floor((Math.random() * 3) + 5);

                        if (posOrNeg % 2 == 0) {
                            rand *= -1;
                        }

                        this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, 1, 1, false), 1);
                        this.timers.spawnTime = 0;
                    }
                } else if (this.clock.min >= 3 && this.clock.min < 5) {
                    if (this.timers.spawnTime >= Math.floor(Math.random() * (this.timers.randomTime - 1)) + 1) {
                        let posOrNeg = Math.floor(Math.random() * 2);
                        let rand = Math.floor((Math.random() * 3) + 5);

                        if (posOrNeg % 2 == 0) {
                            rand *= -1;
                        }
                        this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, 1.25, 1.25, false), 1);
                        this.timers.spawnTime = 0;
                    }
                } else if (this.clock.min >= 5 && this.clock.min < 8) {
                    if (this.timers.spawnTime >= Math.floor(Math.random() * (this.timers.randomTime - 1.5))) {
                        let posOrNeg = Math.floor(Math.random() * 2);
                        let rand = Math.floor((Math.random() * 3) + 5);

                        if (posOrNeg % 2 == 0) {
                            rand *= -1;
                        }

                        this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, 2, 2, false), 1);
                        this.timers.spawnTime = 0;
                    }
                } else if (this.clock.min >= 8) {
                    if (this.timers.spawnTime >= Math.floor(Math.random() * (this.timers.randomTime - 2))) {
                        let posOrNeg = Math.floor(Math.random() * 2);
                        let rand = Math.floor((Math.random() * 3) + 5);

                        if (posOrNeg % 2 == 0) {
                            rand *= -1;
                        }

                        this.game.addEntityAtIndex(new Slime(this.game, (rand * 50) + this.player.x, (rand * 50) + this.player.y, this.player, 3.5, 2.25, false), 1);
                        this.timers.spawnTime = 0;
                    }
                }
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

        if (this.screen.endless) {
            ctx.font = "100px serif";
            ctx.fillStyle = "Black";

            ctx.fillText("Endless: ", 20 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);

            ctx.font = "75px serif";
            ctx.fillText("- Survive as long as you can", 1 * PARAMS.BLOCKWIDTH, 15 * PARAMS.BLOCKWIDTH);
            ctx.fillText("- Kill Slimes to gain EXP", 1 * PARAMS.BLOCKWIDTH, 20 * PARAMS.BLOCKWIDTH);
            ctx.fillText("- Below is your EXP bar", 1 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            ctx.fillText("- Fill bar and upgrade stat", 1 * PARAMS.BLOCKWIDTH, 30 * PARAMS.BLOCKWIDTH);
            ctx.fillText("or get Revive to escape Death", 1 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);

            ctx.fillStyle = "Red";
            ctx.fillText("Slimes become stronger overtime", 1 * PARAMS.BLOCKWIDTH, 40 * PARAMS.BLOCKWIDTH);

            ctx.fillStyle = "Black";
            ctx.fillText("Click anywhere to play", 10 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH);
        }

        if (this.screen.upgrade) {
            ctx.font = "100px serif";
            ctx.fillStyle = "White";

            ctx.fillText("Select 1 of 3 upgrades", 5 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH);

            ctx.font = "50px serif";
            for (let i = 0; i < 3; i++) {
                ctx.drawImage(this.upgradeImage[this.upgradeSlot[i]], i * 23 * PARAMS.BLOCKWIDTH, 15 * PARAMS.BLOCKWIDTH, 250, 250);
                if (i == 0) {
                    if (this.upgradeSelect.one) {
                        ctx.fillStyle = "Purple";
                        if (this.upgradeSlot[i] == 0) {
                            ctx.fillText("+5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 1) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound X", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 2) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound Y", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 3) {
                            ctx.fillText("+10% Health", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 4) {
                            ctx.fillText("+1 Revive", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        }
                    } else {
                        ctx.fillStyle = "White";
                        if (this.upgradeSlot[i] == 0) {
                            ctx.fillText("+5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 1) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound X", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 2) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound Y", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 3) {
                            ctx.fillText("+10% Health", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 4) {
                            ctx.fillText("+1 Revive", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        }
                    }
                } else if (i == 1) {
                    if (this.upgradeSelect.two) {
                        ctx.fillStyle = "Purple";
                        if (this.upgradeSlot[i] == 0) {
                            ctx.fillText("+5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 1) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound X", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 2) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound Y", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 3) {
                            ctx.fillText("+10% Health", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 4) {
                            ctx.fillText("+1 Revive", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        }
                    } else {
                        ctx.fillStyle = "White";
                        if (this.upgradeSlot[i] == 0) {
                            ctx.fillText("+5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 1) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound X", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 2) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound Y", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 3) {
                            ctx.fillText("+10% Health", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 4) {
                            ctx.fillText("+1 Revive", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        }
                    }
                } else if (i == 2) {
                    if (this.upgradeSelect.three) {
                        ctx.fillStyle = "Purple";
                        if (this.upgradeSlot[i] == 0) {
                            ctx.fillText("+5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 1) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound X", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 2) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound Y", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 3) {
                            ctx.fillText("+10% Health", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 4) {
                            ctx.fillText("+1 Revive", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        }
                    } else {
                        ctx.fillStyle = "White";
                        if (this.upgradeSlot[i] == 0) {
                            ctx.fillText("+5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 1) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound X", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 2) {
                            ctx.fillText("+2.5% Attack", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                            ctx.fillText("Bound Y", i * 23 * PARAMS.BLOCKWIDTH, 38 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 3) {
                            ctx.fillText("+10% Health", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        } else if (this.upgradeSlot[i] == 4) {
                            ctx.fillText("+1 Revive", i * 23 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
                        }
                    }
                }
            }
        }

        if (this.screen.gameplay && this.screen.pause && !this.screen.upgrade) {
            ctx.font = "100px serif";
            ctx.fillStyle = "Black";

            ctx.fillText("Paused", 23 * PARAMS.BLOCKWIDTH, 15 * PARAMS.BLOCKWIDTH);

            if (this.pauseSelect.resume) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Resume", 22 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Resume", 22 * PARAMS.BLOCKWIDTH, 25 * PARAMS.BLOCKWIDTH);
            }

            if (this.pauseSelect.return) {
                ctx.fillStyle = "Purple";
                ctx.fillText("Return to Title", 14 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillStyle = "Black";
                ctx.fillText("Return to Title", 14 * PARAMS.BLOCKWIDTH, 35 * PARAMS.BLOCKWIDTH);
            }
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

        if (this.screen.gameplay && !this.screen.upgrade) {
            ctx.font = "45px serif";
            ctx.fillStyle = "White";
            ctx.lineWidth = 2;
            ctx.fillText("Health: " + this.player.health, 1 * PARAMS.BLOCKWIDTH, 3 * PARAMS.BLOCKWIDTH);
            ctx.fillText("Score: " + this.score, 1 * PARAMS.BLOCKWIDTH, 6 * PARAMS.BLOCKWIDTH);
            if (this.mode.campaign) {
                ctx.fillText("Slimes defeated: " + this.slimeDefeat + "/50", 1 * PARAMS.BLOCKWIDTH, 9 * PARAMS.BLOCKWIDTH);
            } else {
                ctx.fillText("Slimes defeated: " + this.slimeDefeat, 1 * PARAMS.BLOCKWIDTH, 9 * PARAMS.BLOCKWIDTH);
            }
            ctx.fillText(this.clock.sec < 10 ? this.clock.min + ":0" + Math.floor(this.clock.sec) : this.clock.min + ":" + Math.floor(this.clock.sec), 1 * PARAMS.BLOCKWIDTH, 12 * PARAMS.BLOCKWIDTH);
            let ratio = this.player.health / this.player.maxhealth;
            ctx.strokeStyle = "black";
            ctx.fillStyle = ratio < 0.2 ? "red" : ratio < 0.5 ? "yellow" : "green";
            if (this.player.health > 0) {
                ctx.fillRect(15 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH * ratio, 2 * PARAMS.BLOCKWIDTH);
            }
            ctx.strokeRect(15 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH, 10 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);

            if (this.mode.campaign) {
                let boss = undefined;
                if (this.bossSlimeSpawn) {
                    this.game.entities.forEach((entity) => {
                        if (this.game.Slime.boss) {
                            boss = this.game.Slime;
                        }
                    });

                    ctx.fillStyle = "White";
                    ctx.fillText("The Ultimate Slime", 2 * PARAMS.BLOCKWIDTH, 44 * PARAMS.BLOCKWIDTH);
                    let ratio = boss.health / boss.maxhealth;
                    ctx.strokeStyle = "White";
                    ctx.fillStyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "yellow" : "green";
                    if (boss.health > 0) {
                        ctx.fillRect(2 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH, 60 * PARAMS.BLOCKWIDTH * ratio, 2 * PARAMS.BLOCKWIDTH);
                    }
                    ctx.strokeRect(2 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH, 60 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);
                }
            }

            if (this.mode.endless) {
                let ratioEXP = this.player.expPoint / this.maxExp;
                ctx.strokeStyle = "White";
                ctx.fillStyle = "Red";
                ctx.fillRect(0 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH, PARAMS.CANVAS_WIDTH * ratioEXP, 0.5 * PARAMS.BLOCKWIDTH);
                ctx.strokeRect(0 * PARAMS.BLOCKWIDTH, 45 * PARAMS.BLOCKWIDTH, PARAMS.CANVAS_WIDTH, 0.5 * PARAMS.BLOCKWIDTH);
            }
        }
    };
};