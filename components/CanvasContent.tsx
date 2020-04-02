import React from "react";
import CanvasSizeBox from "./canvas/CanvasSizeBox";
import CanvasSidebar from "./canvas/CanvasSidebar";

class CanvasContent extends React.Component {
    render() {
        return <>
            <CanvasSizeBox />
            <CanvasSidebar />
            </>;
    }
}

export default CanvasContent;
