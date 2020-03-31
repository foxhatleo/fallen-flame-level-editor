import React from "react";
import LevelModel from "models/LevelModel";
import CanvasSizeBox from "./canvas/CanvasSizeBox";

class CanvasContent extends React.Component<{level: LevelModel}> {
    render() {
        return <>
            <CanvasSizeBox level={this.props.level} />
            </>;
    }
}

export default CanvasContent;
