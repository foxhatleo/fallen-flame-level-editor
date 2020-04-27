import React, {FunctionComponent} from "react";
import {LevelState} from "../../redux/StateType";

const Grid: FunctionComponent<{
    level: LevelState
}> = (p) => {
    const l = p.level;
    const xs = 50;//l.graphicSize[0] / l.physicsSize[0];
    const ys = 50;//l.graphicSize[1] / l.physicsSize[1];
    let textureImage = null;
    switch(p.level.background.texture) {
        case "floor-tile":
            textureImage = "floor-tile";
    }
    return <table>
        <tbody>
        {[...Array(Math.ceil(l.physicsSize[1]))].map((_, i) => <tr key={i} className={"o"}>
            {[...Array(Math.ceil(l.physicsSize[0]))].map((_, i) => <td key={i} className={"i"} />)}
        </tr>)}
        </tbody>
        <style jsx>{`
        table {
            background: ${textureImage ? `URL(/canvas/${textureImage}.png)` : "none"};
            background-repeat: repeat;
        }
        .i {
            width: ${xs}px;
            border: 1px solid rgba(0,0,0,.2);
        }
        .o {
            height: ${ys}px;
        }
        .i:last-child {
            width: ${Math.round(xs * (l.physicsSize[0] % 1 || 1))}px;
        }
        .o:last-child {
            height: ${Math.round(ys * (l.physicsSize[1] % 1 || 1))}px;
        }
        `}</style>
    </table>;
};

export default Grid;