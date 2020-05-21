export type LevelState = {
    name: string;
    physicsSize: [number, number];
    fpsRange: [number, number];
    startFlareCount?: number;
    maxFlareCount?: number;
    playerpos: [number, number];
    bgm?: BGM;
    items?: Item[];
    exitpos: [number, number];
    enemies: EnemyInfo[];
    changed: boolean;
    lighting: LightingInfo;
    background: {texture: BackgroundTexture};
    startSneakVal?: number;
    walls: WallInfo[];
    trees: TreeInfo[];
    extras: ExtraInfo[];
    _editorInfo: LevelEditorInfo;
    texts?: TextInfo[];
};

export enum BackgroundTexture {
    FLOOR_TILE = "floor-tile",
    VOLCANO_TILE = "volcano-tile",
    FOREST_TILE = "forest-tile",
}

export enum Themes {
    REGULAR = "Cave",
    FOREST = "Forest",
    VOLCANO = "Volcano",
}

export enum BGM {
    // menu_music = "menu-music",
    the_doll_thrown_away_in_rain = "the-doll-thrown-away-in-rain",
    soul_of_a_girl = "soul-of-a-girl",
    another_planet = "another-planet",
    cursed_piano = "cursed-piano",
    disturbing_haze = "disturbing-haze",
    hazy_moon = "hazy-moon",
    peaceful_early_evening = "peaceful-early-evening",
    ruins = "ruins",
    silence1 = "silence1",
    silence2 = "silence2",
    the_deep_long_tunnel = "the-deep-long-tunnel",
    chess = "chess",
    // feud_of_nora_dog_and_nora_cat = "feud-of-nora-dog-and-nora-cat",
}

export type ExtraInfo = {
    extraPos: [number, number];
    extraType: ExtraType;
}

export enum ExtraType {
    HORIZONTAL = "horizontal",
    SQUARE = "square",
    VERTICAL = "vertical",
    PATCH = "patch"
}

export type TextInfo = {
    pos: [number, number];
    size: [number, number];
    text: string;
};

export type Item = {
    itemPos: [number, number];
    itemType: "flare";
};

export type EnemyInfo = {
    enemytype: string;
    subtype?: "pathing";
    pathCoors?: [number, number][];
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
    texture: WallTexture;
};

export type TreeInfo = {
    pos: [number, number];
};

export enum WallTexture {
    WALL_SIDE = "wall-side",
    WALL_TOP = "wall-top",
    VOLCANO_SIDE = "volcano-side",
    VOLCANO_TOP = "volcano-top",
}

export type LevelEditorInfo = {
    tool: string;
    chosen: number;
    view: [number, number];
    backgroundEdit: boolean;
};

declare type EditorState = {
    current: number;
    levels: LevelState[];
    currentLevel: LevelState;
};
export default EditorState;
