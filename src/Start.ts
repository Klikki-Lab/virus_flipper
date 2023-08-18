export class Start extends g.Sprite {

    onFinish: g.Trigger<void> = new g.Trigger();
    private frame = 0;

    constructor(scene: g.Scene) {
        super({
            scene: scene,
            src: scene.asset.getImageById("start")
        });
        this.x = (g.game.width - this.width) / 2;
        this.y = -this.height;
        let vy = g.game.height / g.game.fps;

        const updateHandler = () => {
            this.y += vy;
            vy *= 1.2;
            this.frame++;
            if (this.frame <= g.game.fps * 0.95) {
                if (this.y >= (g.game.height - this.height) / 3) {
                    this.y = (g.game.height - this.height) / 3;
                    vy = g.game.height / g.game.fps;
                }
            }
            this.modified();
            if (g.game.height < this.y) {
                this.onUpdate.remove(updateHandler);
                this.onFinish.fire();
            }
        };

        this.onUpdate.add(updateHandler);
    }
}