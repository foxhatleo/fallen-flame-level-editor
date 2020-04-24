import {Action, ActionType} from "./ActionType";
import {LevelState} from "./StateType";

const updater = <T> (type: ActionType):
    ((newValue: T, level?: number | LevelState) => Action) => ((newValue: T, level?: number | LevelState) =>
    ({type, newValue, level} as Action));
const marker = (type: ActionType): ((level?: number | LevelState) => Action) => ((level?: number | LevelState) =>
    ({type, level} as Action));
const pure = (type: ActionType): (() => Action) => (() => ({type} as Action));

export const updateName = updater<string>(ActionType.UPDATE_NAME);
export const setBackground = updater<string>(ActionType.SET_BACKGROUND);
export const updatePhysicsWidth = updater<number>(ActionType.UPDATE_PHYSICS_WIDTH);
export const updatePhysicsHeight = updater<number>(ActionType.UPDATE_PHYSICS_HEIGHT);
export const updateFPSLower = updater<number>(ActionType.UPDATE_FPS_LOWER);
export const updateFPSUpper = updater<number>(ActionType.UPDATE_FPS_UPPER);
export const updateSneakVal = updater<number>(ActionType.UPDATE_SNEAL_VAL);
export const markUnchanged = marker(ActionType.MARK_UNCHANGED);
export const markChanged = marker(ActionType.MARK_CHANGED);
export const editorNewLevel = updater<LevelState>(ActionType.EDITOR_NEW_LEVEL);
export const editorCloseLevel = pure(ActionType.EDITOR_CLOSE_LEVEL);
export const editorOpenTab = marker(ActionType.EDITOR_OPEN_TAB);
export const editorChangeTool = updater<string>(ActionType.EDITOR_CHANGE_TOOL);
export const editorUpdateViewX = updater<number>(ActionType.SET_VIEW_X);
export const editorUpdateViewY = updater<number>(ActionType.SET_VIEW_Y);
export const editorChoose = updater<number>(ActionType.EDITOR_CHOOSE);
export const moveWall = updater<[number, [number, number]]>(ActionType.MOVE_WALL);
export const resizeWall = updater<[number, [number, number]]>(ActionType.RESIZE_WALL);
export const movePlayer = updater<[number, number]>(ActionType.MOVE_PLAYER);
export const moveExit = updater<[number, number]>(ActionType.MOVE_EXIT);
export const moveEnemy = updater<[number, [number, number], boolean?]>(ActionType.MOVE_ENEMY);
export const changeEnemyType = updater<[number, string, boolean]>(ActionType.CHANGE_ENEMY_TYPE);
export const updatePathCoors = updater<[number, [number, number][]]>(ActionType.UPDATE_PATH_COORS);
export const changeWallTexture = updater<[number, string]>(ActionType.CHANGE_WALL_TEXTURE);
export const addEnemy = marker(ActionType.ADD_ENEMY);
export const addWall = marker(ActionType.ADD_WALL);
export const remove = marker(ActionType.REMOVE);
