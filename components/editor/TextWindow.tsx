import React, {FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import EditorState, {LevelState} from "../../redux/StateType";
import {connect} from "react-redux";

const TextWindow: FunctionComponent<{
    show: boolean;
    onOK: (v: string) => void;
    onCancel: () => void;
    currentLevel: LevelState;
    newText: boolean;
}> = (p) => {

    const [value, setValue] = useState<string>("");

    const filter = (i:string): string => i.replace("\n", "").replace("\t", "").replace("\r", "");

    useEffect(() => {
        if (!p.currentLevel || p.newText) {
            setValue("");
            return;
        }
        setValue(p.currentLevel._editorInfo.chosen >= 100000 ? p.currentLevel.texts[p.currentLevel._editorInfo.chosen - 100000].text : "");
    }, [p.show]);

    const emptyValue = !value || value.trim() === "";
    const checkOK = () => {
        if (!emptyValue) p.onOK(value);
    };

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{p.newText ? "New text" : "Edit text"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Text</Form.Label>
                    <Form.Control as="textarea"
                                  required={true}
                                  value={value}
                                  onChange={e => { setValue(filter((e.target as any).value)); }}/>
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

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(TextWindow);
