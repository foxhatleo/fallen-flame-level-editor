import {Action as ReduxAction} from "redux";
import {LevelState} from "./StateType";
import Item from "../components/canvas/Item";

export enum ActionType {
    UPDATE_NAME,
    UPDATE_PHYSICS_WIDTH,
    UPDATE_PHYSICS_HEIGHT,
    UPDATE_GRAPHIC_WIDTH,
    UPDATE_GRAPHIC_HEIGHT,
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
    RESIZE_WALL,
    MOVE_PLAYER,
    MOVE_EXIT,
    MOVE_ENEMY,
    ADD_ENEMY,
    ADD_WALL,
    REMOVE,
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
    | NumberSetterAction<ActionType.UPDATE_PHYSICS_WIDTH>
    | NumberSetterAction<ActionType.UPDATE_PHYSICS_HEIGHT>
    | NumberSetterAction<ActionType.UPDATE_GRAPHIC_WIDTH>
    | NumberSetterAction<ActionType.UPDATE_GRAPHIC_HEIGHT>
    | NumberSetterAction<ActionType.UPDATE_FPS_LOWER>
    | NumberSetterAction<ActionType.UPDATE_FPS_UPPER>
    | LevelAction<ActionType.MARK_CHANGED>
    | LevelAction<ActionType.MARK_UNCHANGED>
    | SetterAction<ActionType.EDITOR_NEW_LEVEL, LevelState>
    | StringSetterAction<ActionType.EDITOR_CHANGE_TOOL>
    | PureAction<ActionType.EDITOR_CLOSE_LEVEL>
    | LevelAction<ActionType.EDITOR_OPEN_TAB>
    | NumberSetterAction<ActionType.EDITOR_CHOOSE>
    | SetterAction<ActionType.MOVE_WALL, [number, [number, number]]>
    | SetterAction<ActionType.RESIZE_WALL, [number, [number, number]]>
    | SetterAction<ActionType.MOVE_PLAYER, [number, number]>
    | SetterAction<ActionType.MOVE_EXIT, [number, number]>
    | SetterAction<ActionType.MOVE_ENEMY, [number, [number, number]]>
    | LevelAction<ActionType.ADD_ENEMY>
    | LevelAction<ActionType.ADD_WALL>
    | LevelAction<ActionType.REMOVE>
    ;
