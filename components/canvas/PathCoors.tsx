import React, {FunctionComponent, RefObject} from "react";
import * as Actions from "../../redux/Actions";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {guardRange} from "../../redux/Validators";

function pair<T>(a: T[]): [T, T][] {
    if (a.length < 2) return [];
    const r = [];
    for (let i = 0, j = a.length - 1; i < j; i++){
        r.push([a[i], a[i + 1]]);
    }
    r.push([a[a.length - 1], a[0]]);
    return r;
}

const v = i => i * 50;

const PathCoors: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const enemy = p.level.enemies[p.id];
    if (enemy.subtype !== "pathing") return <></>;
    const y = i => v(p.level.physicsSize[1] - i);
    const outMode = p.level._editorInfo.tool !== "path" && p.level._editorInfo.chosen !== 20000 + p.id;
    const editMode = p.level._editorInfo.tool === "path";
    const pc = [enemy.enemypos, ...enemy.pathCoors];
    const pcp = pair(pc);
    const lineRefs: RefObject<SVGLineElement>[] = [...Array(pcp.length)].map(i => React.createRef());

    function mouseDown(id, e) {
        if (!editMode) return;
        e.stopPropagation();
        e.preventDefault();
        document.onmousemove = eleDrag.bind(this, id, e.clientX, e.clientY, pc[id][0], pc[id][1], enemy.pathCoors);
        document.onmouseup = closeDrag;
    }

    function lineMouseDown(id, e) {
        if (!editMode) return;
        e.stopPropagation();
        e.preventDefault();
        const newCoors = enemy.pathCoors.concat();
        if (!lineRefs[id].current) return;
        const newX = Math.min(pcp[id][0][0], pcp[id][1][0]) + (e.clientX - lineRefs[id].current.getBoundingClientRect().x) / 50;
        const newY = Math.min(pcp[id][0][1], pcp[id][1][1]) + (e.clientY - lineRefs[id].current.getBoundingClientRect().y) / 50;
        newCoors.splice(id, 0, [newX, newY]);
        p.updatePathCoors([p.id, newCoors]);
        document.onmousemove = eleDrag.bind(this, id + 1, e.clientX, e.clientY, newX, newY, newCoors);
        document.onmouseup = closeDrag;
    }

    function closeDrag() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function eleDrag(id, cx, cy, px, py, pc, e) {
        e.preventDefault();
        let newX: number, newY: number;
        const vx = p.level.physicsSize[0], vy = p.level.physicsSize[1];
        newX = guardRange(px + (e.clientX - cx) / 50, 0, vx);
        newY = guardRange(py - (e.clientY - cy) / 50, 0, vy);
        const newCoors = pc;
        newCoors[id - 1] = [newX, newY];
        if (id == 0) {
            p.moveEnemy([p.id, [newX, newY], true]);
        } else {
            p.updatePathCoors([p.id, newCoors]);
        }
    }

    function deleteNode(i) {
        if (i <= 1) return;
        const newCoors = enemy.pathCoors.concat();
        newCoors.splice(i - 1, 1);
        p.updatePathCoors([p.id, newCoors]);
    }

    return <svg height="3000" width="3000" style={{position: "absolute", top: 0, left: 0, marginLeft: 3000, marginTop: 3000}}>
        {pcp.map(([[x1, y1], [x2, y2]], i) => {
            return <line ref={lineRefs[i]} key={1000 + i} x1={v(x1)} y1={y(y1)} x2={v(x2)} y2={y(y2)} className={"l1"} />;
        })}
        {pcp.map(([[x1, y1], [x2, y2]], i) => {
            return <line onMouseDown={(e) => lineMouseDown(i, e)} key={2000 + i} x1={v(x1)} y1={y(y1)} x2={v(x2)} y2={y(y2)} className={"l2"} />;
        })}
        {pc.map(([x, y_], i) => {
            return <>
                <rect key={3000 + i} onDoubleClick={() => deleteNode(i)} x={v(x)} y={y(y_)} width="10" height="10" className={"node"} />
                <text x={v(x) - 5} y={y(y_) + 5} fill="black">{i}</text>
            </>;
        })}
        {pc.map(([x, y_], i) => {
            return <rect key={4000 + i} onMouseDown={(e) => mouseDown(i, e)} onDoubleClick={() => deleteNode(i)} x={v(x)} y={y(y_)} width="20" height="20" className={"node2"} />;
        })}
        <style jsx>{`
        svg {
          z-index: ${outMode ? 1 : 8};
          opacity: ${outMode ? 0.5 : 1};
          pointer-events: none;
        }
        text {
        font-weight: 800;
          paint-order: stroke;
            stroke: red;
            stroke-width: 3px;
            stroke-linecap: butt;
            stroke-linejoin: miter;
        }
        .l1 {
          stroke: rgba(255,0,0, 1);
          stroke-width: 3px;
        }
        .l2 {
          cursor: copy;
          stroke: rgba(255,0,0, .01);
          stroke-width: 12px;
          pointer-events: ${editMode ? "auto" : "none"};
        }
        .node {
          fill: white;
          stroke: rgba(255,0,0, 1);
          stroke-width: 3px;
          transform: translate(-5px, -5px);
          pointer-events: ${editMode ? "auto" : "none"};
        }
        .node2 {
          fill: rgba(255,255,255,.01);
          stroke: rgba(255,0,0,,.01);
          transform: translate(-10px, -10px);
          pointer-events: ${editMode ? "auto" : "none"};
        }
        `}</style>
    </svg>;
};

export default connect(null,
    d => bindActionCreators(Actions, d))(PathCoors);
