import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import EditorState, {LevelState} from "../../redux/StateType";
import {connect} from "react-redux";

const NameWindow: FunctionComponent<{
    show: boolean;
    newLevelMode?: boolean;
    onOK: (v: string) => void;
    onCancel: () => void;
    currentLevel: LevelState;
}> = (p) => {

    const [value, setValue] = useState("");

    useEffect(() => {
        setValue(!p.newLevelMode && p.currentLevel ? p.currentLevel.name : "");
    }, [p.show]);

    const emptyValue = !value || value.trim() === "";
    const checkOK = () => {
        if (!emptyValue) p.onOK(value);
    };

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{p.newLevelMode ? "New level name" : "Edit level name"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Level name</Form.Label>
                    <Form.Control required={true}
                                  type="text"
                                  value={value}
                                  onChange={e => { setValue(e.target.value); }}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={p.onCancel}>
                Cancel
            </Button>
            <Button disabled={emptyValue} variant="primary" onClick={checkOK}>
                OK
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(NameWindow);
