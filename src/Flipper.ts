export class Flipper extends g.FilledRect {

    public static readonly DIVISION = 4;
    public static readonly COLOR_WHITE = "white";
    public static readonly COLOR_BLACK = "black";

    constructor(scene: g.Scene) {
        super({
            scene: scene,
            x: 0,
            y: g.game.height / Flipper.DIVISION * (Flipper.DIVISION - 1),
            width: g.game.width,
            height: g.game.height / Flipper.DIVISION,
            cssColor: Flipper.COLOR_BLACK,
        });
        this.init();
    }

    init() {
        this.setColor(Flipper.COLOR_BLACK);
        this.removeMouseEvent();

        this.scene.onPointDownCapture.add(_ => this.setWhite());
        this.scene.onPointUpCapture.add(_ => this.setBlack());
    }

    removeMouseEvent() {
        this.scene.onPointDownCapture.removeAll();
        this.scene.onPointUpCapture.removeAll();
    }

    private setWhite = () => this.setColor(Flipper.COLOR_WHITE);

    private setBlack = () => this.setColor(Flipper.COLOR_BLACK);

    private setColor(cssColor: string): void {
        this.cssColor = cssColor;
        this.modified();
    }

    isWhite = () => this.cssColor === Flipper.COLOR_WHITE;
}