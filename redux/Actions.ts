import {Action, ActionType, NewLevelInfo} from "./ActionType";

const updater = <T> (type: ActionType):
    ((newValue: T, levelID?: number) => Action) => ((newValue: T, levelID?: number) =>
    ({type, newValue, levelID} as Action));
const marker = (type: ActionType): ((levelID?: number) => Action) => ((levelID?: number) =>
    ({type, levelID} as Action));
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
export const editorNewLevel = updater<NewLevelInfo>(ActionType.EDITOR_NEW_LEVEL);
export const editorCloseLevel = pure(ActionType.EDITOR_CLOSE_LEVEL);
export const editorOpenTab = marker(ActionType.EDITOR_OPEN_TAB);
export const updateSelected = updater<string>(ActionType.SELECT_IMAGE);
