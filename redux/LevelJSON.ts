import {
    BackgroundTexture,
    BGM,
    EnemyInfo,
    ExtraInfo,
    Item,
    LevelState,
    LightingInfo,
    TreeInfo,
    WallInfo
} from "./StateType";
import {newEditorInfo} from "./reducers/LevelReducer";
import {guardInt, guardNonEmptyString, guardNumber} from "./Validators";

export type ImportedLevel = {level: LevelState | null; msg: string[] | null;};

function defaultName(level: object, msgs: string[]): string {
    const ln = level["name"], av = guardNonEmptyString(ln, "Untitled");
    if (ln != av) {
        msgs.push("Level is missing name or has invalid name. The filename of this JSON will be used as the name.");
    }
    return ln;
}

function twoNums(c: any, k: string): [number, number] {
    if (!c.hasOwnProperty(k) || !c[k] || !Array.isArray(c[k])) {
        throw new Error("\"" + k + "\" is not an array.");
    }
    const ck: any[] = c[k];
    if (ck.length !== 2) {
        throw new Error("\"" + k + "\" must contain only two elements.");
    }
    for (let i = 0, j = 2; i < j; i++) {
        if (guardNumber(ck[i]) !== ck[i]) {
            throw new Error("\"" + k + "\" is not a valid [number, number] array.");
        }
    }
    return ck as [number, number];
}

function twoInts(c: any, k: string): [number, number] {
    const ck = twoNums(c, k);
    for (let i = 0, j = 2; i < j; i++) {
        if (guardInt(ck[i]) !== ck[i]) {
            throw new Error("\"" + k + "\" is not a valid [int, int] array.");
        }
    }
    return ck as [number, number];
}

function checkBG(bg: {texture: string} | undefined, msgs: string[]): {texture: BackgroundTexture} {
    if (!bg || typeof bg !== "object" || typeof bg.texture !== "string") {
        msgs.push("No background provided or invalid background. Using floor-tile by default.");
    }/* else if (bg.texture !== "floor-tile") {
        msgs.push("Unsupported background texture. Using floor-tile.");
    }*/
    return {texture: (bg["texture"] as BackgroundTexture)};
}

function checkEnemy(e: any, msgs: string[]): EnemyInfo {
    let type = e["enemytype"];
    switch(type) {
        case "typeA":
        case "typeB":
            break;
        default:
            type = "typeA";
            msgs.push("Unidentifiable enemy type. Using typeA by default.");
    }
    return {
        ...e,
        enemypos: twoNums(e, "enemypos"),
        enemytype: type,
    };
}

function checkItem(e: any, msgs: string[]): Item {
    return e;
}

function checkWall(e: any, msgs: string[]): WallInfo {
    let texture = e["texture"];
    return {
        pos: twoNums(e, "pos"),
        size: twoNums(e, "size"),
        texture: texture,
    };
}

function checkTrees(e: any, msgs: string[]): TreeInfo {
    return {
        pos: twoNums(e, "pos"),
    };
}

function checkLightings(e: any, msgs: string[]): LightingInfo {
    return e as LightingInfo;
}

function checkList<T>(c: any, k: string, msgs: string[], func: (item: any, msgs: string[]) => T, bwc: boolean = false): T[] {
    if (!c.hasOwnProperty(k) || !c[k] || !Array.isArray(c[k])) {
        if (!bwc) {
            throw new Error("\"" + k + "\" is not an array.");
        } else {
            return [];
        }
    }
    for (let i = 0, j = c[k].length; i < j; i++) {
        c[k][i] = !func ? c[k][i] : func(c[k][i], msgs);
    }
    return c[k];
}

function physicsSize(a: [number, number], msgs: string[]): [number, number] {
    if (a[0] % 1.28 != 0 || a[1] % 1.28 != 0) {
        msgs.push("The level bound must be a multiple of 1.28. Increasing it to the next larger number dividable by 1.28.");
    }
    return [Math.ceil(a[0] / 1.28) * 1.28, Math.ceil(a[1] / 1.28) * 1.28];
}

function checkExtra(o: object, msgs: string[]): ExtraInfo {
    o["extraType"] = o["extraType"].substr(2);
    return o as ExtraInfo;
}

function checkBGM(bgm: string, msgs: string[]): BGM | undefined {
    if (!bgm) {
        msgs.push("A background music is not defined in this level. Please don't forget to choose one.");
        return undefined;
    }
    if (!Object.values(BGM).includes(bgm as BGM)) {
        msgs.push("This BGM is not supported by this editor. It will be removed from the level.");
        return undefined;
    }
    return bgm as BGM;
}

function check0(level: object, msgs: string[]): LevelState{
    return {
        name: defaultName(level, msgs),
        maxFlareCount: level["maxFlareCount"],
        startFlareCount: level["startFlareCount"],
        startSneakVal: level["startSneakVal"],
        texts: checkList(level, "texts", msgs, null, true),
        physicsSize: physicsSize(twoNums(level, "physicsSize"), msgs),
        fpsRange: twoInts(level, "fpsRange"),
        playerpos: twoNums(level, "playerpos"),
        bgm: checkBGM(level["bgm"], msgs),
        exitpos: twoNums(level, "exitpos"),
        background: checkBG(level["background"], msgs),
        enemies: checkList(level, "enemies", msgs, checkEnemy),
        items: checkList(level, "items", msgs, checkItem, true),
        trees: checkList(level, "trees", msgs, checkTrees, true),
        lighting: checkLightings(level["lighting"], msgs),
        extras: checkList(level, "extras", msgs, checkExtra, true),
        walls: checkList(level, "walls", msgs, checkWall),
        _editorInfo: null,
        changed: false,
    };
}

export function decode(level: object): ImportedLevel {
    let msgs = [];
    let result = null;
    try {
        result = check0(level, msgs);
    } catch(e) {
        msgs = [e.message];
    }
    return {level: result ? ({
        ...(result as object),
        _editorInfo: newEditorInfo()
    } as LevelState) : null, msg: msgs.length > 0 ? msgs : null};
}

export function encode(level: LevelState): object {
    const rj = JSON.parse(JSON.stringify(level));
    function round(o) {
        for (let oo of Object.keys(o)) {
            if (typeof o[oo] === "object") {
                round(o[oo]);
            } else if (typeof o[oo] == "number") {
                o[oo] = Math.round(o[oo] * 1000) / 1000;
            }
        }
    }
    round(rj);
    let etp;
    switch(level.background.texture) {
        case BackgroundTexture.FLOOR_TILE:
            etp = "c";
            break;
        case BackgroundTexture.VOLCANO_TILE:
            etp = "v";
            break;
        case BackgroundTexture.FOREST_TILE:
            etp = "f";
            break;
    }
    for (let o of rj["extras"]) {
        o["extraType"] = etp + "-" + o["extraType"];
    }
    rj["graphicSize"] = [800, 600];
    delete rj["_editorInfo"];
    delete rj["changed"];
    return rj;
}
