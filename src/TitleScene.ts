import { Backgroung } from "./Backgroung";
import { BaseScene } from "./BaseScene";
import { Button } from "./Button";
import { HowToPlayScene } from "./HowToPlayScene";
import { AtsumaruApiError, GameMainParameterObject, ScoreboardData, RPGAtsumaruWindow } from "./parameterObject";
import { BlackVirus } from "./virus/BlackVirus";
import { WhiteVirus } from "./virus/WhiteVirus";

declare const window: RPGAtsumaruWindow;

export class TitleScene extends BaseScene {

    /** ニコ生仕様のノーマルモード */
    public static readonly GAME_MODE_NORMAL = 0;
    /** アルマール仕様のハードコアモード */
    public static readonly GAME_MODE_HARDCORE = 1;
    private static readonly LIFE_TIME_SEC = 3;

    onClickStartGame: g.Trigger<number> = new g.Trigger();

    constructor(param: GameMainParameterObject, lifeTimeSec: number = TitleScene.LIFE_TIME_SEC) {
        super({
            game: g.game,
            name: "TitleScene",
            assetIds: [
                "se_bound",
                "title_logo", "how_to_play", "mode_normal", "mode_normal_msg", "mode_hardcore", "mode_hardcore_msg",
                "black_1", "white_1",
            ],
        }, lifeTimeSec);

        this.append(new Backgroung(this));

        const virusLayer = new g.E({ scene: this });
        this.append(virusLayer);

        this.onLoad.add(_ => {
            const fontSize = 16;
            const font = new g.DynamicFont({
                game: g.game,
                fontFamily: "monospace",
                size: fontSize
            });
            const version = new g.Label({
                scene: this,
                text: `ver. ${g.game.vars.version}`,
                font: font,
                textColor: "white",
            });
            this.append(version);

            const titleLogo = new g.Sprite({
                scene: this,
                src: this.asset.getImageById("title_logo")
            });
            titleLogo.x = (g.game.width - titleLogo.width) / 2;
            titleLogo.y = param.isAtsumaru ? titleLogo.height * 0.1 : (g.game.height - titleLogo.height) / 2;
            titleLogo.modified();
            this.append(titleLogo);

            if (param.isAtsumaru) {
                const howToPlayButton = new Button(this, "how_to_play");
                howToPlayButton.x = g.game.width - howToPlayButton.width * 0.6;
                howToPlayButton.y = howToPlayButton.height * 0.6;
                howToPlayButton.modified();
                howToPlayButton.onClick.add(_tag => {
                    const howToPlayScene = new HowToPlayScene(param);
                    howToPlayScene.onFinish.add(_ => {
                        g.game.popScene();
                    })
                    g.game.pushScene(howToPlayScene);
                });
                this.append(howToPlayButton);

                const normalModeButton = new Button(this, "mode_normal");
                normalModeButton.x = g.game.width / 4;
                normalModeButton.y = titleLogo.y + titleLogo.height + normalModeButton.height * 0.7;
                normalModeButton.modified();
                normalModeButton.onClick.add(_tag => {
                    this.onUpdate.removeAll();
                    this.onClickStartGame.fire(TitleScene.GAME_MODE_NORMAL);
                });

                const normalMsg = new g.Sprite({ scene: this, src: this.asset.getImageById("mode_normal_msg") });
                normalMsg.x = g.game.width / 4 - normalMsg.width / 2;
                normalMsg.y = normalModeButton.y + normalModeButton.height * 0.55;
                normalMsg.modified();

                const hardcoreButton = new Button(this, "mode_hardcore");
                hardcoreButton.x = g.game.width / 2 + g.game.width / 4;
                hardcoreButton.y = titleLogo.y + titleLogo.height + hardcoreButton.height * 0.7;
                hardcoreButton.modified();
                hardcoreButton.onClick.add(_tag => {
                    this.onUpdate.removeAll();
                    this.onClickStartGame.fire(TitleScene.GAME_MODE_HARDCORE);
                });

                const hardcoreMsg = new g.Sprite({ scene: this, src: this.asset.getImageById("mode_hardcore_msg") });
                hardcoreMsg.x = g.game.width / 2 + g.game.width / 4 - hardcoreMsg.width / 2;
                hardcoreMsg.y = hardcoreButton.y + hardcoreButton.height * 0.55;
                hardcoreMsg.modified();

                this.append(normalMsg);
                this.append(normalModeButton);
                this.append(hardcoreMsg);
                this.append(hardcoreButton);

                const SCOREBOARDS_NORMAL_MODE = 1;
                const SCOREBOARDS_HARDCORE_MODE = 2;

                const scoreboards = window.RPGAtsumaru.experimental.scoreboards;
                scoreboards.getRecords(SCOREBOARDS_NORMAL_MODE)
                    .then((_scoreboardData: ScoreboardData) => {
                        const button1 = new Button(this, "ranking");
                        button1.x = normalModeButton.x - normalModeButton.width / 2 + button1.width / 2;
                        button1.y = normalModeButton.y - normalModeButton.height / 2 - button1.height / 1.5;
                        button1.modified();
                        button1.onClick.add(_tag => {
                            scoreboards.display(SCOREBOARDS_NORMAL_MODE);
                        });
                        this.append(button1);
                    });

                scoreboards.getRecords(SCOREBOARDS_HARDCORE_MODE)
                    .then((_scoreboardData: ScoreboardData) => {
                        const button2 = new Button(this, "ranking");
                        button2.x = hardcoreButton.x + hardcoreButton.width / 2 - button2.width / 2;
                        button2.y = hardcoreButton.y - hardcoreButton.height / 2 - button2.height / 1.5;
                        button2.modified();
                        button2.onClick.add(_tag => {
                            scoreboards.display(SCOREBOARDS_HARDCORE_MODE);
                        });
                        this.append(button2);
                    });
            } else {
                this.setTimeout(() => {
                    this.onUpdate.removeAll();
                    this.onFinish.fire();
                }, this.lifeTimeSec * 1000);
            }

            let frame = 0;
            const ARRIVE_PERIOD = g.game.fps / 3;
            this.onUpdate.add(_ => {

                if (frame++ % ARRIVE_PERIOD === 0) {
                    const virus = g.game.random.generate() > 0.5 ? new WhiteVirus(this) : new BlackVirus(this);
                    virus.opacity = 0.5;
                    virusLayer.append(virus);
                    frame = 1;
                }
            });
        });
    }
}