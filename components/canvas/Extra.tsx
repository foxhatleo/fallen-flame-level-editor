import React, {FunctionComponent} from "react";
import Item from "./Item";
import {BackgroundTexture, ExtraInfo, ExtraType, LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Extra: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const e : ExtraInfo = p.level.extras[p.id];
    function chooseExtra() {
        if (!p.level._editorInfo.backgroundEdit) return;
        p.editorChoose(50000 + p.id);
    }
    function moveExtra(x, y) {
        p.moveExtra([p.id, [x, y]]);
    }
    let pf, v, w, h;
    v = e.extraType;
    switch(e.extraType) {
        case ExtraType.HORIZONTAL:
            w = 310 / 50;
            h = 42 / 50;
            break;
        case ExtraType.PATCH:
            w = 308 / 50;
            h = 291 / 50;
            break;
        case ExtraType.VERTICAL:
            w = 63 / 50;
            h = 265 / 50;
            break;
        case ExtraType.SQUARE:
            w = 106 / 50;
            h = 32 / 50;
            break;
    }
    switch(p.level.background.texture) {
        case BackgroundTexture.FLOOR_TILE:
            pf = "c";
            break;
        case BackgroundTexture.FOREST_TILE:
            pf = "f";
            break;
        case BackgroundTexture.VOLCANO_TILE:
            pf = "v";
            break;
    }
    const x = e.extraPos[0], y = e.extraPos[1];
    return (
        <Item chosen={p.level._editorInfo.chosen == 50000 + p.id}
              level={p.level}
              width={w}
              height={h}
              x={x}
              y={y}
              resizable={false}
              movable={true}
              onChoose={chooseExtra}
              onMove={moveExtra}
              neverHide={true}>
            <img src={`/canvas/bg/${pf}-${v}.png`} />
            <style jsx>{`
            img {
              width: 100%;
              position: absolute;
              height: 100%;
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Extra);
