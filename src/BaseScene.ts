export abstract class BaseScene extends g.Scene {

    onFinish: g.Trigger<void> = new g.Trigger();

    protected readonly lifeTimeSec: number;

    constructor(params: g.SceneParameterObject, lifeTimeSec: number = -1) {
        super(params);
        
        this.lifeTimeSec = lifeTimeSec;
    }
}