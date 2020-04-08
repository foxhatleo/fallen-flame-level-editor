import React, {FunctionComponent} from "react";
import Toolbar from "./Toolbar";
import CanvasContent from "./CanvasContent";
import {LevelState} from "../../redux/StateType";

const Canvas: FunctionComponent<{
    level: LevelState;
}> = (p) => {
    return <div className={"canvas"}>
        <Toolbar level={p.level} />
        <CanvasContent level={p.level} />
        <style jsx>{`
        .canvas {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 56px;
            background: rgb(99,148,237);
            overflow: hidden;
        }
    `}</style>
    </div>;
}

export default Canvas;
