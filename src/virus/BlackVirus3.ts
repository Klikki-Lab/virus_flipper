import { Virus } from "./Virus";

export class BlackVirus3 extends Virus {

    constructor(scene: g.Scene, reflectorY: number) {
        super(scene, scene.asset.getImageById("black_3"), reflectorY);

        const isLeft = g.game.random.generate() < 0.5;
        this.vx = g.game.random.generate() * (g.game.width / this.width / (isLeft ? 2 : -2));
        this.x = isLeft ? this.width / 2 : g.game.width - this.width / 2;
        this.y = -this.height * 0.5;
    }

    isWhite = () => false;
}