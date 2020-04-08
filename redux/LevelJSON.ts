import {LevelState} from "./StateType";
import {newEditorInfo} from "./reducers/LevelReducer";

export function decode(level: object): LevelState {
    return {
        ...level,
        _editorInfo: newEditorInfo()
    } as LevelState;
    // TODO: JSON INPUT CHECK.
}

export function encode(level: LevelState): object {
    const rj = JSON.parse(JSON.stringify(level));
    delete rj["_editorInfo"];
    return rj;
}
