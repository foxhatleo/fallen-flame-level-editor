import {Action as ReduxAction} from "redux";
import {BackgroundTexture, BGM, LevelState, Themes, WallTexture} from "./StateType";

export enum ActionType {
    UPDATE_NAME,
    UPDATE_PHYSICS_WIDTH,
    UPDATE_PHYSICS_HEIGHT,
    UPDATE_FPS_LOWER,
    UPDATE_FPS_UPPER,
    MARK_UNCHANGED,
    MARK_CHANGED,
    EDITOR_NEW_LEVEL,
    EDITOR_CLOSE_LEVEL,
    EDITOR_OPEN_TAB,
    EDITOR_CHANGE_TOOL,
    EDITOR_CHOOSE,
    MOVE_WALL,
    CHANGE_WALL_TEXTURE,
    RESIZE_WALL,
    MOVE_PLAYER,
    MOVE_EXIT,
    MOVE_ENEMY,
    ADD_ENEMY,
    ADD_WALL,
    REMOVE,
    CHANGE_ENEMY_TYPE,
    SET_BACKGROUND,
    UPDATE_SNEAL_VAL,
    SET_VIEW_X,
    SET_VIEW_Y,
    UPDATE_PATH_COORS,
    UPDATE_BGM,
    UPDATE_START_FLARE_COUNT,
    UPDATE_MAX_FLARE_COUNT,
    MOVE_ITEM,
    ADD_ITEM,
    MOVE_TEXT,
    ADD_TEXT,
    RESIZE_TEXT,
    CHANGE_TEXT,
    CHANGE_THEME,
}

interface PureAction<T extends ActionType> extends ReduxAction<T> { }

interface LevelAction<T extends ActionType> extends PureAction<T> {
    level?: number | LevelState;
}

export interface SetterAction<T extends ActionType, S> extends LevelAction<T> {
    newValue: S;
}

export interface StringSetterAction<T extends ActionType> extends SetterAction<T, string> { }

export interface NumberSetterAction<T extends ActionType> extends SetterAction<T, number> { }

export type Action =
    | StringSetterAction<ActionType.UPDATE_NAME>
    | SetterAction<ActionType.UPDATE_BGM, BGM>
    | NumberSetterAction<ActionType.UPDATE_PHYSICS_WIDTH>
    | NumberSetterAction<ActionType.UPDATE_PHYSICS_HEIGHT>
    | NumberSetterAction<ActionType.UPDATE_START_FLARE_COUNT>
    | NumberSetterAction<ActionType.UPDATE_MAX_FLARE_COUNT>
    | NumberSetterAction<ActionType.UPDATE_SNEAL_VAL>
    | NumberSetterAction<ActionType.UPDATE_FPS_LOWER>
    | NumberSetterAction<ActionType.UPDATE_FPS_UPPER>
    | LevelAction<ActionType.MARK_CHANGED>
    | LevelAction<ActionType.MARK_UNCHANGED>
    | SetterAction<ActionType.EDITOR_NEW_LEVEL, LevelState>
    | StringSetterAction<ActionType.EDITOR_CHANGE_TOOL>
    | PureAction<ActionType.EDITOR_CLOSE_LEVEL>
    | LevelAction<ActionType.EDITOR_OPEN_TAB>
    | NumberSetterAction<ActionType.EDITOR_CHOOSE>
    | NumberSetterAction<ActionType.SET_VIEW_X>
    | NumberSetterAction<ActionType.SET_VIEW_Y>
    | SetterAction<ActionType.MOVE_WALL, [number, [number, number]]>
    | SetterAction<ActionType.MOVE_TEXT, [number, [number, number]]>
    | SetterAction<ActionType.MOVE_ITEM, [number, [number, number]]>
    | SetterAction<ActionType.RESIZE_WALL, [number, [number, number]]>
    | SetterAction<ActionType.RESIZE_TEXT, [number, [number, number]]>
    | SetterAction<ActionType.MOVE_PLAYER, [number, number]>
    | SetterAction<ActionType.MOVE_EXIT, [number, number]>
    | SetterAction<ActionType.MOVE_ENEMY, [number, [number, number], boolean?]>
    | LevelAction<ActionType.ADD_ENEMY>
    | LevelAction<ActionType.ADD_WALL>
    | LevelAction<ActionType.ADD_ITEM>
    | StringSetterAction<ActionType.ADD_TEXT>
    | LevelAction<ActionType.REMOVE>
    | SetterAction<ActionType.CHANGE_ENEMY_TYPE, [number, string, boolean]>
    | SetterAction<ActionType.UPDATE_PATH_COORS, [number, [number, number][]]>
    | SetterAction<ActionType.CHANGE_WALL_TEXTURE, [number, WallTexture]>
    | SetterAction<ActionType.CHANGE_TEXT, [number, string]>
    | SetterAction<ActionType.SET_BACKGROUND, BackgroundTexture>
    | SetterAction<ActionType.CHANGE_THEME, [Themes, boolean]>
    ;
