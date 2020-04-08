import React, {FunctionComponent} from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {connect} from "react-redux";
import EditorState, {LevelState} from "../../redux/StateType";

/**
 * The top navbar.
 */
const Navigation: FunctionComponent<{
    onNew: () => void;
    onImport: () => void;
    onExport: () => void;
    onClose: () => void;
    onLevelBound: () => void;
    onLevelName: () => void;
    onLevelAdvanced: () => void;
    currentLevel: LevelState;
}> = (p) => {
    return <React.Fragment>
        <Navbar fixed="top" className="mb-2" bg="dark" variant="dark">
            <Nav className="mr-auto">
                <NavDropdown title="File" id={"file-nav"}>
                    <NavDropdown.Item onClick={p.onNew}>New empty level</NavDropdown.Item>
                    <NavDropdown.Item onClick={p.onImport}>Import level</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onExport}>Export level</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onClose}>Close level</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Setting" id={"setting-nav"}>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onLevelName}>Level name</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onLevelBound}>Level bound</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onLevelAdvanced}>Advanced</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
    </React.Fragment>;
};

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}), null)(Navigation);