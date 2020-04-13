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
    return (
        <Item chosen={p.level._editorInfo.chosen == 10000 + p.id}
              level={p.level}
              width={wall.size[0]}
              height={wall.size[1]}
              x={wall.pos[0]}
              y={wall.pos[1]}
              resizable={true}
              movable={true}
              onChoose={chooseWall}
              onMove={moveWall}
              onResize={resizeWall}>
            <div className={"wall"} />
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
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Wall);