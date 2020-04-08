import React, {useState} from "react";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as Actions from "../../redux/Actions";
import {LevelState} from "../../redux/StateType";

const Toolbar: React.FunctionComponent<typeof Actions & {
    level: LevelState;
}> = (p) => {
    function item(id: string, icon: IconProp, defaultChecked: boolean = false) {
        return <ToggleButton variant="light" type="radio" name="radio" defaultChecked={defaultChecked} value={id}>
            <FontAwesomeIcon icon={icon} />
        </ToggleButton>;
    }

    return <ToggleButtonGroup value={p.level._editorInfo.tool}
                              onChange={p.editorChangeTool} className="toolbar" type="radio" name="options" defaultValue="hand">
        {item("hand", "hand-paper", true)}
        {item("pointer", "mouse-pointer")}
        <style jsx global>{`
        .toolbar {
          position: absolute;
          top: 5px;
          left: 5px;
          z-index: 100;
        }
        `}</style>
    </ToggleButtonGroup>;
};

export default connect(null, d => bindActionCreators(Actions, d))(Toolbar);
