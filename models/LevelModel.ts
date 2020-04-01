export type RepVersion0 = {
    physicsSize: [number, number];
    graphicSize: [number, number];
    fpsRange: [number, number];
};

export type RepVersion1 = {
    name: string;
    version: number;
    physicsSize: [number, number];
    graphicSize: [number, number];
    fpsRange: [number, number];
};

class LevelModel {

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
    private _lastFilename: string;
    private _changed: boolean;
    public changeHandler: (i: boolean) => void;

    get changed(): boolean { return this._changed; }
    set changed(v: boolean) {
        const updated = this._changed != v;
        this._changed = v;
        if (updated && typeof this.changeHandler === "function")
            this.changeHandler(this._changed);
    }

    /** Get name of this level. */
    get name(): string { return this._name; }

    /** Set name of this level. */
    set name(v: string) {
        this.changed = true;
        this._lastFilename = null;
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

    setLastFilename(name: string): void {
        this._lastFilename = name;
    }

    private get nameToFilename() {
        return this.name.replace(new RegExp("\\s|\\\\|/|:", "g"), "-");
    }

    get filename(): string {
        return this._lastFilename || (this.nameToFilename + ".json");
    }

    static fromRep(t: object, fn: string = "Untitled"): LevelModel {
        try {
            const lm = new LevelModel("_", 0, 0);
            if (t.hasOwnProperty("version") && (t as any).version == 1) {
                lm.name = (t as RepVersion1).name;
            } else {
                lm.name = fn.replace(new RegExp(".[a-z0-9]+$", "gi"), "");
            }
            const rep: RepVersion0 = t as RepVersion0;
            lm.fpsLower = rep.fpsRange[0];
            lm.fpsUpper = rep.fpsRange[1];
            lm.boundX = rep.physicsSize[0];
            lm.boundY = rep.physicsSize[1];
            lm.graphicsX = rep.graphicSize[0];
            lm.graphicsY = rep.graphicSize[1];
            lm.changed = false;
            return lm;
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    toRep(): RepVersion1 {
        return {
            name: this.name,
            version: 1,
            physicsSize: [this.boundX, this.boundY],
            graphicSize: [this.graphicsX, this.graphicsY],
            fpsRange: [this.fpsLower, this.fpsUpper],
        };
    }

    dispose() {
        this.changeHandler = null;
    }
}

export default LevelModel;
