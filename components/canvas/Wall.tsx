import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Wall: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const wall = p.level.walls[p.id];
    let textureImage = "wall-side";
    switch (wall.texture) {
        case "wall-side":
            textureImage = "wall-side";
            break;
        case "wall-top":
            textureImage = "wall-top";
            break;
    }
    function chooseWall() {
        p.editorChoose(10000 + p.id);
    }
    function moveWall(x, y) {
        p.moveWall([p.id, [x, y]])
    }
    function resizeWall(x, y) {
        p.resizeWall([p.id, [x, y]])
    }
    const wrongSize = (...p) => p.every((i) => {
        const a = i / 1.28 % 1;
        return (a >= 0.99 || a <= 0.01);
    });
    const wrongPos = (...p) => p.every((i) => {
        const a = i / (1.28 / 2) % 1;
        return (a >= 0.99 || a <= 0.01);
    });
    return (
        <Item chosen={p.level._editorInfo.chosen == 10000 + p.id}
              level={p.level}
              width={wall.size[0]}
              height={wall.size[1]}
              x={wall.pos[0]}
              y={wall.pos[1]}
              divisible={1.28}
              resizable={true}
              movable={true}
              onChoose={chooseWall}
              onMove={moveWall}
              onResize={resizeWall}>
            <div className={"wall"} />
            <div className={"warning"} style={wrongSize(...wall.size) || wrongPos(...wall.pos) ? {display: "none"} : {}} />
            <style jsx>{`
            .wall {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: URL(/canvas/${textureImage}.png);
              background-repeat: repeat;
            }
            .warning {
              top: 0;
              right: 0;
              bottom: 0;
              left: 0;
              position: absolute;
              border: 3px solid red;
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Wall);