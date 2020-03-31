class LevelModel {
    public changed: boolean;

    /**
     * @constructor
     * @param {string} name level name
     * @param {number} boundX
     * @param {number} boundY
     */
    constructor(name: string, boundX: number, boundY: number) {
        this.name = name;
        this.boundX = boundX;
        this.boundY = boundY;
        this.graphicsX = 800;
        this.graphicsY = 600;
        this.fpsLower = 20;
        this.fpsUpper = 60;
        this.changed = true;
    }

    private _name: string;
    private _boundX: number;
    private _boundY: number;
    private _graphicsX: number;
    private _graphicsY: number;
    private _fpsUpper: number;
    private _fpsLower: number;

    /** Get name of this level. */
    get name(): string { return this._name; }

    /** Set name of this level. */
    set name(v: string) {
        this.changed = true;
        if (!v || v.trim() === "") {
            this._name = this.name || "Untitled";
        }
        this._name = v;
    }

    get boundX(): number { return this._boundX; }
    set boundX(v: number) { this.changed = true; this._boundX = Math.max(1, v || 1); }
    get boundY(): number { return this._boundY; }
    set boundY(v: number) { this.changed = true; this._boundY = Math.max(1, v || 1); }

    get graphicsX(): number { return this._graphicsX; }
    set graphicsX(v: number) { this.changed = true; this._graphicsX = Math.round(Math.max(1, v || 1)); }
    get graphicsY(): number { return this._graphicsY; }
    set graphicsY(v: number) { this.changed = true; this._graphicsY = Math.round(Math.max(1, v || 1)); }

    get fpsLower(): number { return this._fpsLower; }
    set fpsLower(v: number) { this.changed = true; this._fpsLower = Math.round(Math.max(1, v || 1)); }
    get fpsUpper(): number { return this._fpsUpper; }
    set fpsUpper(v: number) { this.changed = true;
        this._fpsUpper = Math.round(Math.max(this.fpsLower + 1, v || 1)); }
}

export default LevelModel;
