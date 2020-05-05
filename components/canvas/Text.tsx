import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Text: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const text = p.level.texts[p.id];
    function chooseText() {
        p.editorChoose(100000 + p.id);
    }
    function moveText(x, y) {
        p.moveText([p.id, [x, y]])
    }
    function resizeText(x, y) {
        p.resizeText([p.id, [x, y]])
    }
    return (
        <Item chosen={p.level._editorInfo.chosen == 100000 + p.id}
              level={p.level}
              width={text.size[0]}
              height={text.size[1]}
              x={text.pos[0]}
              y={text.pos[1]}
              resizable={true}
              movable={true}
              onChoose={chooseText}
              onMove={moveText}
              onResize={resizeText}
              textMode={true}>
            <div className={"text"} >
                <span>{text.text}</span>
            </div>
            <style jsx>{`
            .text {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(233, 212, 96, ${p.level._editorInfo.tool == "text" ? .5 :.15});
              border: 1px solid rgba(233, 212, 96, ${p.level._editorInfo.tool == "text" ? 1 :.5});
              overflow: hidden;
            }
            span {
              color: white;
              display: ${p.level._editorInfo.tool == "text" ? "unset" : "none"};
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Text);