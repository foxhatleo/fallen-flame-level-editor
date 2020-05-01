import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const FlarePickup: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const item = p.level.items[p.id];
    function chooseItem() {
        p.editorChoose(30000 + p.id);
    }
    function moveItem(x, y) {
        p.moveItem([p.id, [x, y]]);
    }
    return (
        <Item chosen={p.level._editorInfo.chosen == 30000 + p.id}
              level={p.level}
              width={20/50}
              height={42/50}
              yOffset={9}
              x={item.itemPos[0]}
              y={item.itemPos[1]}
              resizable={false}
              movable={true}
              onChoose={chooseItem}
              onMove={moveItem}>
            <img src={"/canvas/flare-pickup.png"} />
            <style jsx>{`
            img {
              width: 100%;
              height: 100%;
            }
            .type {
                user-select:none;
                position: absolute;
                color: black;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 30px;
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(FlarePickup);