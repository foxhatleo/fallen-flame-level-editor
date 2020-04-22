import {Action, ActionType} from "../ActionType";
import {LevelEditorInfo, LevelState, WallInfo} from "../StateType";
import {guardInt, guardNonEmptyString, guardRange} from "../Validators";
import PairReducer from "./PairReducer";

export const newLevel: (psx: number, psy: number) => LevelState =
    (psx = 16, psy = 12) => ({
    name: "Untitled",
    physicsSize: [psx, psy],
    graphicSize: [800, 600],
    fpsRange: [20, 60],
    playerpos: [1.5, 1.5],
    exitpos: [1.5, 5.35],
    background: {texture: "floor-tile"},
    changed: true,
    enemies: [],
    lighting: {
        "color":	  	[0, 0, 0, 0],
        "gamma":		true,
        "diffuse":		true,
        "blur":			1
    },
    walls: [
        newWall([.25, psy / 2], [.5, psy]),
        newWall([psx / 2, .25], [psx, .5]),
        newWall([psx / 2, psy - .25], [psx, .5]),
        newWall([psx - .25, psy / 2], [.5, psy]),
    ],
    _editorInfo: newEditorInfo(),
});

export const newEditorInfo = (): LevelEditorInfo => (
    {
        chosen: -1,
        tool: "hand",
    }
);

export const newWall = (pos: [number, number], size: [number, number]): WallInfo => (
    {pos: pos, size: size, texture: "wall-side"}
)

const PhysicsSizeReducer = PairReducer(
    ActionType.UPDATE_PHYSICS_WIDTH, ActionType.UPDATE_PHYSICS_HEIGHT,
    1, 100, false);
const GraphicSizeReducer = PairReducer(
    ActionType.UPDATE_GRAPHIC_WIDTH, ActionType.UPDATE_GRAPHIC_HEIGHT,
    100, 5000, true);
const FPSRangeReducer = PairReducer(
    ActionType.UPDATE_FPS_LOWER, ActionType.UPDATE_FPS_UPPER,
    1, 500, true, true);

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
                    chosen: state._editorInfo.tool === "pointer" ? action.newValue : -1,
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
            e = {
                ...e,
                enemypos: action.newValue[1],
            };
            newE[action.newValue[0]] = e;
            return {...state,changed: true,
                enemies: newE
            };
        case ActionType.CHANGE_ENEMY_TYPE:
            const newE2 = state.enemies.concat();
            let e2 = newE2[action.newValue[0]];
            e2 = {
                ...e2,
                enemytype: action.newValue[1],
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
        case ActionType.ADD_ENEMY:
            const newnm = state.enemies.concat();
            newnm.push({enemypos: [1, 1], enemytype: "typeA"});
            return LevelReducer({
                ...state,changed: true,
                enemies: newnm
            }, {type: ActionType.EDITOR_CHOOSE, newValue: 20000 + newnm.length - 1, level: action.level});
        case ActionType.ADD_WALL:
            const newwl = state.walls.concat();
            newwl.push({pos: [2, 2], size: [2, 2], texture: "earth"});
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
            }
            return LevelReducer({
                ...state,changed: true,
                ...updates,
            }, {type: ActionType.EDITOR_CHOOSE, newValue: -1, level: action.level});
        case ActionType.UPDATE_FPS_LOWER:
        case ActionType.UPDATE_FPS_UPPER:
        case ActionType.UPDATE_GRAPHIC_WIDTH:
        case ActionType.UPDATE_GRAPHIC_HEIGHT:
        case ActionType.UPDATE_PHYSICS_HEIGHT:
        case ActionType.UPDATE_PHYSICS_WIDTH:
            return {...state, changed: true,
                physicsSize: PhysicsSizeReducer(state.physicsSize, action),
                graphicSize: GraphicSizeReducer(state.graphicSize, action),
                fpsRange: FPSRangeReducer(state.fpsRange, action),
            };
        default:
            throw new Error("Reducer hasn't implemented this action.");
    }
};