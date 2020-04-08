import {FunctionComponent} from "react";
import {Button, Modal} from "react-bootstrap";

/**
 * Window warning the user when closing an unsaved level.
 */
const CloseWarnWindow: FunctionComponent<{
    show: boolean;
    onOK: () => void;
    onCancel: () => void;
}> = (p) => {

    return <Modal show={p.show} onHide={p.onCancel}>
        <Modal.Header closeButton>
            <Modal.Title>Unsaved work</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            It seems that you have not yet saved your work. If you exit now, you will lose your progress.
            <p>Levels do not save themselves automatically due to technical restriction. You must export them every
            time you make changes.</p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={p.onCancel}>
                Go back
            </Button>
            <Button variant="danger" onClick={p.onOK}>
                <b>DANGER!</b> Close anyways
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default CloseWarnWindow;
