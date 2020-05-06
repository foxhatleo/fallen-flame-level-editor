import React, {ChangeEvent, FunctionComponent, useEffect, useRef, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
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
    const [s, setS] = useState<number>(0);
    const [e, setE] = useState<number>(0);
    const textInput = useRef(null);

    const filter = (i:string): string => i.replace("\n", "").replace("\t", "").replace("\r", "");

    useEffect(() => {
        if (!p.currentLevel || p.newText) {
            setValue("");
            return;
        }
        setValue(p.currentLevel._editorInfo.chosen >= 100000 ? p.currentLevel.texts[p.currentLevel._editorInfo.chosen - 100000].text : "");
    }, [p.show]);

    useEffect(() => {
        if (!textInput.current) return;
        textInput.current.selectionStart = s;
        textInput.current.selectionEnd = e;
    }, [s, e]);

    const emptyValue = !value || value.trim() === "";
    const checkOK = () => {
        if (!emptyValue) p.onOK(value);
    };

    const links = [
        "left",
        "up",
        "down",
        "right",
        "left",
        "reset",
        "sneak",
        "sprint",
        "incLightrad",
        "decLightrad",
    ];

    function toLink(l: string) {
        if (textInput.current) {
            const target = textInput.current as HTMLTextAreaElement;
            const s = target.selectionStart, e = target.selectionEnd;
            const newText = value.substring(0, s) + "{" + l + "}" + value.substr(e);
            setValue(newText);
            target.focus();
            const newS = e + l.length + 2;
            setS(newS);
            setE(newS);
        } else {
            setValue(value + l);
        }
    }

    function onChange(e) {
        setValue(filter((e.target as any).value));
        setS((e.target as HTMLTextAreaElement).selectionStart);
        setE((e.target as HTMLTextAreaElement).selectionEnd);
    }

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>{p.newText ? "New text" : "Edit text"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert variant={"warning"}>Because keys can be rebound, do not include actual keys. Instead, use these:
                <br />
                {links.map((i, ind) => <a className={"a"} onClick={() => toLink(i)} key={ind}>{"{"+i+"}"}</a>)}
            </Alert>
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Text</Form.Label>
                    <Form.Control as="textarea"
                                  ref={textInput}
                                  required={true}
                                  value={value}
                                  onChange={onChange}/>
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
        <style jsx>{`
        .a {
          text-decoration: underline !important;
          cursor: pointer !important;
        }
        `}</style>
    </Modal>;
};

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(TextWindow);
