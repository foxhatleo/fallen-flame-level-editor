export type LevelState = {
    name: string;
    physicsSize: [number, number];
    graphicSize: [number, number];
    fpsRange: [number, number];
    playerpos: [number, number];
    exitpos: [number, number];
    enemies: EnemyInfo[];
    changed: boolean;
    lighting: LightingInfo;
    background: {texture: string};
    walls: WallInfo[];
    _editorInfo: LevelEditorInfo;
};

export type EnemyInfo = {
    enemytype: string;
    enemypos: [number, number];
};

export type LightingInfo = {
    color: [number, number, number, number];
    gamma: boolean;
    diffuse: boolean;
    blur: number;
};

export type WallInfo = {
    pos: [number, number];
    size: [number, number];
    texture: string;
};

export type LevelEditorInfo = {
    tool: string;
    chosen: number;
};

declare type EditorState = {
    current: number;
    levels: LevelState[];
    currentLevel: LevelState;
};
export default EditorState;
