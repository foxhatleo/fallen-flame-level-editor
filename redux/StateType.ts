export type LevelState = {
    name: string;
    physicsSize: [number, number];
    graphicSize: [number, number];
    fpsRange: [number, number];
    changed: boolean;
};

declare type EditorState = {
    current: number;
    levels: LevelState[];
    currentLevel: LevelState;
};
export default EditorState;
