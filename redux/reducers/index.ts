import StateType from "../StateType";
import {Action, ActionType} from "../ActionType";
import LevelReducer, {newLevel} from "./LevelReducer";
import {editorOpenTab} from "../Actions";
import {guardInt, guardRange} from "../Validators";

const DEFAULT_STATE: StateType = {
    levels: [],
    current: 0,
    currentLevel: null,
};

function guardLevelID(i: any, s: StateType): number {
    const n: number = (typeof i !== "number") ? s.current : i;
    return (n >= 0) ? n : (s.levels.length + n);
}

export default function RootReducer(state: StateType = DEFAULT_STATE, action: Action): StateType {
    const updatedLevels = state.levels.concat();
    switch (action.type) {
        case ActionType.EDITOR_NEW_LEVEL:
            const l = newLevel();
            l.name = action.newValue[0];
            l.physicsSize[0] = action.newValue[1];
            l.physicsSize[1] = action.newValue[2];
            updatedLevels.push(l);
            return RootReducer({
                ...state,
                levels: updatedLevels
            }, editorOpenTab(-1));
        case ActionType.EDITOR_CLOSE_LEVEL:
            updatedLevels.splice(state.current, 1);
            return RootReducer({
                ...state,
                levels: updatedLevels
            }, editorOpenTab(state.current));
        case ActionType.EDITOR_OPEN_TAB:
            action.levelID = guardLevelID(action.levelID, state);
            const newCurrent = guardRange(guardInt(action.levelID), 0, state.levels.length - 1);
            return {
                ...state,
                current: newCurrent,
                currentLevel: state.levels.length > 0 ? state.levels[newCurrent] : null,
            };
        default:
            action.levelID = guardLevelID(action.levelID, state);
            if (!updatedLevels[action.levelID]) return state;
            updatedLevels[action.levelID] = LevelReducer(updatedLevels[action.levelID], action);
            return {
                ...state,
                levels: updatedLevels
            };
    }
};
