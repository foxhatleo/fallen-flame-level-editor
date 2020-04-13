import {FunctionComponent} from "react";
import {LevelState} from "../../redux/StateType";
import {guardNumber, guardRange} from "../../redux/Validators";

const Item: FunctionComponent<{
    level: LevelState;
    width: number;
    height: number;
    x: number;
    y: number;
    xOffset?: number;
    yOffset?: number;
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
    const xo = guardNumber(p.xOffset), yo = guardNumber(p.yOffset);
    function eleDrag(cx, cy, px, py, pw, ph, spot, e) {
        e.preventDefault();
        // calculate the new cursor position:
        let newX = px;
        let newY = py;
        const vx = p.level.physicsSize[0], vy = p.level.physicsSize[1];
        if (spot < 0) {
            newX = px + (e.clientX - cx) / xs;
            newY = py - (e.clientY - cy) / ys;
            newX = Math.min(vx - p.width / 2, Math.max(p.width / 2, newX));
            newY = Math.min(vy - p.height / 2, Math.max(p.height / 2, newY));
        } else {
            let fourLines = [
                px - pw / 2, // LEFT
                px + pw / 2, // RIGHT
                py + ph / 2, // TOP
                py - ph / 2, // BOTTOM
            ];
            if (spot == 0 || spot == 1 || spot == 2) {
                let orig = fourLines[2];
                fourLines[2] = guardRange(fourLines[2] - (e.clientY - cy) / ys, py + .25, vy);
                fourLines[3] = guardRange(fourLines[3] - (fourLines[2] - orig), 0, vy);
            }
            if (spot == 0 || spot == 3 || spot == 5) {
                let orig = fourLines[0];
                fourLines[0] = guardRange(fourLines[0] + (e.clientX - cx) / xs, 0, px - .25);
                fourLines[1] = guardRange(fourLines[1] - (fourLines[0] - orig), 0, vx);
            }
            if (spot == 2 || spot == 4 || spot == 7) {
                let orig = fourLines[1];
                fourLines[1] = guardRange(fourLines[1] + (e.clientX - cx) / xs, px + .25, vx);
                fourLines[0] = guardRange(fourLines[0] - (fourLines[1] - orig), 0, vx);
            }
            if (spot == 5 || spot == 6 || spot == 7) {
                let orig = fourLines[3];
                fourLines[3] = guardRange(fourLines[3] - (e.clientY - cy) / ys, 0, py - .25);
                fourLines[2] = guardRange(fourLines[2] - (fourLines[3] - orig), 0, vy);
            }
            const newH = fourLines[2] - fourLines[3],
                newW = fourLines[1] - fourLines[0];
            if (p.onResize) p.onResize(newW, newH);
            newY = (fourLines[2] + fourLines[3]) / 2;
            newX = (fourLines[0] + fourLines[1]) / 2;
        }
        if (p.onMove) p.onMove(newX, newY);
    }
    function closeDrag() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
    function mouseDown(e) {
        if (!inArrow) return;
        p.onChoose();
        if (!movable) return;
        e.stopPropagation();
        e.preventDefault();
        document.onmouseup = closeDrag;
        document.onmousemove = eleDrag.bind(this, e.clientX, e.clientY, p.x, p.y, p.width, p.height, -1);
    }

    function resizeDown(spot: number, e: MouseEvent) {
        if (!inArrow) return;
        p.onChoose();
        if (!resizable) return;
        e.stopPropagation();
        e.preventDefault();
        document.onmouseup = closeDrag;
        document.onmousemove = eleDrag.bind(this, e.clientX, e.clientY, p.x, p.y, p.width, p.height, spot);
    }

    return <div onMouseDown={mouseDown} className={"item-out" + (p.chosen ? " chosen" : "")}>
        {p.children}
        <div className={"rs tl"} onMouseDown={resizeDown.bind(this, 0)} />
        <div className={"rs t"} onMouseDown={resizeDown.bind(this, 1)} />
        <div className={"rs tr"} onMouseDown={resizeDown.bind(this, 2)} />
        <div className={"rs l"} onMouseDown={resizeDown.bind(this, 3)} />
        <div className={"rs r"} onMouseDown={resizeDown.bind(this, 4)} />
        <div className={"rs bl"} onMouseDown={resizeDown.bind(this, 5)} />
        <div className={"rs b"} onMouseDown={resizeDown.bind(this, 6)} />
        <div className={"rs br"} onMouseDown={resizeDown.bind(this, 7)} />
        <div className={"rs ctr"} />
        <style jsx>{`
        .item-out {
        position: absolute;
        width: ${p.width * xs}px;
        height: ${p.height * ys}px;
        left: ${3000 + (p.x - p.width / 2) * xs + xo}px;
        top: ${3000 + (p.level.physicsSize[1] - p.y - p.height / 2) * xs + yo}px;
        }
        .chosen {
            outline: 2px solid white;
            z-index: 1;
        }
        .rs {
            display: ${p.chosen && p.resizable? "block" : "none"};
           position: absolute;
           width: 6px;
           height: 6px;
           background: white;
           margin-top: -3px;
           margin-left: -3px;
        }
        .rs.ctr {
            top: 50%;
            left: 50%;
            display: ${p.chosen ? "block" : "none"};
            margin-left: ${xo - 3}px;
            margin-top: ${yo - 3}px;
         }
        .tl { top: 0; left: 0; cursor: nwse-resize; }
        .t { top: 0; left: 50%; cursor: ns-resize; }
        .tr { top: 0; left: 100%; cursor: nesw-resize; }
        .l { top: 50%; left: 0; cursor: ew-resize; }
        .r { top: 50%; left: 100%; cursor: ew-resize; }
        .bl { top: 100%; left: 0; cursor: nesw-resize; }
        .b { top: 100%; left: 50%; cursor: ns-resize; }
        .br { top: 100%; left: 100%; cursor: nwse-resize; }
        `}</style>
        </div>;
}

export default Item;
