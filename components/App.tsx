import React from "react";
import LevelModel from "models/LevelModel";
import Navigation from "./Navigation";
import TabScreen from "./TabScreen";
import NameWindow from "./NameWindow";
import BoundWindow from "./BoundWindow";
import CloseWarnWindow from "./CloseWarnWindow";
import AdvancedWindow, {AdvancedResult} from "./AdvancedWindow";
import ImportWindow from "./ImportWindow";
import download from "utils/download";
import {library} from "@fortawesome/fontawesome-svg-core";
import {faHandPaper, faMousePointer} from "@fortawesome/free-solid-svg-icons";

library.add(faHandPaper, faMousePointer);

enum CurrentAction {
    NO_ACTION,
    NEW_LEVEL_NAME_PROMPT,
    NEW_LEVEL_BOUND_PROMPT,
    CLOSE_WARN,
    NAME_SETTING,
    BOUND_SETTING,
    ADVANCED_SETTING,
    IMPORT,
}

class App extends React.Component<{}, {
    select: number,
    action: CurrentAction,
    levels: Array<LevelModel>,
}> {
    private _cachedName: string;

    constructor(props) {
        super(props);
        this.state = {select: 0, action: CurrentAction.NO_ACTION, levels: []};
    }

    private onClose(): void {
        if (!this.currentSelect) return;
        if (this.currentSelect.changed) {
            this.setState({action: CurrentAction.CLOSE_WARN});
        } else {
            this.closeImmediately();
        }
    }

    private closeImmediately(): void {
        this.clearAction();
        if (!this.currentSelect) return;
        this.state.levels.splice(this.state.select, 1)[0].dispose();
        this.setState({levels: this.state.levels});
    }

    private onExport(): void {
        if (!this.currentSelect) return;
        download(this.currentSelect.toJSON(), this.currentSelect.filename);
        this.currentSelect.changed = false;
    }

    private onImport(): void {
        this.setState({action: CurrentAction.IMPORT});
    }

    private onLevelBound(): void {
        this.setState({action: CurrentAction.BOUND_SETTING});
    }

    private onLevelName(): void {
        this.setState({action: CurrentAction.NAME_SETTING});
    }

    private onLevelAdvanced(): void {
        this.setState({action: CurrentAction.ADVANCED_SETTING});
    }

    private onNew(): void {
        this.setState({action: CurrentAction.NEW_LEVEL_NAME_PROMPT});
    }

    private get currentSelect(): LevelModel | null {
        return this.state.levels.length > this.state.select ?
            this.state.levels[this.state.select] : null;
    }

    private get hasOpenLevels(): boolean {
        return this.state.levels.length > 0;
    }

    private clearAction(): void {
        this.setState({action: CurrentAction.NO_ACTION});
    }

    private get nameWindowShowing(): boolean {
        return this.state.action == CurrentAction.NEW_LEVEL_NAME_PROMPT ||
            this.state.action == CurrentAction.NAME_SETTING;
    }

    private nameWindowOK(value: string): void {
        this._cachedName = value;
        switch (this.state.action) {
            case CurrentAction.NEW_LEVEL_NAME_PROMPT:
                this.setState({action: CurrentAction.NEW_LEVEL_BOUND_PROMPT})
                break;
            case CurrentAction.NAME_SETTING:
                this.currentSelect.name = this._cachedName;
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

    private boundWindowOK(x: number, y: number): void {
        switch (this.state.action) {
            case CurrentAction.NEW_LEVEL_BOUND_PROMPT:
                this.setState({
                    select: this.state.levels.length,
                    levels: this.state.levels.concat([new LevelModel(this._cachedName, x, y)])
                });
                break;
            case CurrentAction.BOUND_SETTING:
                this.currentSelect.boundX = x;
                this.currentSelect.boundY = y;
                break;
            default:
                throw new Error("Unknown bound window ok handled.");
        }
        this.clearAction();
    }

    private importWindowOK(level: LevelModel): void {
        this.setState({
            select: this.state.levels.length,
            levels: this.state.levels.concat([level])
        });
        this.clearAction();
    }

    private advancedWindowOK(res: AdvancedResult): void {
        this.currentSelect.graphicsX = res.graphicsX;
        this.currentSelect.graphicsY = res.graphicsY;
        this.currentSelect.fpsLower = res.fpsLower;
        this.currentSelect.fpsUpper = res.fpsUpper;
        this.clearAction();
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
                        currentlySelecting={!!this.currentSelect} />
            <TabScreen levels={this.state.levels}
                       select={this.state.select}
                       onSelect={i => { this.setState({select: i}); }}/>
            <NameWindow show={this.nameWindowShowing}
                        onOK={this.nameWindowOK.bind(this)}
                        onCancel={this.clearAction.bind(this)}
                        newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_NAME_PROMPT}
                        selectedLevel={this.currentSelect}/>
            <BoundWindow show={this.boundWindowShowing}
                         onOK={this.boundWindowOK.bind(this)}
                         onCancel={this.clearAction.bind(this)}
                         newLevelMode={this.state.action == CurrentAction.NEW_LEVEL_BOUND_PROMPT}
                         selectedLevel={this.currentSelect}/>
            <CloseWarnWindow show={this.state.action == CurrentAction.CLOSE_WARN}
                             onOK={this.closeImmediately.bind(this)}
                             onCancel={this.clearAction.bind(this)}/>
            <AdvancedWindow show={this.state.action == CurrentAction.ADVANCED_SETTING}
                            onOK={this.advancedWindowOK.bind(this)}
                            onCancel={this.clearAction.bind(this)}
                            selectedLevel={this.currentSelect}/>
            <ImportWindow   show={this.state.action == CurrentAction.IMPORT}
                            onOK={this.importWindowOK.bind(this)}
                            onCancel={this.clearAction.bind(this)}/>
        </React.Fragment>;
    }
}

export default App;
