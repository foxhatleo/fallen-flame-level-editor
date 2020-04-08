import React, {FunctionComponent, useState} from "react";
import EditorState, {LevelState} from "../../redux/StateType";
import Grid from "./Grid";
import {connect} from "react-redux";
import Wall from "./Wall";

const CanvasContent: FunctionComponent<{
    level: LevelState;
}> = (p) => {
    const [px, setPX] = useState(0);
    const [py, setPY] = useState(0);
    const tool = p.level._editorInfo.tool;
    function dragMouseDown(e) {
        if (tool != "hand") return;
        e.preventDefault();
        document.onmouseup = closeDrag;
        document.onmousemove = eleDrag.bind(this, e.clientX, e.clientY, px, py);
    }
    function eleDrag(cx, cy, px, py, e) {
        e.preventDefault();
        // calculate the new cursor position:
        setPX(px - cx + e.clientX);
        setPY(py - cy + e.clientY);
        // set the element's new position:
        // elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        // elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDrag() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
    return <div className={"ctc"} onMouseDown={dragMouseDown}>
        <div className={"in"}>
            <Grid level={p.level} />
            {[...Array(p.level.walls.length)].map((_, i) =>
                <Wall level={p.level} id={i}/>)}
        </div>
        <style jsx>{`
            div.ctc {
                cursor: ${tool == "hand" ? "grab" : "unset"};
                margin-top: ${py - 3000}px;
                margin-left: ${px - 3000}px;
                position: absolute;
                width: 6000px;
                height: 6000px;
            }
            div.in {
                margin-top: 3000px;
                margin-left: 3000px;
            }
            div.ctc:active {
                cursor: ${tool == "hand" ? "grabbing" : "unset"};
            }
        `}</style>
    </div>;
};

export default CanvasContent;
