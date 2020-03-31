import {FormEvent, FunctionComponent, useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import LevelModel from "models/LevelModel";
import JSONReader from "utils/JSONReader";

enum Error {
    NO_ERROR,
    LOAD_ERROR,
    JSON_PARSE_ERROR,
    LEVEL_ERROR,
};

const ImportWindow: FunctionComponent<{
    show: boolean;
    onOK: (v: LevelModel) => void;
    onCancel: () => void;
}> = (p) => {

    const [error, setError] = useState<Error>(Error.NO_ERROR);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setError(Error.NO_ERROR);
        setDisabled(false);
    }, [p.show]);

    let levelModel: LevelModel = null;

    const checkOK = () => {
        if (levelModel) p.onOK(levelModel);
    };
    const checkCancel = () => {
        if (!disabled) p.onCancel();
    };

    const fileChanged = async (e: FormEvent) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length == 0) {
            return;
        }
        setDisabled(true);
        new JSONReader(files[0]).load().then(i => {
            levelModel = LevelModel.fromRep(i, files[0].name);
            if (levelModel) {
                levelModel.setLastFilename(files[0].name);
                checkOK();
            } else {
                setError(Error.LEVEL_ERROR);
                setDisabled(false);
            }
        }).catch((fromJSON) => {
            debugger;
            setError(fromJSON ? Error.JSON_PARSE_ERROR : Error.LOAD_ERROR);
            setDisabled(false);
        });
    };

    return <Modal show={p.show} onHide={checkCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Import level JSON</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {error ? <Alert variant="danger">
                {(() => {
                    switch(error) {
                        case Error.LOAD_ERROR:
                            return "Cannot load this file.";
                        case Error.LEVEL_ERROR:
                            return "This file does not seem to be a valid level JSON.";
                        case Error.JSON_PARSE_ERROR:
                            return "Cannot parse this JSON file.";
                        default:
                            return "";
                    }
                })()}
            </Alert> : ""}
            <Form onSubmit={e => { e.preventDefault(); }}>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Control disabled={disabled}
                                  required={true}
                                  accept=".json"
                                  type="file"
                                  onChange={fileChanged}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button disabled={disabled} variant="secondary" onClick={checkCancel}>
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default ImportWindow;