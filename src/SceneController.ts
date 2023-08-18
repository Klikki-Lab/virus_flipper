import { GameMainParameterObject } from "./parameterObject";
import { GameScene } from "./GameScene";
import { TitleScene } from "./TitleScene";
import { HowToPlayScene } from "./HowToPlayScene";

export class SceneController {

    constructor(param: GameMainParameterObject) {
        g.game.pushScene(this.createTitleScene(param));
    }

    private createTitleScene(param: GameMainParameterObject): TitleScene {
        const titleScene = new TitleScene(param);
        titleScene.onClickStartGame.add(gameMode => {
            g.game.replaceScene(this.createGameScene(param, gameMode));
        });
        titleScene.onFinish.add(_ => {
            g.game.replaceScene(this.createHowToPlayScene(param));
        });
        return titleScene;
    };

    private createHowToPlayScene(param: GameMainParameterObject): HowToPlayScene {
        const howToPlayScene = new HowToPlayScene(param);
        howToPlayScene.onFinish.add(_ => {
            g.game.replaceScene(this.createGameScene(param, TitleScene.GAME_MODE_NORMAL));
        });
        return howToPlayScene;
    }

    private createGameScene(param: GameMainParameterObject, gameMode: number): GameScene {
        const gameScene = new GameScene(param, gameMode);
        gameScene.onFinish.add(_ => {
            g.game.replaceScene(this.createTitleScene(param));
        });
        return gameScene;
    }
}
