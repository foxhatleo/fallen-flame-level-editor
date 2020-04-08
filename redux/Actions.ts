import {Action, ActionType} from "./ActionType";
import {LevelState} from "./StateType";

const updater = <T> (type: ActionType):
    ((newValue: T, level?: number | LevelState) => Action) => ((newValue: T, level?: number | LevelState) =>
    ({type, newValue, level} as Action));
const marker = (type: ActionType): ((level?: number | LevelState) => Action) => ((level?: number | LevelState) =>
    ({type, level} as Action));
const pure = (type: ActionType): (() => Action) => (() => ({type} as Action));

export const updateName = updater<string>(ActionType.UPDATE_NAME);
export const updatePhysicsWidth = updater<number>(ActionType.UPDATE_PHYSICS_WIDTH);
export const updatePhysicsHeight = updater<number>(ActionType.UPDATE_PHYSICS_HEIGHT);
export const updateGraphicWidth = updater<number>(ActionType.UPDATE_GRAPHIC_WIDTH);
export const updateGraphicHeight = updater<number>(ActionType.UPDATE_GRAPHIC_HEIGHT);
export const updateFPSLower = updater<number>(ActionType.UPDATE_FPS_LOWER);
export const updateFPSUpper = updater<number>(ActionType.UPDATE_FPS_UPPER);
export const markUnchanged = marker(ActionType.MARK_UNCHANGED);
export const markChanged = marker(ActionType.MARK_CHANGED);
export const editorNewLevel = updater<LevelState>(ActionType.EDITOR_NEW_LEVEL);
export const editorCloseLevel = pure(ActionType.EDITOR_CLOSE_LEVEL);
export const editorOpenTab = marker(ActionType.EDITOR_OPEN_TAB);
export const editorChangeTool = updater<string>(ActionType.EDITOR_CHANGE_TOOL);
export const editorChoose = updater<number>(ActionType.EDITOR_CHOOSE);
export const moveWall = updater<[number, [number, number]]>(ActionType.MOVE_WALL);
export const resizeWall = updater<[number, [number, number]]>(ActionType.RESIZE_WALL);
export const movePlayer = updater<[number, number]>(ActionType.MOVE_PLAYER);
export const moveExit = updater<[number, number]>(ActionType.MOVE_EXIT);
export const moveEnemy = updater<[number, [number, number]]>(ActionType.MOVE_ENEMY);
export const addEnemy = marker(ActionType.ADD_ENEMY);
export const addWall = marker(ActionType.ADD_WALL);
export const remove = marker(ActionType.REMOVE);
