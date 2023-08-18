
import { BitmapFontLabel } from "./BitmapFontLabel";

export class Score extends BitmapFontLabel {

    /** 理論値スコア (最後のウイルスへの反応が一瞬遅れると 129960 点になる) */
    private static readonly THEORETICAL_VALUE_SCORE = 131580;
    private static readonly COUNTER_STOP = 999999999999;
    private static readonly BASE_SCORE = 100;
    private static readonly COMBO_BONUS = 10;

    onCounterStop: g.Trigger<void> = new g.Trigger();
    private combo = 0;
    private failCount = 0;

    constructor(scene: g.Scene) {
        super(scene, "0P");
        this.x = BitmapFontLabel.DEFAULT_FONT_SIZE / 4;
        this.y = BitmapFontLabel.DEFAULT_FONT_SIZE / 4;
        //this.init();
    }

    /**
     * ゲームリスタート時の初期化。
     */
    init(): void {
        this.combo = 0;
        this.failCount = 0;
        this.setText(g.game.vars.gameState.score = 0);
    }

    /**
     * スコアの加算。
     * @returns 加算分のスコア値。
     */
    add(): number {
        const addScore = Score.BASE_SCORE + Score.COMBO_BONUS * this.combo;
        g.game.vars.gameState.score = Math.min(g.game.vars.gameState.score + addScore, Score.COUNTER_STOP);
        this.setText(g.game.vars.gameState.score);
        // this.timeline.create(this).every((e: number, p: number) => {
        //     this.setText(g.game.vars.gameState.score - Math.floor(addScore * (1 - p)));
        // }, 250);

        this.combo++;
        if (g.game.vars.gameState.score >= Score.COUNTER_STOP) {
            this.onCounterStop.fire();
        }
        return addScore;
    }

    /**
     * ミス。コンボ回数は 0 になり、ミス回数がインクリメントされる。
     */
    fail(): void {
        //this.add(); // デバッグ用
        this.combo = 0;
        this.failCount++;
    }

    /**
     * @returns ミス回数
     */
    getFailCount = (): number => this.failCount;

    /**
     * @returns ノーミスなら true、そうでなければ false
     */
    isPerfect = (): boolean => this.failCount === 0;

    /**
     * @returns スコアが理論値スコア (131580) の 8割以上であれば true、そうでなければ false
     */
    isExcellentScore = (): boolean => g.game.vars.gameState.score >= Score.THEORETICAL_VALUE_SCORE * 0.8;

    private setText(score: number): void {
        this.text = `${score}P`;
        this.invalidate();
    }
}