import {Col, Form, Row} from "react-bootstrap";
import React, {ReactElement} from "react";

const guardNumber = (i, p = 1) => Number(i) || p;
const guardInt = (i, p = 1) => Math.round(guardNumber(i, p));

function numberSliderRow(id: string,
                         name: string,
                         value: number,
                         setValue: (number) => void,
                         min: number,
                         max: number,
                         step: number,
                         int: boolean): ReactElement {
    const guard = int ? guardInt : guardNumber;
    return <Form.Group controlId={id} key={id}>
        <Form.Label>{name}</Form.Label>
        <Row>
            <Col className="col-3 pr-2">
                <Form.Control required={true}
                              type="number"
                              min={min}
                              max={max}
                              step={step}
                              value={value.toString()}
                              onChange={e => { setValue(guard(e.target.value, value)); }}/>
            </Col>
            <Col className="col-9 pl-2 pt-2">
                <Form.Control type="range"
                              min={min}
                              max={max}
                              step={step}
                              value={value}
                              onChange={e => { setValue(guard(e.target.value, value)); }}/>
            </Col>
        </Row>
    </Form.Group>;
}

export default numberSliderRow;

export function template (
    min: number,
    max: number,
    step: number,
    int: boolean
): ((id: string,
     name: string,
     value: number,
     setValue: (number) => void) => ReactElement){
    return (id, name, value, setValue) =>
        numberSliderRow(id, name, value, setValue, min, max, step, int);
}
