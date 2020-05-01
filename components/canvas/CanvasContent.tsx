import React, {FunctionComponent, useState} from "react";
import EditorState, {LevelState} from "../../redux/StateType";
import Grid from "./Grid";
import {connect} from "react-redux";
import Wall from "./Wall";
import Player from "./Player";
import Exit from "./Exit";
import Enemy from "./Enemy";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import PathCoors from "./PathCoors";
import FlarePickup from "./FlarePickup";

const CanvasContent: FunctionComponent<typeof Actions & {
    level: LevelState;
}> = (p) => {
    const px = p.level._editorInfo.view[0];
    const py = p.level._editorInfo.view[1];
    const tool = p.level._editorInfo.tool;
    window["vx"] = p.editorUpdateViewX;
    window["vy"] = p.editorUpdateViewY;
    function dragMouseDown(e) {
        e.preventDefault();
        p.editorChoose(-1);
        document.onmouseup = closeDrag;
        document.onmousemove = eleDrag.bind(this, e.clientX, e.clientY, px, py);
    }
    function eleDrag(cx, cy, px, py, e) {
        e.preventDefault();
        // calculate the new cursor position:
        p.editorUpdateViewX(px - cx + e.clientX);
        p.editorUpdateViewY(py - cy + e.clientY);
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
                <Wall level={p.level} id={i} key={i + 10000}/>)}
            <Player level={p.level} />
            <Exit level={p.level} />
            {[...Array(p.level.enemies.length)].map((_, i) =>
                [<Enemy level={p.level} id={i} key={i + 20000}/>, <PathCoors level={p.level} id={i} key={i}/>]
                )}
            {[...Array(p.level.items.length)].map((_, i) =>
                <FlarePickup level={p.level} id={i} key={i + 30000}/>
            )}
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

export default connect(null,
    d => bindActionCreators(Actions, d))(CanvasContent);
