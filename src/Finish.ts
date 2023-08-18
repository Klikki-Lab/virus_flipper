export class Finish extends g.Sprite {

    onFinish: g.Trigger<void> = new g.Trigger();

    constructor(scene: g.Scene) {
        super({
            scene: scene,
            src: scene.asset.getImageById("finish")
        });
        this.x = (g.game.width - this.width) / 2;
        this.y = -this.height;

        let vy = g.game.height / g.game.fps;

        const updateHandler = () => {
            this.y += vy;
            vy *= 1.2;
            if (this.y >= (g.game.height - this.height) / 3) {
                this.y = (g.game.height - this.height) / 3;

                this.onUpdate.remove(updateHandler);
                this.onFinish.fire();
            }
            this.modified();
        };

        this.onUpdate.add(updateHandler);
    }
}