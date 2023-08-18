import { GameMainParameterObject } from "./parameterObject";
import { SceneController as SceneController } from "./SceneController";

export function main(param: GameMainParameterObject): void {

	let totalTimeLimit = 78; // 制限時間
	if (param.sessionParameter.totalTimeLimit) {
		totalTimeLimit = param.sessionParameter.totalTimeLimit; // セッションパラメータで制限時間が指定されたらその値を使用します
	}

	// アツマールデバッグ用
	//param.isAtsumaru = true;

	g.game.vars.gameState = {
		score: 0, //スコア 
		playThreshold: 100, //プレイ閾値
		clearThreshold: undefined, //クリア閾値
	};
	g.game.vars.version = "0.2.0.2";//バージョン更新忘れずに!!
	g.game.audio.music.volume = 0.1;
	g.game.audio.sound.volume = 0.1;

	new SceneController(param);
}
