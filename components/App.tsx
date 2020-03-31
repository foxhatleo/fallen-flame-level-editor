import React, {useState} from "react";
import Navigation from "./Navigation";
import TabScreen from "./TabScreen";
import LevelModel from "models/LevelEditor";
import NameWindow from "./NameWindow";

const NO_ACTION = 0;
const NEW_LEVEL_ASK = 1;

const App: React.FunctionComponent = () => {

    const [state, setState] = useState([[], NO_ACTION, 0]);
    const commitState = () => { setState([levels, action, select]); };

    let action: number = state[1] as number;
    let levels: Array<LevelModel> = state[0] as Array<LevelModel>;
    let select: number = state[2] as number;

    const clearAction = () => {
        action = NO_ACTION;
        commitState();
    };

    const onClose = () => {
        levels.splice(select, 1);
        commitState();
    };
    const onExport = () => {};
    const onImport = () => {};
    const onLevelBound = () => {};
    const onNew = () => {
        action = NEW_LEVEL_ASK;
        commitState();
    };

    const newLevel = (str) => {
        levels = levels.concat([new LevelModel(str)]);
        action = NO_ACTION;
        commitState();
    };

    return <React.Fragment>
        <Navigation onClose={onClose}
                    onExport={onExport}
                    onImport={onImport}
                    onLevelBound={onLevelBound}
                    onNew={onNew}
                    currentlySelecting={select >= 0 && levels.length > 0} />
        <TabScreen levels={levels} onSelect={i => { select = i; commitState(); }}/>
        <NameWindow value={":asdf"} show={action == NEW_LEVEL_ASK}
                    ok={newLevel} no={clearAction} new={true} />
    </React.Fragment>;
};

export default App;
