import React, {FunctionComponent, useState} from "react";
import {Col, Nav, Row, Tab, Tabs} from "react-bootstrap";
import LevelModel from "models/LevelModel";
import Canvas from "./Canvas";

type TabScreenProps = {select: number; levels: Array<LevelModel>, onSelect: (v: number) => void};

const TabScreen: FunctionComponent<TabScreenProps> = (p) => {
    const iSel = "i-" + p.select;
    if (p.select >= p.levels.length && p.levels.length > 0) {
        p.onSelect(p.levels.length - 1);
    }
    return <div className="tabs-container">
        <Tabs id="level-tabs" variant="pills" defaultActiveKey="i-0" activeKey={iSel}
              className="p-2"
              onSelect={i => { p.onSelect(parseInt(i.substr(2))); }}>
            {p.levels.map((c, i) =>
            <Tab eventKey={"i-" + i} title={c.name}>
                <Canvas />
            </Tab>)}
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

export default TabScreen;