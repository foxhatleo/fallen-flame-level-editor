import {Action, ActionType} from "../ActionType";
import {EnemyInfo, LevelEditorInfo, LevelState, WallInfo} from "../StateType";
import {guardInt, guardNonEmptyString, guardRange} from "../Validators";
import PairReducer from "./PairReducer";

export const newLevel: (psx: number, psy: number) => LevelState =
    (psx = 16, psy = 12) => ({
    name: "Untitled",
    physicsSize: [psx, psy],
    fpsRange: [20, 60],
    playerpos: [3, 3],
    exitpos: [3, 5.35],
    background: {texture: "floor-tile"},
    changed: true,
    enemies: [],
    items: [],
    lighting: {
        "color":	  	[0, 0, 0, 0],
        "gamma":		true,
        "diffuse":		true,
        "blur":			1
    },
    walls: [
        newWall([psx / 2, psy - 1.28 / 2], [Math.floor(psx / 1.28) * 1.28, 1.28], "wall-side"),
        newWall([1.28 / 2, psy / 2], [1.28, Math.floor(psy / 1.28) * 1.28], "wall-top"),
        newWall([psx - 1.28 / 2, psy / 2], [1.28, Math.floor(psy / 1.28) * 1.28], "wall-top"),
        newWall([psx / 2, 1.28 / 2], [Math.floor(psx / 1.28) * 1.28, 1.28], "wall-side"),
    ],
    _editorInfo: newEditorInfo(),
});

const newPathCoorsIfNecessary = (p: [number, number][], e: EnemyInfo): [number, number][] => {
    if (!p || p.length < 2) {
        return [
            [e.enemypos[0] + 4, e.enemypos[1]]
        ];
    }
    return p;
}

const newItemPos = (l: LevelState, w?: number, h?: number): [number, number] => {
    const wb = typeof w === "undefined" ? 0 : w / 2;
    const hb = typeof h === "undefined" ? 0 : h / 2;
    return [
        guardRange(- l._editorInfo.view[0] / 50 + 1.2, wb, l.physicsSize[0] - wb),
        guardRange((l.physicsSize[1] + l._editorInfo.view[1] / 50) - 4, hb, l.physicsSize[1] - hb),
    ];
};

export const newEditorInfo = (): LevelEditorInfo => (
    {
        chosen: -1,
        tool: "hand",
        view: [0, 0],
    }
);

export const newWall = (pos: [number, number], size: [number, number], texture: string): WallInfo => (
    {pos: pos, size: size, texture: texture}
)

const PhysicsSizeReducer = PairReducer(
    ActionType.UPDATE_PHYSICS_WIDTH, ActionType.UPDATE_PHYSICS_HEIGHT,
    1, 100, false);
const FPSRangeReducer = PairReducer(
    ActionType.UPDATE_FPS_LOWER, ActionType.UPDATE_FPS_UPPER,
    1, 500, true, true);
const ViewReducer = PairReducer(
    ActionType.SET_VIEW_X, ActionType.SET_VIEW_Y,
    -Infinity, Infinity, false, false);

export default function LevelReducer(state: LevelState, action: Action): LevelState {
    switch (action.type) {
        case ActionType.EDITOR_CHANGE_TOOL:
            return {
                ...state,
                _editorInfo: {
                    ...state._editorInfo,
                    chosen: action.newValue === "pointer" ? state._editorInfo.chosen : -1,
                    tool: action.newValue,
                }
            };
        case ActionType.UPDATE_NAME:
            return {...state, changed: true,
                name: guardNonEmptyString(action.newValue, "Untitled")};
        case ActionType.UPDATE_BGM:
            return {...state, changed: true,
                bgm: action.newValue ? action.newValue : undefined};
        case ActionType.UPDATE_START_FLARE_COUNT: {
            const {startFlareCount, ...stateDel} = state;
            const v = guardRange(guardInt(action.newValue), -1, 1000);
            return {...stateDel, changed: true, ...(v < 0 ? {} : {startFlareCount: v})};
        }
        case ActionType.UPDATE_MAX_FLARE_COUNT: {
            const {maxFlareCount, ...stateDel} = state;
            const v = guardRange(guardInt(action.newValue), -1, 1000);
            return {...stateDel, changed: true, ...(v < 0 ? {} : {maxFlareCount: v})};
        }
        case ActionType.UPDATE_SNEAL_VAL:
            const {startSneakVal, ...stateDel} = state;
            const v = guardRange(guardInt(action.newValue), -1, 100000);
            return {...stateDel, changed: true, ...(v < 0 ? {} : {startSneakVal: v})};
        case ActionType.SET_BACKGROUND:
            return {...state, changed: true,
                background: {texture: guardNonEmptyString(action.newValue, "floor-tile")}};
        case ActionType.MARK_CHANGED:
            return {...state, changed: true};
        case ActionType.MARK_UNCHANGED:
            return {...state, changed: false};
        case ActionType.EDITOR_CHOOSE:
            return {...state, _editorInfo: {
                    ...state._editorInfo,
                    ...(action.newValue < 0 ? {} : {tool: "pointer"}),
                    chosen: action.newValue,
                }};
        case ActionType.MOVE_WALL:
            const newWalls = state.walls.concat();
            let wall = newWalls[action.newValue[0]];
            wall = {
                ...wall,
                pos: action.newValue[1],
            };
            newWalls[action.newValue[0]] = wall;
            return {...state,changed: true,
                walls: newWalls
            };
        case ActionType.MOVE_ITEM: {
            const newWalls = state.items.concat();
            let wall = newWalls[action.newValue[0]];
            wall = {
                ...wall,
                itemPos: action.newValue[1],
            };
            newWalls[action.newValue[0]] = wall;
            return {
                ...state, changed: true,
                items: newWalls
            };
        }
        case ActionType.CHANGE_WALL_TEXTURE: {
            const newWalls2 = state.walls.concat();
            let wall2 = newWalls2[action.newValue[0]];
            wall2 = {
                ...wall2,
                texture: guardNonEmptyString(action.newValue[1], "wall-side"),
            };
            newWalls2[action.newValue[0]] = wall2;
            return {
                ...state, changed: true,
                walls: newWalls2
            };
        }
        case ActionType.MOVE_ENEMY:
            const newE = state.enemies.concat();
            let e = newE[action.newValue[0]];
            const [px, py] = e.enemypos.concat();
            e = {
                ...e,
                enemypos: action.newValue[1],
                ...(e.pathCoors && (action.newValue.length < 2 || !action.newValue[2]) ? {pathCoors: e.pathCoors
                        .map(([x, y]) => [x + action.newValue[1][0] - px, y + action.newValue[1][1] - py])} : {})
            };
            newE[action.newValue[0]] = e;
            return {...state,changed: true,
                enemies: newE
            };
        case ActionType.UPDATE_PATH_COORS: {
            const newE2 = state.enemies.concat();
            let e2 = newE2[action.newValue[0]];
            e2 = {
                ...e2,
                pathCoors: action.newValue[1],
            };
            newE2[action.newValue[0]] = e2;
            return {...state, changed: true,
                enemies: newE2
            };
        }
        case ActionType.CHANGE_ENEMY_TYPE:
            const newE2 = state.enemies.concat();
            let e2 = newE2[action.newValue[0]];
            const {subtype, pathCoors, ...e2v} = e2;
            e2 = {
                ...e2v,
                enemytype: action.newValue[1],
                ...(action.newValue[2] ? {subtype: "pathing", pathCoors: newPathCoorsIfNecessary(pathCoors, e2)} : {}),
            };
            newE2[action.newValue[0]] = e2;
            return {...state,changed: true,
                enemies: newE2
            };
        case ActionType.MOVE_EXIT:
            return {
                ...state,changed: true,
                exitpos: action.newValue,
            };
        case ActionType.RESIZE_WALL:
            const newWalls2 = state.walls.concat();
            let wall2 = newWalls2[action.newValue[0]];
            wall2 = {
                ...wall2,
                size: action.newValue[1],
            };
            newWalls2[action.newValue[0]] = wall2;
            return {...state,changed: true,
                walls: newWalls2
            };
        case ActionType.MOVE_PLAYER:
            return {
                ...state,
                playerpos: action.newValue,
            };
        case ActionType.ADD_ITEM: {
            const newnm = state.items.concat();
            newnm.push({itemPos: newItemPos(state), itemType: "flare"});
            return LevelReducer({
                ...state, changed: true,
                items: newnm
            }, {type: ActionType.EDITOR_CHOOSE, newValue: 30000 + newnm.length - 1, level: action.level});
        }
        case ActionType.ADD_ENEMY:
            const newnm = state.enemies.concat();
            newnm.push({enemypos: newItemPos(state), enemytype: "typeA"});
            return LevelReducer({
                ...state,changed: true,
                enemies: newnm
            }, {type: ActionType.EDITOR_CHOOSE, newValue: 20000 + newnm.length - 1, level: action.level});
        case ActionType.ADD_WALL:
            const newwl = state.walls.concat();
            newwl.push({pos: newItemPos(state, 1.28 * 2, 1.28 * 2), size: [1.28 * 2, 1.28 * 2], texture: "wall-side"});
            return LevelReducer({
                ...state,changed: true,
                walls: newwl
            }, {type: ActionType.EDITOR_CHOOSE, newValue: 10000 + newwl.length - 1, level: action.level});
        case ActionType.REMOVE:
            const c = state._editorInfo.chosen;
            if (c < 10000) return state;
            let updates = {};
            if (c >= 10000 && c < 20000) {
                const newwl = state.walls.concat();
                newwl.splice(c - 10000, 1);
                updates["walls"] = newwl;
            } else if (c >= 20000 && c < 30000) {
                const newen = state.enemies.concat();
                newen.splice(c - 20000, 1);
                updates["enemies"] = newen;
            } else if (c >= 30000 && c < 40000) {
                const newen = state.items.concat();
                newen.splice(c - 30000, 1);
                updates["items"] = newen;
            }
            return LevelReducer({
                ...state,changed: true,
                ...updates,
            }, {type: ActionType.EDITOR_CHOOSE, newValue: -1, level: action.level});
        case ActionType.UPDATE_FPS_LOWER:
        case ActionType.UPDATE_FPS_UPPER:
        case ActionType.UPDATE_PHYSICS_HEIGHT:
        case ActionType.UPDATE_PHYSICS_WIDTH:
            return {...state, changed: true,
                physicsSize: PhysicsSizeReducer(state.physicsSize, action),
                fpsRange: FPSRangeReducer(state.fpsRange, action),
            };
        case ActionType.SET_VIEW_X:
        case ActionType.SET_VIEW_Y:
            return {...state, _editorInfo: {
                    ...state._editorInfo,
                    view: ViewReducer(state._editorInfo.view, action),
                }}
        default:
            throw new Error("Reducer hasn't implemented this action.");
    }
};