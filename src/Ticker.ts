import { BitmapFontLabel } from "./BitmapFontLabel";

export class Ticker extends BitmapFontLabel {

    private static readonly DEFAULT_MAX_DURATION = 60;

    onFinish: g.Trigger<void> = new g.Trigger();
    private duration: number;

    constructor(scene: g.Scene, duration: number = Ticker.DEFAULT_MAX_DURATION) {
        super(scene, `T${duration}`);

        this.duration = duration;
        this.x = g.game.width - this.fontSize * 2.5;
        this.y = this.height / 4;
    }

    start() {
        let left = this.duration;
        const updateHandler = () => {
            if (left <= 0) {
                this.onFinish.fire();
                this.onUpdate.remove(updateHandler);
            }
            left -= 1 / g.game.fps;
            this.text = `T${Math.ceil(left)}`;
            this.invalidate();
        };
        this.onUpdate.add(updateHandler);
    }
}