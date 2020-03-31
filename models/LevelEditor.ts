class LevelModel {
    constructor(name: string) {
        this._name = name;
    }
    private _name: string = "Untitled";
    public get name(): string {
        return this._name;
    }
    public set name(v: string) {
        this._name = v;
    }
}

export default LevelModel;
