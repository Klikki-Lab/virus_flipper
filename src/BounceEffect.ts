export class BounceEffect extends g.Sprite {

    private static readonly LIFE_TIME = g.game.fps * 0.05;

    onFinish: g.Trigger<void> = new g.Trigger();
    private lifeTime = 0;

    constructor(scene: g.Scene, x: number, y: number) {
        const image = scene.asset.getImageById("bounce_effect");
        super({
            scene: scene,
            src: image,
            x: x,
            y: y,
            opacity: 0.8
        });
        this.onUpdate.add(this.updateHandler);
    }

    removeUpdate() {
        this.onUpdate.remove(this.updateHandler);
    }

    private updateHandler = (): void => {
        if (this.lifeTime++ >= BounceEffect.LIFE_TIME) {
            this.removeUpdate();
            this.onFinish.fire();
        }
    };
}