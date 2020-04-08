import React, {FunctionComponent} from "react";
import {LevelState} from "../../redux/StateType";

const Grid: FunctionComponent<{
    level: LevelState
}> = (p) => {
    const l = p.level;
    const xs = l.graphicSize[0] / l.physicsSize[0];
    const ys = l.graphicSize[1] / l.physicsSize[1];
    return <table>
        {[...Array(Math.ceil(l.physicsSize[1]))].map(_ => <tr className={"o"}>
            {[...Array(Math.ceil(l.physicsSize[0]))].map(_ => <td className={"i"} />)}
        </tr>)}
        <style jsx>{`
        .i {
            width: ${xs}px;
            border: 1px solid rgba(0,0,0,.2);
        }
        .o {
            height: ${ys}px;
        }
        .i:last-child {
            width: ${xs * (l.physicsSize[1] % 1 || 1)};
        }
        .o:last-child {
            height: ${ys * (l.physicsSize[0] % 1 || 1)};
        }
        `}</style>
    </table>;
};

export default Grid;