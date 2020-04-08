import StateType, {LevelState} from "../StateType";
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

function toLevelID(s: LevelState[], l: number | LevelState): number {
    if (typeof l === "number") return l;
    const i = s.indexOf(l);
    return i < 0 ? undefined : 0;
}

export default function RootReducer(state: StateType = DEFAULT_STATE, action: Action): StateType {
    const updatedLevels = state.levels.concat();
    switch (action.type) {
        case ActionType.EDITOR_NEW_LEVEL:
            updatedLevels.push(action.newValue);
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
            let levelID1 = toLevelID(updatedLevels, action.level);
            levelID1 = guardLevelID(levelID1, state);
            const newCurrent = guardRange(guardInt(levelID1), 0, state.levels.length - 1);
            return {
                ...state,
                current: newCurrent,
                currentLevel: state.levels.length > 0 ? state.levels[newCurrent] : null,
            };
        default:
            let levelID2 = toLevelID(updatedLevels, action.level);
            levelID2 = guardLevelID(levelID2, state);
            if (!updatedLevels[levelID2]) return state;
            updatedLevels[levelID2] = LevelReducer(updatedLevels[levelID2], action);
            return {
                ...state,
                ...((levelID2 == state.current) ? {
                    currentLevel: updatedLevels[levelID2],
                } : {}),
                levels: updatedLevels
            };
    }
};
