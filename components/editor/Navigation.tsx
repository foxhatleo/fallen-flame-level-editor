import React, {FunctionComponent} from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import {connect} from "react-redux";
import EditorState, {LevelState} from "../../redux/StateType";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

/**
 * The top navbar.
 */
const Navigation: FunctionComponent<{
    onNew: () => void;
    onImport: () => void;
    onExport: () => void;
    onClose: () => void;
    onLevelBound: () => void;
    onSneakVal: () => void;
    onLevelName: () => void;
    onLevelAdvanced: () => void;
    onAddEnemy: () => void;
    onAddWall: () => void;
    onAddTree: () => void;
    onBGM: () => void;
    onRemove: () => void;
    onFlareCount: () => void;
    onAddFlare: () => void;
    onBG: (string) => void;
    onAddText: () => void;
    onEditText: () => void;
    onTheme: () => void;
    currentLevel: LevelState;
}> = (p) => {
    const w = <span style={{color: "#FF4500"}}><FontAwesomeIcon icon={'exclamation-triangle'} /></span>;
    const c1 = p.currentLevel && !p.currentLevel.bgm;
    const c2 = p.currentLevel && (typeof p.currentLevel.startFlareCount !== "number" ||
        typeof p.currentLevel.maxFlareCount === "number");
    const wn1 = c1 || c2 ? w : "";
    const wn2 = c1 ? w : "";
    const wn3 = c2 ? w : "";
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
                <NavDropdown title="Edit" id={"add-nav"}>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onAddWall}>Add wall (Z)</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onAddEnemy}>Add enemy (X)</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onAddFlare}>Add flare pickup (C)</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onAddText}>Add text (V)</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onAddTree}>Add tree (B)</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel || p.currentLevel._editorInfo.chosen < 100000}
                                      onClick={p.onEditText}>Edit selected text (L)</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item disabled={!p.currentLevel || p.currentLevel._editorInfo.chosen < 10000}
                                      onClick={p.onRemove}>Remove selected... (D)</NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title={["Setting",wn1]} id={"setting-nav"}>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onLevelName}>Level name</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onLevelBound}>Canvas bound</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onTheme}>Theme</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onBGM}>{["Background music",wn2]}</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onFlareCount}>{["Flare count",wn3]}</NavDropdown.Item>
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onSneakVal}>Starting sneak value</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item disabled={!p.currentLevel}
                                      onClick={p.onLevelAdvanced}>Advanced</NavDropdown.Item>
                </NavDropdown>
                {/*<NavDropdown title="Background texture" id={"bg-t"}>*/}
                {/*    <NavDropdown.Item disabled={!p.currentLevel}*/}
                {/*                      onClick={() => p.onBG("floor-tile")}*/}
                {/*                      active={p.currentLevel && p.currentLevel.background.texture == "floor-tile" }>*/}
                {/*        Floor Tile*/}
                {/*    </NavDropdown.Item>*/}
                {/*</NavDropdown>*/}
            </Nav>
        </Navbar>
    </React.Fragment>;
};

export default connect((s: EditorState) => ({currentLevel: s.currentLevel}), null)(Navigation);