import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {template} from "./NumberSliderRow";
import EditorState, {LevelState} from "../../redux/StateType";
import {connect} from "react-redux";

const FlareCountWindow: FunctionComponent<{
    show: boolean;
    onOK: (s: number, m: number) => void;
    onCancel: () => void;
    currentLevel: LevelState;
}> = (p) => {

    const [s, setS] = useState(-1);
    const [m, setM] = useState(-1);

    const row = template(-1, 100, 1, true);

    useEffect(() => {
        setS(p.currentLevel && (typeof p.currentLevel.startFlareCount === "number") ?
            p.currentLevel.startFlareCount : -1);
        setM(p.currentLevel && (typeof p.currentLevel.maxFlareCount === "number") ?
            p.currentLevel.maxFlareCount : -1);
    }, [p.show]);

    const checkOK = () => {
        p.onOK(s, m);
    };

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Flare Count</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            -1 means using global default value. (Not recommended)
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                {row("flare-start", "Start Flare Count", s, setS, s < 0)}
                {row("flare-max", "Max Flare Count", m, setM, m < 0)}
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

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(FlareCountWindow);
