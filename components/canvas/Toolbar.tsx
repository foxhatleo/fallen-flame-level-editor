import React, {useState} from "react";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {EnemyInfo, LevelState, WallInfo} from "../../redux/StateType";

const Toolbar: React.FunctionComponent<typeof Actions & {
    level: LevelState;
}> = (p) => {
    let enemy: EnemyInfo = null;
    let wall: WallInfo = null;
    let id = -1;
    if (p.level._editorInfo.chosen >= 20000 && p.level._editorInfo.chosen < 30000) {
        id = p.level._editorInfo.chosen - 20000;
        enemy = p.level.enemies[id];
    } else if (p.level._editorInfo.chosen >= 10000 && p.level._editorInfo.chosen < 20000) {
        id = p.level._editorInfo.chosen - 10000;
        wall = p.level.walls[id];
    }
    const enet = enemy ? enemy.enemytype.substr(4) : "A";
    const wallt = wall ? wall.texture : "";
    debugger;

    function item(id: string, icon: IconProp, shortcut: string, defaultChecked: boolean = false) {
        return <ToggleButton variant="light" type="radio" name="radio" defaultChecked={defaultChecked} value={id}>
            <FontAwesomeIcon icon={icon} />
            ({shortcut})
        </ToggleButton>;
    }
    function simpleItem(id: string, friendly: string, defaultChecked: boolean = false) {
        return <ToggleButton variant="light" type="radio" name="radio" defaultChecked={defaultChecked} value={id}>
            {friendly}
        </ToggleButton>;
    }
    function chooseEnemyType(tp: string) {
        p.changeEnemyType([id, "type" + tp]);
    }
    function chooseWallType(tp: string) {
        p.changeWallTexture([id, tp]);
    }

    return <div className="toolbar">
        <ToggleButtonGroup value={p.level._editorInfo.tool}
                              onChange={p.editorChangeTool} type="radio" name="options" defaultValue="hand">
        {item("hand", "hand-paper", "A", true)}
        {item("pointer", "mouse-pointer", "S")}
    </ToggleButtonGroup>
        <ToggleButtonGroup onChange={chooseEnemyType} className={"ml-1" + (!enemy ? " toolbar-hide" : "")} value={enet} type="radio" name="options" defaultValue={"A"}>
            {simpleItem("A", "Regular (A)", true)}
            {simpleItem("B", "Shooting (B)")}
        </ToggleButtonGroup>
        <ToggleButtonGroup onChange={chooseWallType} className={"ml-1" + (!wall ? " toolbar-hide" : "")} value={wallt} type="radio" name="options" defaultValue={"wall-side-side"}>
            {simpleItem("wall-side", "Wall Side", true)}
            {simpleItem("wall-top", "Wall Top")}
        </ToggleButtonGroup>
        <style jsx global>{`
        .toolbar {
          position: absolute;
          top: 5px;
          left: 5px;
          z-index: 100;
        }
        .toolbar-hide {
        display: none;
        }
        `}</style>
    </div>;
};

export default connect(null, d => bindActionCreators(Actions, d))(Toolbar);
