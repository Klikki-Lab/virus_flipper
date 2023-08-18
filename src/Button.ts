export class Button extends g.Sprite {

    private static readonly SCALE_UP_RATE = 1.1;

    onClick: g.Trigger<string> = new g.Trigger();
    private isClicked = false;

    constructor(scene: g.Scene, assetKey: string, tag: string = undefined) {
        super({
            scene: scene,
            src: scene.asset.getImageById(assetKey),
            anchorX: 0.5,
            anchorY: 0.5,
            tag: tag || assetKey,
            touchable: true,
        });

        this.onPointDown.add(_e => {
            this.isClicked = true;
            setScale(Button.SCALE_UP_RATE);
        });

        this.onPointMove.add(e => {
            const ex = e.point.x + e.startDelta.x;
            const ey = e.point.y + e.startDelta.y;
            this.isClicked = this.isClicked && 0 <= ex && this.width >= ex && 0 <= ey && this.height >= ey;
            setScale(this.isClicked ? Button.SCALE_UP_RATE : 1.0);
        });

        this.onPointUp.add(_e => {
            setScale(1.0);
            if (this.isClicked) {
                scene.asset.getAudioById("se_bound").play();
                this.onClick.fire(this.tag);
                this.isClicked = false;
            }
        });

        this.onUpdate.add(_ => {
            if (!this.isClicked)
                setScale(1 - Math.sin(g.game.age % (g.game.fps * 10) / 16) * 0.02);
        });

        const setScale = (scale: number) => {
            this.scale(scale);
            this.modified();
        }
    }
}