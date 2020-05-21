import React, {FunctionComponent, useRef} from "react";
import Toolbar from "./Toolbar";
import CanvasContent from "./CanvasContent";
import {LevelState} from "../../redux/StateType";
import Warning from "./Warning";

const Canvas: FunctionComponent<{
    level: LevelState;
}> = (p) => {
    const ctcRef = useRef<HTMLDivElement>();
    return <div className={"canvas"} ref={ctcRef}>
        <Toolbar level={p.level} />
        <CanvasContent level={p.level} ctcRef={ctcRef} />
        <Warning level={p.level} />
        <style jsx>{`
        .canvas {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin-top: 56px;
            background: black;
            overflow: hidden;
        }
    `}</style>
    </div>;
}

export default Canvas;
