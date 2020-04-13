import {EnemyInfo, LevelState, LightingInfo, WallInfo} from "./StateType";
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

function checkBG(bg: {texture: string} | undefined, msgs: string[]): {texture: string} {
    let confirmedTexture = "floor-tile";
    if (!bg || typeof bg !== "object" || typeof bg.texture !== "string") {
        msgs.push("No background provided or invalid background. Using floor-tile by default.");
    } else if (bg.texture !== "floor-tile") {
        msgs.push("Unsupported background texture. Using floor-tile.");
    }
    return {texture: confirmedTexture};
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
        enemypos: twoNums(e, "enemypos"),
        enemytype: type,
    };
}

function checkWall(e: any, msgs: string[]): WallInfo {
    let texture = e["texture"];
    switch(texture) {
        case "wall-top":
        case "wall-side":
            break;
        default:
            texture = "wall-side";
            msgs.push("Unidentifiable wall texture. Using wall-side by default.");
    }
    return {
        pos: twoNums(e, "pos"),
        size: twoNums(e, "size"),
        texture: texture,
    };
}

function checkLightings(e: any, msgs: string[]): LightingInfo {
    return e as LightingInfo;
}

function checkList<T>(c: any, k: string, msgs: string[], func: (item: any, msgs: string[]) => T): T[] {
    if (!c.hasOwnProperty(k) || !c[k] || !Array.isArray(c[k])) {
        throw new Error("\"" + k + "\" is not an array.");
    }
    for (let i = 0, j = c[k].length; i < j; i++) {
        c[k][i] = func(c[k][i], msgs);
    }
    return c[k];
}

function check0(level: object, msgs: string[]): LevelState{
    return {
        name: defaultName(level, msgs),
        physicsSize: twoInts(level, "physicsSize"),
        graphicSize: twoInts(level, "graphicSize"),
        fpsRange: twoInts(level, "fpsRange"),
        playerpos: twoNums(level, "playerpos"),
        exitpos: twoNums(level, "exitpos"),
        background: checkBG(level["background"], msgs),
        enemies: checkList(level, "enemies", msgs, checkEnemy),
        lighting: checkLightings(level["lighting"], msgs),
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
    delete rj["_editorInfo"];
    delete rj["changed"];
    return rj;
}