import {FunctionComponent} from "react";
import {LevelState} from "../../redux/StateType";
import * as Actions from "../../redux/Actions";

const Item: FunctionComponent<{
    level: LevelState;
    width: number;
    height: number;
    x: number;
    y: number;
    resizable?: boolean;
    movable?: boolean;
    chosen: boolean;
    onResize?: (w: number, h: number) => void;
    onMove?: (x: number, y: number) => void;
    onChoose?: () => void;
}> = (p) => {
    const resizable = typeof p.resizable === "undefined" ? false : p.resizable;
    const movable = typeof p.movable === "undefined" ? true : p.movable;
    const xs = p.level.graphicSize[0] / p.level.physicsSize[0];
    const ys = p.level.graphicSize[1] / p.level.physicsSize[1];
    const inArrow = p.level._editorInfo.tool == "pointer";

    function mouseDown() {
        if (!inArrow) return;
        p.onChoose();
    }

    return <div onMouseDown={mouseDown} className={"item-out" + (p.chosen ? " chosen" : "")}>
        {p.children}
        <style jsx>{`
        .item-out {
        position: absolute;
        width: ${p.width * xs}px;
        height: ${p.height * ys}px;
        left: ${3000 + (p.x - p.width / 2) * xs}px;
        top: ${3000 + (p.level.physicsSize[1] - p.y - p.height / 2) * xs}px;
        }
        .chosen {
            border: 1.5px solid black;
        }
        `}</style>
        </div>;
}

export default Item;
