import React, {FunctionComponent, useState} from "react";
import EditorState, {LevelState} from "../../redux/StateType";
import Grid from "./Grid";
import {connect} from "react-redux";
import Wall from "./Wall";
import Player from "./Player";
import Exit from "./Exit";
import Enemy, {getYO} from "./Enemy";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import PathCoors from "./PathCoors";
import FlarePickup from "./FlarePickup";
import Text from "./Text";
import Tree from "./Tree";

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
    const renderedObjects = (p.level ? [
        {t:"player",k:-1,y:p.level.playerpos[1]},
        {t:"exit",k:-1,y:p.level.exitpos[1]},
        ...(p.level.enemies.map((c, i) =>
            ({t:"enemy",k:i,y:c.enemypos[1]}))),
        ...(p.level.items.map((c, i) =>
            ({t:"enemy",k:i,y:c.itemPos[1]}))),
        ...(p.level.walls.map((c, i) =>
            ({t:"wall",k:i,y:c.pos[1]}))),
        ...(p.level.trees.map((c, i) =>
            ({t:"tree",k:i,y:c.pos[1]}))),
    ] : []).sort((a, b) => ((a["y"] < b["y"]) ? 1 : -1));

    return <div className={"ctc"} onMouseDown={dragMouseDown}>
        <div className={"in"}>
            <Grid level={p.level} />
            {
                (renderedObjects.map(i => {
                    switch(i.t) {
                        case "player":
                            return <Player level={p.level} />;
                        case "exit":
                            return <Exit level={p.level} />;
                        case "enemy":
                            return [<Enemy level={p.level} id={i.k} key={i.k + 20000}/>,
                                <PathCoors yo={getYO(p.level.enemies[i.k])} level={p.level} id={i.k} key={"pc" + i.k}/>];
                        case "item":
                            return <FlarePickup level={p.level} id={i.k} key={i.k + 30000}/>;
                        case "wall":
                            return <Wall level={p.level} id={i.k} key={i.k + 10000}/>;
                        case "tree":
                            return <Tree level={p.level} id={i.k} key={i.k + 40000}/>;
                    }
                })).flat()
            }
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
