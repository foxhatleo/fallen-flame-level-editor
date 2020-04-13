import {FunctionComponent} from "react";
import {Button, Modal} from "react-bootstrap";

/**
 * Window warning the user when closing an unsaved level.
 */
const ImportWarnWindow: FunctionComponent<{
    show: boolean;
    onOK: () => void;
    onCancel: () => void;
    messages: string[];
}> = (p) => {

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Import Warning</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            There are some part of this JSON that does not follow the level JSON standard that is implemented in this
            editor. You may continue to import but some parts of the level may get lost or changed. Detailed info:
            <ul>
                {p.messages.map((i) => <li>{i}</li>)}
            </ul>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={p.onCancel}>
                Do not import
            </Button>
            <Button variant="primary" onClick={p.onOK}>
                Import
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default ImportWarnWindow;
