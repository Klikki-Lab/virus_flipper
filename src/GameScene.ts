import { AtsumaruApiError, GameMainParameterObject, ScoreboardData, RPGAtsumaruWindow } from "./parameterObject";
import { Backgroung } from "./Backgroung";
import { BaseScene } from "./BaseScene";
import { BounceEffect } from "./BounceEffect";
import { Button } from "./Button";
import { Finish } from "./Finish";
import { Flipper } from "./Flipper";
import { ScoreEffect } from "./ScoreEffect";
import { Score } from "./Score";
import { Start } from "./Start";
import { Ticker } from "./Ticker";
import { TitleScene } from "./TitleScene";
import { BlackVirus } from "./virus/BlackVirus";
import { BlackVirus2 } from "./virus/BlackVirus2";
import { BlackVirus3 } from "./virus/BlackVirus3";
import { Virus } from "./virus/Virus";
import { WhiteVirus } from "./virus/WhiteVirus";
import { WhiteVirus2 } from "./virus/WhiteVirus2";
import { WhiteVirus3 } from "./virus/WhiteVirus3";

declare const window: RPGAtsumaruWindow;

export class GameScene extends BaseScene {

    private static readonly LIFE_TIME_SEC = 60;
    private static readonly LEVEL_UP_PERIOD = g.game.fps * 5;
    private static readonly VIRUS_INVADE_PERIOD = g.game.fps * 0.75;
    /**ニコ生モードでは、1.0 から 実質0.3138（内部的には0.2287）まで難易度が上昇 */
    private static readonly LEVEL_UP_RATE = 0.90;
    /** ハードコアモード難易度最大に達すると、およそ 11.25フレーム(0.1875秒) ごとにウイルス出現 */
    private static readonly MAX_LEVEL_UP_RATE = Math.pow(GameScene.LEVEL_UP_RATE, 13);

    private random: g.RandomGenerator;
    private flipper: Flipper;
    private score: Score;
    private ticker: Ticker;
    private virusLayer: g.E;
    private label: g.Label;

    private gameMode: number;
    private levelRate = 1;
    private totalFrame = 0;
    private virusPeriod = 0;
    private isAtsumaru: boolean;

    constructor(param: GameMainParameterObject, gameMode: number, lifeTimeSec: number = GameScene.LIFE_TIME_SEC) {
        super({
            game: g.game,
            name: "GameScene",
            assetIds: [
                "bgm", "bgm_intro", "se_bound", "se_laugh", "font_glyphs", "bitmap_font",
                "start", "finish", "perfect", "home", "restart", "ranking",
                "black_1", "white_1", "black_2", "white_2", "black_3", "white_3",
                "bounce_effect",],
        }, lifeTimeSec);

        this.gameMode = gameMode;
        this.isAtsumaru = param.isAtsumaru;
        this.random = g.game.random;

        this.append(new Backgroung(this));

        this.onLoad.add(_ => {
            this.flipper = new Flipper(this);
            this.score = new Score(this);
            this.score.onCounterStop.add(_ => this.gameOver());
            this.ticker = new Ticker(this, this.lifeTimeSec);
            this.ticker.hide()
            this.ticker.onFinish.add(_ => this.gameOver());

            this.virusLayer = new g.E({ scene: this });
            const font = new g.DynamicFont({
                game: g.game,
                fontFamily: "monospace",
                size: 15
            });
            this.label = new g.Label({
                scene: this,
                text: `MISS:${this.score.getFailCount()}`,
                fontSize: 15,
                font: font,
                textColor: "white",
                x: g.game.width - 8 * 8,
                y: g.game.height / 4 * 3 - 15 * 2,
                hidden: true
            });

            this.append(this.flipper);
            this.append(this.virusLayer);
            this.append(this.label);
            this.append(this.ticker);
            this.append(this.score);

            this.startMusic();
            this.startGame();
        });
    }

    private startMusic(): void {
        const intro = this.asset.getAudioById("bgm_intro").play();
        intro.onStop.add(_ => {
            this.asset.getAudioById("bgm").play();
        });
    }

    /**
    * ゲーム初期化。
    */
    init(): void {
        this.levelRate = 1;
        this.totalFrame = 0;
        this.virusPeriod = 0;

        const entities = this.virusLayer.children;
        if (entities) {
            for (let i = entities.length - 1; i >= 0; i--)
                entities[i].destroy();
        }
        this.score.init();
        this.flipper.init();
        this.label.text = `MISS:${this.score.getFailCount()}`;
        this.label.invalidate();
    }

    /**
     * ゲーム開始。
     */
    startGame(): void {
        const start = new Start(this);
        this.append(start);
        start.onFinish.add(() => {
            start.destroy();

            this.onUpdate.add(this.updateHandler);

            if (this.gameMode === TitleScene.GAME_MODE_NORMAL) {
                if (!this.ticker.visible()) {
                    this.ticker.show();
                }
                this.ticker.start();
            } else {
                this.ticker.hide();
            }
        });
    }

    private gameOver(): void {
        this.onUpdate.remove(this.updateHandler);
        this.flipper.removeMouseEvent();
        if (this.virusLayer.children) {
            this.virusLayer.children.forEach(element => {
                if (element instanceof Virus) {
                    (element as Virus).removeUpdate();
                } else if (element instanceof BounceEffect) {
                    (element as BounceEffect).removeUpdate();
                } else if (element instanceof ScoreEffect) {
                    (element as ScoreEffect).removeUpdate();
                }
            })
        }

        const finish = new Finish(this);
        finish.onFinish.add(_ => {
            this.showResult(finish);
        });
        this.append(finish);
    }

    private showResult(finish: g.Sprite): void {
        const isExcellent = this.score.isPerfect() && this.score.isExcellentScore();
        let perfect: g.Sprite = undefined;
        let message: g.Label = undefined;
        if (isExcellent) {
            perfect = new g.Sprite({
                scene: this,
                src: this.asset.getImageById("perfect")
            });
            perfect.x = finish.x - perfect.width / 4;
            perfect.y = finish.y - perfect.height / 3;
            this.append(perfect);
            if (!this.isAtsumaru) {
                const fontSize = 24;
                const font = new g.DynamicFont({
                    game: g.game,
                    fontFamily: "monospace",
                    size: fontSize,
                    fontColor: this.flipper.isWhite() ? Flipper.COLOR_BLACK : Flipper.COLOR_WHITE
                });
                message = new g.Label({
                    scene: this,
                    text: "エクセレント！アツマールでハードコアモードに挑戦してみよう！",
                    font: font
                });
                message.x = g.game.width - message.width - fontSize;
                message.y = g.game.height - message.height * 2;
                this.append(message);
            }
        }

        if (!this.isAtsumaru) return;
        (() => {
            const SCOREBOARDS_ID = this.gameMode + 1;
            let rankingButton: Button = undefined;

            const scoreboards = window.RPGAtsumaru.experimental.scoreboards;
            scoreboards.setRecord(SCOREBOARDS_ID, g.game.vars.gameState.score)
                .then(() => {
                    rankingButton = new Button(this, "ranking");
                    rankingButton.x = g.game.width / 2 - rankingButton.width * 2;
                    rankingButton.y = g.game.height / Flipper.DIVISION * 3;
                    rankingButton.onClick.add(_tag => {
                        scoreboards.display(SCOREBOARDS_ID);
                    });
                    this.append(rankingButton);
                    scoreboards.getRecords(SCOREBOARDS_ID)
                        .then((scoreboardData: ScoreboardData) => {
                            if (scoreboardData.myRecord && scoreboardData.myRecord.isNewRecord) {
                                scoreboards.display(SCOREBOARDS_ID);
                            }
                        });
                })
                .catch((error: AtsumaruApiError) => {
                    console.log(error);
                    if ("INTERNAL_SERVER_ERROR" === error.code) {
                        // TODO
                    }
                }).finally(() => {
                    const homeButton = new Button(this, "home");
                    homeButton.x = g.game.width / 2;
                    homeButton.y = g.game.height / Flipper.DIVISION * 3;
                    homeButton.onClick.add(_tag => {
                        this.asset.getAudioById("bgm").stop();
                        this.onFinish.fire();
                    });
                    this.append(homeButton);

                    const restartButton = new Button(this, "restart");
                    restartButton.x = g.game.width / 2 + restartButton.width * 2;
                    restartButton.y = g.game.height / Flipper.DIVISION * 3;
                    restartButton.onClick.add(_tag => {
                        destroyEntities();
                        this.init();
                        this.startGame();
                    });
                    this.append(restartButton);

                    const destroyEntities = () => {
                        finish.destroy();
                        if (message) {
                            message.destroy();
                        }
                        if (perfect) {
                            perfect.destroy();
                        }
                        if (rankingButton) {
                            rankingButton.destroy();
                        }
                        homeButton.destroy();
                        restartButton.destroy();
                    };
                });
        })();
    }

    private updateHandler = () => {
        if (this.virusPeriod % (Math.floor(GameScene.VIRUS_INVADE_PERIOD * this.levelRate)) == 0) {
            this.virusPeriod = 0;
            this.virusLayer.append(this.createVirus());
        }
        this.virusPeriod++;
        this.totalFrame++;
        if (this.totalFrame % GameScene.LEVEL_UP_PERIOD == 0) {
            this.virusPeriod %= Math.floor(GameScene.VIRUS_INVADE_PERIOD * this.levelRate);

            if (this.gameMode == TitleScene.GAME_MODE_NORMAL) {
                const rate = this.totalFrame < this.lifeTimeSec * g.game.fps * 0.95 ?
                    GameScene.LEVEL_UP_RATE : Math.pow(GameScene.LEVEL_UP_RATE, 3);
                this.levelRate *= rate;
            } else {
                this.levelRate *= GameScene.LEVEL_UP_RATE;
                this.levelRate = Math.max(this.levelRate, GameScene.MAX_LEVEL_UP_RATE);
            }
            console.log("levelRate=" + this.levelRate);
        }
    };

    private createVirus(): Virus {
        const isWhite = this.random.generate() < 0.5;

        var virus: Virus = undefined;
        if (this.totalFrame > g.game.fps * this.lifeTimeSec * 0.5) {
            if (this.levelRate > this.random.generate()) {
                virus = isWhite ?
                    new WhiteVirus3(this, this.flipper.y) : new BlackVirus3(this, this.flipper.y);
            }
        }
        if (virus === undefined && this.totalFrame > g.game.fps * this.lifeTimeSec * 0.25) {
            if (this.levelRate > this.random.generate()) {
                virus = isWhite ?
                    new WhiteVirus2(this, this.flipper.y) : new BlackVirus2(this, this.flipper.y);
            }
        }
        if (virus === undefined) {
            virus = isWhite ?
                new WhiteVirus(this, this.flipper.y) : new BlackVirus(this, this.flipper.y);
        }
        virus.onCollideFlipper.add(vrs => {
            if (vrs.isWhite() !== this.flipper.isWhite()) {
                this.asset.getAudioById("se_bound").play();
                vrs.rebound();
                const addScore = this.score.add();

                const bound = new BounceEffect(this, vrs.x - vrs.width / 2, vrs.y + vrs.height / 4);
                bound.onFinish.add(_ => {
                    this.virusLayer.remove(bound);
                    bound.destroy();
                });
                this.virusLayer.append(bound);

                const score = new ScoreEffect(this, addScore, vrs.x, vrs.y);
                score.onFinish.add(_ => {
                    this.virusLayer.remove(score);
                    score.destroy();
                });
                this.virusLayer.append(score);
            }
        });
        virus.onPassing.add(_ => {
            this.asset.getAudioById("se_laugh").play();
            this.score.fail();

            this.label.text = `MISS:${this.score.getFailCount()}`;
            this.label.invalidate();

            if (TitleScene.GAME_MODE_HARDCORE === this.gameMode) {
                this.gameOver();
            }
        });
        return virus;
    }
}