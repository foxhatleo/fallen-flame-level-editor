import React, {FunctionComponent} from "react";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import LevelModel from "models/LevelEditor";

type TabScreenProps = {levels: Array<LevelModel>, onSelect: (v: number) => void};

const TabScreen: FunctionComponent<TabScreenProps> = (p) => {
    return <React.Fragment>
        <Tab.Container onSelect={i => { p.onSelect(parseInt(i.substr(2))); }}
                       id="left-tabs-example" defaultActiveKey={"i-0"}>
            <Row className={"pl-2 vh-100 tab-screen"}>
                <Col sm={2} className="py-2 pr-1">
                    <Nav variant="pills" className="flex-column">
                        {p.levels.map((c, i) => <Nav.Item key={i}>
                            <Nav.Link eventKey={"i-" + i}>
                                {c.name}
                            </Nav.Link>
                        </Nav.Item>)}
                    </Nav>
                </Col>
                <Col sm={10} className="h-100 pl-1">
                    <Tab.Content>
                        {p.levels.map((c, i) => <Tab.Pane eventKey={"i-" + i} key={i}>
                            ASD
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