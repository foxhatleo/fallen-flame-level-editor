import React from "react";
import LevelModel from "models/LevelModel";
import CanvasSizeBox from "./canvas/CanvasSizeBox";
import CanvasSidebar from "./canvas/CanvasSidebar/CanvasSidebar"

class CanvasContent extends React.Component<{level: LevelModel}> {
    render() {
        return <>
            <CanvasSidebar/>
            <CanvasSizeBox level={this.props.level} />
            </>;
    }
}

export default CanvasContent;
