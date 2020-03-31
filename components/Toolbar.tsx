import React from "react";
import {ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

const Toolbar: React.FunctionComponent = () => {
    function item(id: string, icon: IconProp, defaultChecked: boolean = false) {
        return <ToggleButton variant="light" type="radio" name="radio" defaultChecked={defaultChecked} value={id}>
            <FontAwesomeIcon icon={icon} />
        </ToggleButton>;
    }
    return <ToggleButtonGroup className="toolbar" type="radio" name="options" defaultValue="hand">
        {item("hand", "hand-paper", true)}
        {item("pointer", "mouse-pointer")}
        <style jsx global>{`
        .toolbar {
          position: absolute;
          top: 5px;
          left: 5px;
        }
        `}</style>
    </ToggleButtonGroup>;
};

export default Toolbar;
