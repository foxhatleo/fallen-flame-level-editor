import React, {FunctionComponent, useState} from "react";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import LevelModel from "models/LevelModel";
import Canvas from "./Canvas";

type TabScreenProps = {select: number; levels: Array<LevelModel>, onSelect: (v: number) => void};

const TabScreen: FunctionComponent<TabScreenProps> = (p) => {
    const iSel = "i-" + p.select;
    if (p.select >= p.levels.length && p.levels.length > 0) {
        p.onSelect(p.levels.length - 1);
    }
    return <React.Fragment>
        <Tab.Container onSelect={i => { p.onSelect(parseInt(i.substr(2))); }}
                       activeKey={iSel}
                       id="left-tabs-example" defaultActiveKey={"i-0"}>
            <Row className={"mx-0 w-100 vh-100 tab-screen"}>
                <Col sm={2} className="py-1 pr-1 pl-1">
                    <Nav variant="pills" className="flex-column">
                        {p.levels.map((c, i) => <Nav.Item key={i}>
                            <Nav.Link eventKey={"i-" + i}>
                                {c.name + (c.changed ? "*" : "")}
                            </Nav.Link>
                        </Nav.Item>)}
                    </Nav>
                </Col>
                <Col sm={10} className="h-100 pl-1">
                    <Tab.Content>
                        {p.levels.map((c, i) => <Tab.Pane eventKey={"i-" + i} key={i}>
                            <Canvas />
                        </Tab.Pane>)}
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
        <style jsx global>{`
        .tab-screen {
            padding-top: 56px;
        }
        `}</style>
    </React.Fragment>;
};

export default TabScreen;