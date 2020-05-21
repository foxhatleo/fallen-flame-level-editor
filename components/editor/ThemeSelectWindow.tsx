import React, {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import EditorState, {LevelState, Themes} from "../../redux/StateType";
import {connect} from "react-redux";
import {themeOf} from "../../redux/reducers/LevelReducer";

const BGMWindow: FunctionComponent<{
    show: boolean;
    onOK: (t: Themes, all: boolean) => void;
    onCancel: () => void;
    currentLevel: LevelState;
    newLevelMode: boolean;
}> = (p) => {

    const [theme, setTheme] = useState<Themes>(Themes.REGULAR);

    useEffect(() => {
        stop();
        setTheme(p.currentLevel && !p.newLevelMode ? themeOf(p.currentLevel) : Themes.REGULAR);
    }, [p.show]);

    const checkOK = () => {
        p.onOK(theme, true);
    };

    const checkOK2 = () => {
        p.onOK(theme, false);
    };

    function checkboxChange(evt: ChangeEvent) {
        let v = (evt.target as HTMLInputElement).value;
        setTheme(v as Themes);
    }

    function themeItem(b: Themes, ind: number): JSX.Element {
        return <div className="form-check" key={ind}>
            <input className="form-check-input" type="radio" name="theme-radios" id={"theme" + b} value={b}
                   checked={theme == b} onChange={checkboxChange} />
            <label className="form-check-label" htmlFor={"theme" + b}>{b}</label>
        </div>;
    }

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Choose theme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {p.newLevelMode ? [
                <b>It is highly recommended that you do not change theme later, as it can be troublesome.</b>
                , <br/>] : []}
            Note that wall conversion between volcano and regular is possible, but trees and walls cannot be converted
            automatically.
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                {[
                ...Object.values(Themes).map((i, ind) => themeItem(i, ind + 1))
                ]}
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={p.onCancel}>
                Cancel
            </Button>
            {
                p.newLevelMode ?
                    [
                        <Button variant="primary" onClick={checkOK}>
                            OK
                        </Button>
                    ] :
                    [
                    <Button variant="secondary" onClick={checkOK2}>
                        Change floor texture only
                    </Button>
                    ,
                    <Button variant="primary" onClick={checkOK}>
                        Change theme (including all walls)
                    </Button>
                    ]
            }
        </Modal.Footer>
    </Modal>;
};

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(BGMWindow);
