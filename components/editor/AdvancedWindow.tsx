import React, {FunctionComponent, useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {template} from "./NumberSliderRow";
import EditorState, {LevelState} from "../../redux/StateType";
import {connect} from "react-redux";

export type AdvancedResult = {
    fpsLower: number;
    fpsUpper: number;
    graphicsX: number;
    graphicsY: number;
};

const AdvancedWindow: FunctionComponent<{
    show: boolean;
    onOK: (result: AdvancedResult) => void;
    onCancel: () => void;
    currentLevel: LevelState;
}> = (p) => {

    const [gx, setGX] = useState(1);
    const [gy, setGY] = useState(1);
    const [fu, _setFU] = useState(1);
    const [fl, _setFL] = useState(1);

    const setFL = i => { _setFL(i); setFU(fu, i); };
    const setFU = (i, l = fl) => { _setFU(Math.max(l + 1, i)); };

    const graphicsRow = template(400, 2880, 10, true);
    const fpsRow = template(15, 120, 1, true);

    useEffect(() => {
        setGX(p.currentLevel ? p.currentLevel.graphicSize[0] : 0);
        setGY(p.currentLevel ? p.currentLevel.graphicSize[1] : 0);
        _setFU(p.currentLevel ? p.currentLevel.fpsRange[1] : 0);
        _setFL(p.currentLevel ? p.currentLevel.fpsRange[0] : 0);
    }, [p.show]);

    const checkOK = () => {
        p.onOK({
            fpsLower: fl, fpsUpper: fu, graphicsX: gx, graphicsY: gy
        });
    };

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Advanced Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert variant="warning">
                Only change things here if you know what you are doing!
            </Alert>
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                {graphicsRow("gx", "Graphics Width", gx, setGX)}
                {graphicsRow("gy", "Graphics Height", gy, setGY)}
                {fpsRow("fl", "FPS Lower", fl, setFL)}
                {fpsRow("fu", "FPS Upper", fu, setFU)}
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

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(AdvancedWindow);
