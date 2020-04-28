import React, {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {template} from "./NumberSliderRow";
import EditorState, {BGM, LevelState} from "../../redux/StateType";
import {connect} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const BGMWindow: FunctionComponent<{
    show: boolean;
    onOK: (bgm: BGM) => void;
    onCancel: () => void;
    currentLevel: LevelState;
}> = (p) => {

    const [bgm, setBGM] = useState<BGM>(undefined);
    const [playing, setPlaying] = useState<BGM>(null);
    const [audio, setAudio] = useState<HTMLAudioElement>(null);

    useEffect(() => {
        stop();
        setBGM(p.currentLevel ? p.currentLevel.bgm : undefined);
    }, [p.show]);

    const checkOK = () => {
        p.onOK(bgm);
    };

    function checkboxChange(evt: ChangeEvent) {
        let v = (evt.target as HTMLInputElement).value;
        v = v == "none" ? undefined : v;
        setBGM(v as BGM);
    }

    function play(b: BGM, evt: MouseEvent) {
        evt.preventDefault();
        if (audio) {
            audio.pause();
        }
        const a = new Audio(`/bgm/${b}.mp3`);
        a.play();
        setPlaying(b);
        setAudio(a);
    }

    function stop() {
        if (audio) {
            audio.pause();
            setAudio(null);
        }
        setPlaying(null);
    }

    function playBtn(b: BGM) {
        if (!b) return "";
        return playing == b && audio && !audio.paused ? <a href="#" onClick={stop}><FontAwesomeIcon icon={"stop"} /></a> :
            <a href="#" onClick={play.bind(null, b)}><FontAwesomeIcon icon={"play"} /></a>;
    }

    function soundItem(b: BGM, ind: number): JSX.Element {
        return <div className="form-check" key={ind}>
            <input className="form-check-input" type="radio" name="bgm-radios" id={"bgmr" + (b ? b : "none")} value={b ? b : "none"}
                   checked={bgm == b} onChange={checkboxChange} />
                <label className="form-check-label" htmlFor={"bgmr" + (b ? b : "none")}>
                    {[playBtn(b), b ? b : "None"]}
                </label>
        </div>;
    }

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Choose background music</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={e => { e.preventDefault(); checkOK(); }}>
                {[
                    soundItem(undefined, 0),
                ...Object.values(BGM).map((i, ind) => soundItem(i, ind + 1))
                ]}
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

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}))(BGMWindow);
