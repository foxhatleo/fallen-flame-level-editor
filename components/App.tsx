import React from "react";
import Navigation from "./editor/Navigation";
import TabScreen from "./editor/TabScreen";
import NameWindow from "./editor/NameWindow";
import BoundWindow from "./editor/BoundWindow";
import CloseWarnWindow from "./editor/CloseWarnWindow";
import AdvancedWindow, {AdvancedResult} from "./editor/AdvancedWindow";
import ImportWindow from "./editor/ImportWindow";
import {library} from "@fortawesome/fontawesome-svg-core";
import {
    faClosedCaptioning,
    faExclamationTriangle, faGripHorizontal, faGripVertical,
    faHandPaper,
    faMousePointer,
    faPlay,
    faProjectDiagram, faSmog, faSquare,
    faStop, faTree
} from "@fortawesome/free-solid-svg-icons";
import {LevelStore} from "redux/LevelStore";
import {connect} from "react-redux";
import * as Actions from "../redux/Actions";
import {bindActionCreators} from "redux";
import EditorState, {BGM, LevelState, Themes} from "../redux/StateType";
import {newLevel} from "../redux/reducers/LevelReducer";
import {encode, ImportedLevel} from "../redux/LevelJSON";
import {download} from "../utils/JSON";
import ImportWarnWindow from "./editor/ImportWarnWindow";
import SneakValWindow from "./editor/SneakValWindow";
import BGMWindow from "./editor/BGMWindow";
import FlareCountWindow from "./editor/FlareCountWindow";
import TextWindow from "./editor/TextWindow";
import ThemeSelectWindow from "./editor/ThemeSelectWindow";

library.add(
    faGripVertical, faGripHorizontal, faSquare, faSmog,
    faHandPaper, faMousePointer, faProjectDiagram, faPlay, faStop, faTree, faExclamationTriangle, faClosedCaptioning);

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
    SNEAK_VAL,
    IMPORT,
    IMPORT_WARN,
    BGM,
    FLARE_COUNT,
    NEW_TEXT,
    EDIT_TEXT,
    EDIT_THEME,
    NEW_LEVEL_THEME_PROMPT,
}

class App extends React.Component<typeof Actions & {
    /** Current chosen level. */    currentLevel: LevelState;
    anyChanged: boolean;
}, {
    /** Current action: */ action: CurrentAction;
}> {

    /** Cached level name input. */
    private _cachedName: string;

    /** Cached level bound input. */
    private _cachedBound: [number, number];

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
            document.onkeypress = this.keyPress.bind(this);
            window.onkeydown = this.keyDown.bind(this);
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
        if (this.state.action != CurrentAction.NO_ACTION) return;
        if (key == "a") {
            this.props.editorChangeTool("hand");
        } else if (key == "s") {
            this.props.editorChangeTool("pointer");
        } else if (key == "p") {
            this.props.editorChangeTool("path");
        } else if (key == "t") {
            this.props.editorChangeTool("text");
        } else if (key == "d") {
            this.onRemove();
        } else if (key == "z") {
            this.onAddWall();
        } else if (key == "x") {
            this.onAddEnemy();
        } else if (key == "c") {
            this.onAddFlare();
        } else if (key == "v") {
            this.onAddText();
        } else if (key == "b") {
            this.onAddTree();
        } else if (key == "l") {
            this.onEditText();
        } else if (key == "m") {
            this.onToggleBackground();
        }
    }

    private keyDown(evt: KeyboardEvent): boolean {
        if (evt.key.toLowerCase() == "s" && (evt.ctrlKey || evt.metaKey)) {
            evt.preventDefault();
            this.onExport();
            return false;
        }
       return true;
    }

    // setState<K extends keyof { action: CurrentAction }>(state: ((prevState: Readonly<{ action: CurrentAction }>, props: Readonly<typeof Actions & { currentLevel: LevelState; anyChanged: boolean }>) => (Pick<{ action: CurrentAction }, K> | { action: CurrentAction } | null)) | Pick<{ action: CurrentAction }, K> | { action: CurrentAction } | null, callback?: () => void) {
    //     debugger;
    //     super.setState(state, callback);
    // }

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

    private onBGM(): void {
        this.setState({action: CurrentAction.BGM});
    }

    /**
     * Triggered when "sneak val" menu item is chosen.
     */
    private onSneakVal(): void {
        this.setState({action: CurrentAction.SNEAK_VAL});
    }

    /**
     * Triggered when "flare count" menu item is chosen.
     */
    private onFlareCount(): void {
        this.setState({action: CurrentAction.FLARE_COUNT});
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

    private sneakValOK(value: number): void {
        this.props.updateSneakVal(value);
        this.clearAction();
    }

    private flareValOK(s: number, m: number): void {
        this.props.updateStartFlareCount(s);
        this.props.updateMaxFlareCount(m);
        this.clearAction();
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
                this._cachedBound = [x, y];
                this.setState({action: CurrentAction.NEW_LEVEL_THEME_PROMPT});
                return;
            case CurrentAction.BOUND_SETTING:
                this.props.updatePhysicsWidth(x);
                this.props.updatePhysicsHeight(y);
                break;
            default:
                throw new Error("Unknown bound window ok handled.");
        }
        this.clearAction();
    }

    private bgmWindowOK(b: BGM): void {
        this.props.updateBGM(b);
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
        this.props.updateFPSLower(res.fpsLower);
        this.props.updateFPSUpper(res.fpsUpper);
        this.clearAction();
    }

    private onAddFlare(): void {
        if (!this.props.currentLevel) return;
        this.props.addItem();
    }

    private onAddEnemy(): void {
        if (!this.props.currentLevel) return;
        this.props.addEnemy();
    }

    private get themeShowing(): boolean {
        return this.state.action == CurrentAction.NEW_LEVEL_THEME_PROMPT ||
            this.state.action == CurrentAction.EDIT_THEME;
    }

    private onTheme(): void {
        if (!this.props.currentLevel) return;
        this.setState({action: CurrentAction.EDIT_THEME});
    }

    private themeOK(t: Themes, all: boolean): void {
        if (this.state.action == CurrentAction.NEW_LEVEL_THEME_PROMPT) {
            const nl = newLevel(this._cachedBound[0], this._cachedBound[1], t);
            nl.name = this._cachedName;
            this.props.editorNewLevel(nl);
        } else {
            this.props.changeTheme([t, all]);
        }
        this.clearAction();
    }

    private onAddWall(): void {
        if (!this.props.currentLevel) return;
        this.props.addWall();
    }

    private onAddTree(): void {
        if (!this.props.currentLevel) return;
        this.props.addTree();
    }

    private onAddText(): void {
        if (!this.props.currentLevel) return;
        this.setState({action: CurrentAction.NEW_TEXT});
    }

    private onEditText(): void {
        this.setState({action: CurrentAction.EDIT_TEXT});
    }

    private textOK(v: string): void {
        if (this.state.action == CurrentAction.NEW_TEXT ) {
            this.props.addText(v);
        } else {
            this.props.changeText([this.props.currentLevel._editorInfo.chosen - 100000, v]);
        }
        this.clearAction();
    }

    private onRemove(): void {
        this.props.remove();
    }

    private onToggleBackground(): void {
        this.props.toggleBackground();
    }

    render() {
        return <React.Fragment>
            <Navigation onClose={this.onClose.bind(this)}
                        onExport={this.onExport.bind(this)}
                        onImport={this.onImport.bind(this)}
                        onLevelBound={this.onLevelBound.bind(this)}
                        onLevelName={this.onLevelName.bind(this)}
                        onLevelAdvanced={this.onLevelAdvanced.bind(this)}
                        onSneakVal={this.onSneakVal.bind(this)}
                        onNew={this.onNew.bind(this)}
                        onAddEnemy={this.onAddEnemy.bind(this)}
                        onAddWall={this.onAddWall.bind(this)}
                        onRemove={this.onRemove.bind(this)}
                        onBG={this.props.setBackground}
                        onBGM={this.onBGM.bind(this)}
                        onAddFlare={this.onAddFlare.bind(this)}
                        onAddText={this.onAddText.bind(this)}
                        onAddTree={this.onAddTree.bind(this)}
                        onEditText={this.onEditText.bind(this)}
                        onFlareCount={this.onFlareCount.bind(this)}
                        onToggleBackgroundEdit={this.onToggleBackground.bind(this)}
                        onTheme={this.onTheme.bind(this)}/>
            <TabScreen />
            <NameWindow show={this.nameWindowShowing}
                        onOK={this.nameWindowOK.bind(this)}
                        onCancel={this.clearAction.bind(this)}
                        newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_NAME_PROMPT} />
            <TextWindow show={this.state.action == CurrentAction.NEW_TEXT || this.state.action == CurrentAction.EDIT_TEXT}
                        onOK={this.textOK.bind(this)}
                        onCancel={this.clearAction.bind(this)}
                        newText={this.state.action == CurrentAction.NEW_TEXT} />
            <SneakValWindow show={this.state.action == CurrentAction.SNEAK_VAL}
                            onOK={this.sneakValOK.bind(this)}
                            onCancel={this.clearAction.bind(this)} />
            <FlareCountWindow show={this.state.action == CurrentAction.FLARE_COUNT}
                              onOK={this.flareValOK.bind(this)}
                              onCancel={this.clearAction.bind(this)} />
            <BoundWindow show={this.boundWindowShowing}
                         onOK={this.boundWindowOK.bind(this)}
                         onCancel={this.clearAction.bind(this)}
                         newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_BOUND_PROMPT} />
            <ThemeSelectWindow show={this.themeShowing}
                       onOK={this.themeOK.bind(this)}
                       onCancel={this.clearAction.bind(this)}
                       newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_THEME_PROMPT}/>
            <BGMWindow show={this.state.action == CurrentAction.BGM}
                       onOK={this.bgmWindowOK.bind(this)}
                       onCancel={this.clearAction.bind(this)} />
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
