import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {template} from "./NumberSliderRow";
import EditorState, {LevelState} from "../../redux/StateType";
import {connect} from "react-redux";

const SneakValWindow: FunctionComponent<{
    show: boolean;
    onOK: (v: number) => void;
    onCancel: () => void;
    currentLevel: LevelState;
}> = (p) => {

    const [v, setV] = useState(-1);

    const row = template(-1, 500, 1, true);

    useEffect(() => {
        setV(p.currentLevel && (typeof p.currentLevel.startSneakVal === "number") ?
            p.currentLevel.startSneakVal : -1);
    }, [p.show]);

    const checkOK = () => {
        p.onOK(v);
    };

    const calcSneak = (v) => Math.round(v / (60 * 0.7) * 10) / 10;
    const calcSprint = (v) => Math.round(v / (60 * 1.4) * 10) / 10;

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Starting sneak value</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            -1 means using global default value.
            {v < 0 ? [] : [<br/>, "This value corresponds to approx. " + calcSneak(v) + " secs of sneaking or " +
            calcSprint(v) + " secs of sprinting."]}
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                {row("value", "Value", v, setV)}
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

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(SneakValWindow);
