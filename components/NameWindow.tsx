import {FunctionComponent, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";

type NameWindowProps = {show: boolean; new?: boolean; ok: (v: string) => void; no: () => void; value?: string};

const NameWindow: FunctionComponent<NameWindowProps> = (p) => {

    const [name, setName] = useState("");

    const no = () => { setName(""); p.no(); };
    const ok = () => { p.ok(name); setName(""); };

    return <Modal show={p.show} onHide={no}>
        <Modal.Header closeButton>
            <Modal.Title>{p.new ? "New level" : "Edit level name"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>Level name</Form.Label>
                    <Form.Control defaultValue={p.value} type="text" value={name} onChange={e => { setName(e.target.value); }}/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={no}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => {ok}}>
                OK
            </Button>
        </Modal.Footer>
    </Modal>;
};

export default NameWindow;
