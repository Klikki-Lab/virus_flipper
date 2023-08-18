import { Virus } from "./Virus";

export class BlackVirus2 extends Virus {

    constructor(scene: g.Scene, reflectorY: number) {
        super(scene, scene.asset.getImageById("black_2"), reflectorY);

        const isLeft = g.game.random.generate() < 0.5;
        this.vx = g.game.random.generate() * (g.game.width / this.width / (isLeft ? 3 : -3));
        this.x = g.game.width / 2;
        this.y = -this.height * 0.5;
    }

    isWhite = () => false;
}