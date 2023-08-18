export class Backgroung extends g.FilledRect {

    constructor(scene: g.Scene) {
        super({
            scene: scene,
            width: g.game.width,
            height: g.game.height,
            cssColor: "darkgrey"
        });
    }
}