import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Player: FunctionComponent<typeof Actions & {
    level: LevelState;
}> = (p) => {
    function choosePlayer() {
        p.editorChoose(1);
    }
    function movePlayer(x, y) {
        p.movePlayer([x, y])
    }
    return (
        <Item chosen={p.level._editorInfo.chosen == 1}
              level={p.level}
              width={1.14}
              height={1.14}
              xOffset={0}//4}
              yOffset={20}
              x={p.level.playerpos[0]}
              y={p.level.playerpos[1]}
              resizable={false}
              movable={true}
              onChoose={choosePlayer}
              onMove={movePlayer}>
            <img src={"/canvas/new-player.png"} />
            <style jsx>{`
            img {
            width :100%;
            height: 100%;
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Player);
