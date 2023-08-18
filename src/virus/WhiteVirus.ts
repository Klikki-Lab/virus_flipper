import { Virus } from "./Virus";

export class WhiteVirus extends Virus {

    constructor(scene: g.Scene, reflectorY: number = g.game.height) {
        super(scene, scene.asset.getImageById("white_1"), reflectorY);

        this.x = (g.game.width - this.width) / 2 +
            (g.game.random.generate() * 2 - 1) * (this.width * 3);
        this.y = -this.height * 0.5;
    }

    rebound(): void {
        this.vx = (g.game.random.generate() * 2 - 1) * (g.game.width / this.width / 2);
        super.rebound();
    }

    isWhite = () => true;
}