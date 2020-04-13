import React from "react";
import Navigation from "./editor/Navigation";
import TabScreen from "./editor/TabScreen";
import NameWindow from "./editor/NameWindow";
import BoundWindow from "./editor/BoundWindow";
import CloseWarnWindow from "./editor/CloseWarnWindow";
import AdvancedWindow, {AdvancedResult} from "./editor/AdvancedWindow";
import ImportWindow from "./editor/ImportWindow";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHandPaper, faMousePointer} from "@fortawesome/free-solid-svg-icons";
import {LevelStore} from "redux/LevelStore";
import {connect} from "react-redux";
import * as Actions from "../redux/Actions";
import {bindActionCreators} from "redux";
import EditorState, {LevelState} from "../redux/StateType";
import {newLevel} from "../redux/reducers/LevelReducer";
import {encode, ImportedLevel} from "../redux/LevelJSON";
import {download} from "../utils/JSON";
import ImportWarnWindow from "./editor/ImportWarnWindow";

library.add(faHandPaper, faMousePointer);

/**
 * An enum that indicates what action state the app is in at the moment.
 */
enum CurrentAction {
    NO_ACTION,
    NEW_LEVEL_NAME_PROMPT,
    NEW_LEVEL_BOUND_PROMPT,
    CLOSE_WARN,
    NAME_SETTING,
    BOUND_SETTING,
    ADVANCED_SETTING,
    IMPORT,
    IMPORT_WARN,
}

class App extends React.Component<typeof Actions & {
    /** Current chosen level. */    currentLevel: LevelState;
    anyChanged: boolean;
}, {
    /** Current action: */ action: CurrentAction;
}> {

    /** Cached level name input. */
    private _cachedName: string;

    /**
     * @constructor
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {action: CurrentAction.NO_ACTION};
    }

    componentDidMount(): void {
        if (typeof window !== "undefined") {
            window.onkeypress = this.keyPress.bind(this);
            window.onbeforeunload = this.systemSaveWarn.bind(this);
        }
    }

    private systemSaveWarn(e: BeforeUnloadEvent): void {
        if (this.props.anyChanged) {
            e.preventDefault();
            e.returnValue = "It seems that you have not yet saved your work. If you exit now, you will lose your " +
                "progress. Levels do not save themselves automatically due to technical restriction. You must export " +
                "them every time you make changes.";
        }
    }

    private keyPress(evt: KeyboardEvent): void {
        const key = evt.key.toLowerCase();
        if (key == "a") {
            this.props.editorChangeTool("hand");
        } else if (key == "s") {
            this.props.editorChangeTool("pointer");
        } else if (key == "d") {
            this.onRemove();
        }
    }

    /**
     * Triggered when "close" menu item is chosen.
     */
    private onClose(): void {
        if (!this.props.currentLevel) return;
        if (this.props.currentLevel.changed) {
            this.setState({action: CurrentAction.CLOSE_WARN});
        } else {
            this.closeImmediately();
        }
    }

    /**
     * Close current level immediately.
     */
    private closeImmediately(): void {
        this.clearAction();
        if (!this.props.currentLevel) return;
        this.props.editorCloseLevel();
    }

    /**
     * Triggered when "export" menu item is chosen.
     */
    private onExport(): void {
        if (!this.props.currentLevel) return;
        download(encode(this.props.currentLevel), this.props.currentLevel.name);
        this.props.markUnchanged();
    }

    /**
     * Triggered when "import" menu item is chosen.
     */
    private onImport(): void {
        this.setState({action: CurrentAction.IMPORT});
    }

    /**
     * Triggered when "change level bound" menu item is chosen.
     */
    private onLevelBound(): void {
        this.setState({action: CurrentAction.BOUND_SETTING});
    }

    /**
     * Triggered when "change level name" menu item is chosen.
     */
    private onLevelName(): void {
        this.setState({action: CurrentAction.NAME_SETTING});
    }

    /**
     * Triggered when "change advanced setting" menu item is chosen.
     */
    private onLevelAdvanced(): void {
        this.setState({action: CurrentAction.ADVANCED_SETTING});
    }

    /**
     * Triggered when "new level" menu item is chosen.
     */
    private onNew(): void {
        this.setState({action: CurrentAction.NEW_LEVEL_NAME_PROMPT});
    }

    /**
     * Clear action.
     */
    private clearAction(): void {
        this.setState({action: CurrentAction.NO_ACTION});
    }

    /**
     * Whether name window should be showing.
     */
    private get nameWindowShowing(): boolean {
        return this.state.action == CurrentAction.NEW_LEVEL_NAME_PROMPT ||
            this.state.action == CurrentAction.NAME_SETTING;
    }

    /**
     * Triggered when clicked "OK" in name window.
     *
     * @param value {string} Value returned.
     */
    private nameWindowOK(value: string): void {
        this._cachedName = value;
        switch (this.state.action) {
            case CurrentAction.NEW_LEVEL_NAME_PROMPT:
                this.setState({action: CurrentAction.NEW_LEVEL_BOUND_PROMPT});
                break;
            case CurrentAction.NAME_SETTING:
                this.props.updateName(value);
                this.clearAction();
                break;
            default:
                throw new Error("Unknown name window ok handled.");
        }
    }

    private get boundWindowShowing(): boolean {
        return this.state.action == CurrentAction.NEW_LEVEL_BOUND_PROMPT ||
            this.state.action == CurrentAction.BOUND_SETTING;
    }

    /**
     * Triggered when clicked "OK" in bound window.
     *
     * @param x {number}
     * @param y {number}
     */
    private boundWindowOK(x: number, y: number): void {
        switch (this.state.action) {
            case CurrentAction.NEW_LEVEL_BOUND_PROMPT:
                const nl = newLevel(x, y);
                nl.name = this._cachedName;
                this.props.editorNewLevel(nl);
                break;
            case CurrentAction.BOUND_SETTING:
                this.props.updatePhysicsWidth(x);
                this.props.updatePhysicsHeight(y);
                break;
            default:
                throw new Error("Unknown bound window ok handled.");
        }
        this.clearAction();
    }

    private _tempImport: ImportedLevel;

    /**
     * Triggered when importing level.
     *
     * @param level {LevelStore}
     */
    private importWindowOK(level: ImportedLevel): void {
        this._tempImport = level;
        if (level.msg) {
            this.showWarning();
        } else {
            this.importAnyway();
        }
    }

    private importAnyway(): void {
        this.props.editorNewLevel(this._tempImport.level);
        this.clearAction();
    }

    /**
     * Show warning screen.
     */
    private showWarning(): void {
        this.setState({action: CurrentAction.IMPORT_WARN});
    }

    /**
     * Triggered when clicked "OK" in advanced setting.
     *
     * @param res {AdvancedResult}
     */
    private advancedWindowOK(res: AdvancedResult): void {
        this.props.updateGraphicWidth(res.graphicsX);
        this.props.updateGraphicHeight(res.graphicsY);
        this.props.updateFPSLower(res.fpsLower);
        this.props.updateFPSUpper(res.fpsUpper);
        this.clearAction();
    }

    private onAddEnemy(): void {
        this.props.addEnemy();
    }

    private onAddWall(): void {
        this.props.addWall();
    }

    private onRemove(): void {
        this.props.remove();
    }

    render() {
        return <React.Fragment>
            <Navigation onClose={this.onClose.bind(this)}
                        onExport={this.onExport.bind(this)}
                        onImport={this.onImport.bind(this)}
                        onLevelBound={this.onLevelBound.bind(this)}
                        onLevelName={this.onLevelName.bind(this)}
                        onLevelAdvanced={this.onLevelAdvanced.bind(this)}
                        onNew={this.onNew.bind(this)}
                        onAddEnemy={this.onAddEnemy.bind(this)}
                        onAddWall={this.onAddWall.bind(this)}
                        onRemove={this.onRemove.bind(this)}
                        onBG={this.props.setBackground}/>
            <TabScreen />
            <NameWindow show={this.nameWindowShowing}
                        onOK={this.nameWindowOK.bind(this)}
                        onCancel={this.clearAction.bind(this)}
                        newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_NAME_PROMPT} />
            <BoundWindow show={this.boundWindowShowing}
                         onOK={this.boundWindowOK.bind(this)}
                         onCancel={this.clearAction.bind(this)}
                         newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_BOUND_PROMPT} />
            <CloseWarnWindow show={this.state.action == CurrentAction.CLOSE_WARN}
                             onOK={this.closeImmediately.bind(this)}
                             onCancel={this.clearAction.bind(this)}/>
            <ImportWarnWindow show={this.state.action == CurrentAction.IMPORT_WARN}
                                 onOK={this.importAnyway.bind(this)}
                                 onCancel={this.clearAction.bind(this)}
                                 messages={(this._tempImport ? this._tempImport.msg : null) || []}/>
            <AdvancedWindow show={this.state.action == CurrentAction.ADVANCED_SETTING}
                            onOK={this.advancedWindowOK.bind(this)}
                            onCancel={this.clearAction.bind(this)} />
            <ImportWindow   show={this.state.action == CurrentAction.IMPORT}
                            onOK={this.importWindowOK.bind(this)}
                            onCancel={this.clearAction.bind(this)}/>
        </React.Fragment>;
    }
}

export default connect(
    (s: EditorState) => ({currentLevel: s.currentLevel, anyChanged: s.levels.some((s) => s.changed)}),
    d => bindActionCreators(Actions, d))(App);
