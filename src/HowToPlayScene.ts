import { GameMainParameterObject } from "./parameterObject";
import { Button } from "./Button";
import { BaseScene } from "./BaseScene";
import { BitmapFontLabel } from "./BitmapFontLabel";

export class HowToPlayScene extends BaseScene {

    private static readonly LIFE_TIME_SEC = 7;

    constructor(param: GameMainParameterObject, lifeTimeSec: number = HowToPlayScene.LIFE_TIME_SEC) {
        super({
            game: g.game,
            name: "HowToPlayScene",
            assetIds: [
                "description", "close", "font_glyphs", "bitmap_font",
            ],
        }, lifeTimeSec);

        this.onLoad.add(() => {
            const description = new g.Sprite({
                scene: this,
                src: this.asset.getImageById("description")
            });
            this.append(description);

            if (param.isAtsumaru) {
                const closeButton = new Button(this, "close");
                closeButton.x = g.game.width - closeButton.width * 0.6;
                closeButton.y = + closeButton.height * 0.6;
                closeButton.onClick.add(_tag => {
                    this.onFinish.fire();
                });
                this.append(closeButton);
            } else {
                const countdown = new BitmapFontLabel(this, lifeTimeSec.toString());
                countdown.x = g.game.width - countdown.fontSize * 1.5;
                countdown.y = countdown.height / 4;
                this.append(countdown);

                let remainTime = lifeTimeSec;
                const updateHandler = () => {
                    if (remainTime <= 0) {
                        console.log(remainTime);
                        this.onUpdate.remove(updateHandler);
                        this.onFinish.fire();
                    }
                    remainTime -= 1 / g.game.fps;
                    countdown.text = `${Math.ceil(remainTime)}`;
                    countdown.invalidate();
                };
                this.onUpdate.add(updateHandler);
            }
        });
    }
}