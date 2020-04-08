import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {template} from "./NumberSliderRow";
import EditorState, {LevelState} from "../../redux/StateType";
import {connect} from "react-redux";

const BoundWindow: FunctionComponent<{
    show: boolean;
    newLevelMode?: boolean;
    onOK: (x: number, y: number) => void;
    onCancel: () => void;
    currentLevel: LevelState;
}> = (p) => {

    const [x, setX] = useState(1);
    const [y, setY] = useState(1);

    const boundRow = template(1, 60, .1, false);

    useEffect(() => {
        setX(!p.newLevelMode && p.currentLevel ? p.currentLevel.physicsSize[0] : 16);
        setY(!p.newLevelMode && p.currentLevel ? p.currentLevel.physicsSize[1] : 12);
    }, [p.show]);

    const checkOK = () => {
        p.onOK(x, y);
    };

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{p.newLevelMode ? "New level bound" : "Edit level bound"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                {boundRow("x", "Width", x, setX)}
                {boundRow("y", "Height", y, setY)}
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={p.onCancel}>
                Cancel
            </Button>
            <Button variant="primary" onClick={checkOK}>
                OK
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(BoundWindow);
