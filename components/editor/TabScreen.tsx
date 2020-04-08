import React, {FunctionComponent} from "react";
import {Tabs} from "react-bootstrap";
import * as Actions from "../../redux/Actions";
import {connect} from "react-redux";
import LevelTab from "./LevelTab";
import {bindActionCreators} from "redux";
import EditorState, {LevelState} from "../../redux/StateType";

const TabScreen: FunctionComponent<typeof Actions & {
    current: number,
    levels: LevelState[],
}> = (p) => {
    const iSel = "i-" + p.current;
    return <div className="tabs-container">
        <Tabs id="level-tabs" variant="pills" defaultActiveKey="i-0" activeKey={iSel}
              className="p-2"
              onSelect={i => { p.editorOpenTab(Number(i.substr(2))); }}>
            {p.levels.map((c, i) => LevelTab(i, p.levels))}
        </Tabs>
        <style jsx global>{`
        .tabs-container {
            position: fixed;
            width: 100%;
            height: 100%;
            margin-top: 56px;
        }
        `}</style>
    </div>;
};

export default connect(
    (s: EditorState) => ({current: s.current, levels: s.levels}),
    d => bindActionCreators(Actions, d),
)(TabScreen);