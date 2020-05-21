import React, {FunctionComponent} from "react";
import Item from "./Item";
import {LevelState, WallTexture} from "../../redux/StateType";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";

const Tree: FunctionComponent<typeof Actions & {
    level: LevelState;
    id: number;
}> = (p) => {
    const tree = p.level.trees[p.id];
    function chooseTree() {
        p.editorChoose(40000 + p.id);
    }
    function moveTree(x, y) {
        p.moveTree([p.id, [x, y]]);
    }
    return (
        <Item chosen={p.level._editorInfo.chosen == 40000 + p.id}
              level={p.level}
              width={1.28}
              height={1.28}
              x={tree.pos[0]}
              y={tree.pos[1]}
              resizable={false}
              divisible={1.28}
              movable={true}
              onChoose={chooseTree}
              onMove={moveTree}>
            <div className={"tree"} />
            <style jsx>{`
            .tree {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: URL(/canvas/trees.png);
              background-repeat: repeat;
            }
            `}</style>
        </Item>
    )
};

export default connect(null,
    d => bindActionCreators(Actions, d))(Tree);