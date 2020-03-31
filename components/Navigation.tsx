import React, {FunctionComponent} from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";

type NavigationProps = {
    onNew: () => void;
    onImport: () => void;
    onExport: () => void;
    onClose: () => void;
    onLevelBound: () => void;
    currentlySelecting: boolean;
};

const Navigation: FunctionComponent<NavigationProps> = (p) => {
    return <React.Fragment>
        <Navbar fixed="top" className="mb-2" bg="light" variant="light">
            <Nav className="mr-auto">
                <NavDropdown title="File" id={"file-nav"}>
                    <NavDropdown.Item onClick={p.onNew}>New empty level</NavDropdown.Item>
                    <NavDropdown.Item onClick={p.onImport}>Import level</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentlySelecting}
                                      onClick={p.onExport}>Export level</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentlySelecting}
                                      onClick={p.onClose}>Close level</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Setting" id={"setting-nav"}>
                    <NavDropdown.Item disabled={!p.currentlySelecting}
                                      onClick={p.onLevelBound}>Level bound</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar>
    </React.Fragment>;
};

export default Navigation;