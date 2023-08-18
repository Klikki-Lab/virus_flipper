export class ScoreEffect extends g.Label {

    private static readonly LIFE_TIME_SEC = 0.5;
    private static readonly FONT_SIZE = 32;

    onFinish: g.Trigger<void> = new g.Trigger();
    private vy: number;

    private static readonly FONT = new g.DynamicFont({
        game: g.game,
        fontFamily: "monospace",
        size: ScoreEffect.FONT_SIZE
    });

    constructor(scene: g.Scene, score: number, x: number, y: number, lifeTimeSec: number = ScoreEffect.LIFE_TIME_SEC) {
        super({ scene: scene, font: ScoreEffect.FONT, text: score.toString(), textColor: "white", fontSize: ScoreEffect.FONT_SIZE });
        this.x = x - this.width / 2;
        this.y = y;
        this.vy = this.height / g.game.fps * 8;

        this.onUpdate.add(this.updateHandler);
    }

    removeUpdate() {
        this.onUpdate.remove(this.updateHandler);
    }

    private updateHandler = () => {
        this.y -= this.vy;
        this.vy *= 0.92;
        if (this.vy <= 0.1) {
            this.vy = 0;
            this.onUpdate.remove(this.updateHandler);
            this.onFinish.fire();
        }
        if (this.vy <= 0.3) {
            this.opacity *= 0.8;
        }
        this.modified();
    };
}