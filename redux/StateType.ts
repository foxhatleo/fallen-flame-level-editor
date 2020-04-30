export type LevelState = {
    name: string;
    physicsSize: [number, number];
    fpsRange: [number, number];
    startFlareCount?: number;
    maxFlareCount?: number;
    playerpos: [number, number];
    bgm?: BGM;
    exitpos: [number, number];
    enemies: EnemyInfo[];
    changed: boolean;
    lighting: LightingInfo;
    background: {texture: string};
    startSneakVal?: number;
    walls: WallInfo[];
    _editorInfo: LevelEditorInfo;
};

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
    texture: string;
};

export type LevelEditorInfo = {
    tool: string;
    chosen: number;
    view: [number, number];
};

declare type EditorState = {
    current: number;
    levels: LevelState[];
    currentLevel: LevelState;
};
export default EditorState;
