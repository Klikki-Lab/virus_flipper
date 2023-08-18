export interface GameMainParameterObject extends g.GameMainParameterObject {
	sessionParameter: {
		mode?: string;
		totalTimeLimit?: number;
		difficulty?: number;
		randomSeed?: number;
	};
	isAtsumaru: boolean;
	random: g.RandomGenerator;
}

export interface RPGAtsumaruWindow {
	RPGAtsumaru?: any;
}

export type ScoreBoardID = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface ScoreboardData {
	boardId: number;
	boardName: string;
	myRecord?: {
		rank: number;
		score: number;
		isNewRecord: boolean;
	};
	myBestRecord?: {
		rank: number;
		userName: string;
		score: number;
	};
	ranking: {
		rank: number;
		userName: string;
		score: number;
	}[];
}

export interface AtsumaruApiError {
	readonly errorType: "atsumaruApiError";
	readonly code: string;
	readonly message: string;
}
