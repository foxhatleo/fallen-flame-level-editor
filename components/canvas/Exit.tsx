import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Exit: FunctionComponent<typeof Actions & {
    level: LevelState;
}> = (p) => {
    function chooseExit() {
        p.editorChoose(10);
    }
    function moveExit(x, y) {
        p.moveExit([x, y]);
    }
    return (
        <Item chosen={p.level._editorInfo.chosen == 10}
              level={p.level}
              width={1.25}
              height={1.25}
              x={p.level.exitpos[0]}
              y={p.level.exitpos[1]}
              resizable={false}
              movable={true}
              onChoose={chooseExit}
              onMove={moveExit}>
            <img src={"/canvas/helicopter.png"} />
            <style jsx>{`
            img {
              width: 100%;
              height: 100%;
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Exit);
