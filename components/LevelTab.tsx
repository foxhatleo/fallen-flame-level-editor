import Canvas from "./Canvas";
import {Tab} from "react-bootstrap";
import React, {FunctionComponent, ReactNode} from "react";
import {connect} from "react-redux";
import EditorState, {LevelState} from "../redux/StateType";

const LevelTab: (levelID: number, levels: LevelState[]) => ReactNode = (i, l) => {
    const level = l[i];
    return <Tab eventKey={"i-" + i} title={level.name + (level.changed ? "*" : "")}>
        <Canvas />
    </Tab>;
};

export default LevelTab;
