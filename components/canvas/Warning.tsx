import {FunctionComponent} from "react";
import {LevelState} from "../../redux/StateType";
import {Alert} from "react-bootstrap";
import React from "react";

const Warning: FunctionComponent<{level: LevelState}> = (p) => {
    const wrongSize = (...p) => p.every((i) => {
        const a = i / 1.28 % 1;
        return (a >= 0.99 || a <= 0.01);
    });
    const wrongPos = (...p) => p.every((i) => {
        const a = i / (1.28 / 2) % 1;
        return (a >= 0.99 || a <= 0.01);
    });
    const n = p.level.walls.reduce((pn, w, _a, _b) => {
        return pn + Number(!wrongSize(...w.size));
    }, 0);
    const n2 = p.level.walls.reduce((pn, w, _a, _b) => {
        return pn + Number(!wrongPos(...w.pos));
    }, 0);
    return n > 0 || n2 > 0 ? (<div className={"warning"}>
        <Alert variant={"danger"}>{
            (n > 0 ? `${n} walls do not comply with the size requirement (highlighted). Please resize them. ` : '') +
                (n2 > 0 ? `${n2} walls do not comply with the size requirement (highlighted). Please resize them.` : '')
        }</Alert>
        <style jsx>{`
        .warning {
          position: absolute;
          bottom: 48px;
          left: 5px;
          right: 5px;
          z-index: 100;
        }
        `}</style>
    </div>) : <></>;
};
export default Warning;