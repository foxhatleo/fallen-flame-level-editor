import Canvas from "../canvas/Canvas";
import {Tab} from "react-bootstrap";
import React, {ReactNode} from "react";
import {LevelState} from "../../redux/StateType";

const LevelTab: (levelID: number, levels: LevelState[]) => ReactNode = (i, l) => {
    const level = l[i];
    return <Tab eventKey={"i-" + i} key={i} title={level.name + (level.changed ? "*" : "")}>
        <Canvas level={level} />
    </Tab>;
};

export default LevelTab;
