import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Enemy: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const enemy = p.level.enemies[p.id];
    const t = enemy.enemytype.substr(4);
    let texture = "/canvas/enemy-walking.png";
    switch (t) {
        case "B":
            texture = "/canvas/enemyb-walking.png";
            break;
    }
    function chooseEnemy() {
        p.editorChoose(20000 + p.id);
    }
    function moveEnemy(x, y) {
        p.moveEnemy([p.id, [x, y]]);
    }
    return (
        <Item chosen={p.level._editorInfo.chosen == 20000 + p.id}
              level={p.level}
              width={1.3}
              height={1.3}
              x={enemy.enemypos[0]}
              y={enemy.enemypos[1]}
              resizable={false}
              movable={true}
              onChoose={chooseEnemy}
              onMove={moveEnemy}>
            <img src={texture} />
            <div className={"type"}>{t}</div>
            <style jsx>{`
            img {
              width: 100%;
              height: 100%;
            }
            .type {
                user-select:none;
                position: absolute;
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
    d => bindActionCreators(Actions, d))(Enemy);