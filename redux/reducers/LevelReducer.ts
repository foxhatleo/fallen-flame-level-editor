import {Action, ActionType} from "../ActionType";
import {LevelEditorInfo, LevelState, WallInfo} from "../StateType";
import {guardNonEmptyString} from "../Validators";
import PairReducer from "./PairReducer";

export const newLevel: (psx: number, psy: number) => LevelState =
    (psx = 16, psy = 12) => ({
    name: "Untitled",
    physicsSize: [psx, psy],
    graphicSize: [800, 600],
    fpsRange: [20, 60],
    playerpos: [1.5, 1.5],
    exitpos: [1.5, 5.35],
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
    {pos: pos, size: size, texture: "earth"}
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
        case ActionType.MARK_CHANGED:
            return {...state, changed: true};
        case ActionType.MARK_UNCHANGED:
            return {...state, changed: false};
        case ActionType.EDITOR_CHOOSE:
            return {...state, _editorInfo: {
                    ...state._editorInfo,
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
            return {...state,
                walls: newWalls
            };
        case ActionType.MOVE_EXIT:
            return {
                ...state,
                exitpos: action.newValue,
            };
        case ActionType.RESIZE_WALL:
            const newWalls2 = state.walls.concat();
            let wall2 = newWalls2[action.newValue[0]];
            wall = {
                ...wall2,
                size: action.newValue[1],
            };
            newWalls2[action.newValue[0]] = wall;
            return {...state,
                walls: newWalls2
            };
        case ActionType.MOVE_PLAYER:
            return {
                ...state,
                playerpos: action.newValue,
            };
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