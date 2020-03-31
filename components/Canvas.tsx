import React from "react";
import Toolbar from "./Toolbar";
import LevelModel from "models/LevelModel";

class Canvas extends React.Component<{level: LevelModel}> {
    render() {
        return <div className={"canvas"}>
            <Toolbar />
            <style jsx>{`
            .canvas {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                margin-top: 56px;
                background: rgb(99,148,237);
            }
            <CanvasContent level={level} />
            `}</style>
        </div>;
    }
}

export default Canvas;
