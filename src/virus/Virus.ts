export abstract class Virus extends g.FrameSprite {

    private static readonly ANIM_NORMAL = [0];
    private static readonly ANIM_LAUGH = [1, 2];
    private static readonly ANIM_KILL = [3];

    private static readonly G = 0.98;

    onCollideFlipper: g.Trigger<Virus> = new g.Trigger();
    onPassing: g.Trigger<void> = new g.Trigger();

    private reflectorY: number;
    protected vx = 0;
    private vy = 0;
    private gravity = 0;
    private frame = 0;
    private laughFrame = 0;
    private isCrush = false;
    private isKill = false;
    private isPass = false;
    private isCollide = false;

    constructor(scene: g.Scene, src: g.ImageAsset, reflectorY: number, gravityRate: number = 1) {
        super({
            scene: scene,
            src: src,
            width: 128,
            height: 128,
            anchorX: 0.5,
            anchorY: 0.5,
            interval: 0,
            frames: Virus.ANIM_NORMAL,
            loop: false
        });
        this.reflectorY = reflectorY;
        this.gravity = Virus.G * gravityRate;
        this.start();
        this.modified();

        this.onUpdate.add(this.updateHandler);
    }

    removeUpdate(): void {
        this.stop();
        this.loop = false;
        this.onUpdate.remove(this.updateHandler);
    }

    private updateHandler = () => {
        if (!this.isCollide && !this.isPass &&
            (this.y + this.height / 2 >= this.reflectorY && this.y - this.height / 2 < this.reflectorY)) {
            this.onCollideFlipper.fire(this);
        }
        if (!this.isPass && !this.isKill && this.y - this.height / 2 >= this.reflectorY) {
            this.pass();
            this.onPassing.fire();
        }
        if (this.isPass && this.laughFrame > 0) {
            this.laughFrame--;
            this.y += this.height / (g.game.fps * 5);
            this.modified();
            return;
        }
        if (this.isKill) {
            if (this.isCrush) {
                if (this.frame++ < g.game.fps * 0.02) {
                    this.scaleY *= 0.5;
                    return;
                } else {
                    this.frame = 0;
                    this.isCrush = false;
                }
            } else {
                if (this.scaleY < 1.0)
                    this.scaleY = Math.min(1.0, this.scaleY *= (1 + 24 / g.game.fps));
                this.angle += this.vx * 2;
                this.opacity *= 0.98;
            }
        }
        this.vy += this.frame / (g.game.fps) * this.height * 0.5 / g.game.fps * this.gravity;
        this.frame++;
        this.x += this.vx;
        this.y += this.vy;
        this.modified();
        if (this.y - this.height / 2 >= g.game.height) {
            this.destroy();
        }
    };

    removeUpdateHandler() {
        this.stop();
        this.loop = false;
        this.onUpdate.remove(this.updateHandler);
    }

    rebound() {
        this.isCollide = true;
        this.isCrush = true;
        this.isKill = true;
        this.frames = Virus.ANIM_KILL;
        this.opacity = 0.5;
        this.vy = -this.vy * 0.5;
        this.frame = 0;
        this.modified();
    }

    private pass() {
        this.isPass = true;
        this.laughFrame = g.game.fps / 2;
        this.interval = 1000 / 30;
        this.frames = Virus.ANIM_LAUGH;
        this.frameNumber = 0;
        this.loop = true;
        this.vx = 0;

        this.start();
        this.modified();
    }

    abstract isWhite(): boolean;
}