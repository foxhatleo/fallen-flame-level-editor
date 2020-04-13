import {FormEvent, FunctionComponent, useEffect, useState} from "react";
import {Alert, Button, Form, Modal} from "react-bootstrap";
import {load} from "utils/JSON";
import {LevelState} from "../../redux/StateType";
import {decode, ImportedLevel} from "../../redux/LevelJSON";

enum Error {
    NO_ERROR,
    LOAD_ERROR,
    JSON_PARSE_ERROR,
    LEVEL_ERROR,
}

const ImportWindow: FunctionComponent<{
    show: boolean;
    onOK: (v: any) => void;
    onCancel: () => void;
}> = (p) => {

    const [error, setError] = useState<Error>(Error.NO_ERROR);
    const [errorMSG, setErrorMSG] = useState<string[]>(["Not available."]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        setError(Error.NO_ERROR);
        setDisabled(false);
        setErrorMSG(["Not available."]);
    }, [p.show]);

    let levelModel: ImportedLevel = null;

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
        load(files[0]).then(i => {
            levelModel = decode(i);
            if (levelModel.level) {
                levelModel.level.name = levelModel.level.name ||
                    files[0].name.replace(new RegExp("\.json$", "gi"), "");
                checkOK();
            } else {
                setError(Error.LEVEL_ERROR);
                setErrorMSG(levelModel.msg);
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
                            return [
                                "This file does not seem to be a valid level JSON. Detail info:" +
                                    errorMSG.join("; ")
                            ];
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
