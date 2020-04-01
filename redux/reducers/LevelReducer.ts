import {Action, ActionType} from "../ActionType";
import {LevelState} from "../StateType";
import {guardNonEmptyString} from "../Validators";
import PairReducer from "./PairReducer";

export const newLevel: () => LevelState = () => ({
    name: "Untitled",
    physicsSize: [16, 12],
    graphicSize: [800, 600],
    fpsRange: [20, 60],
    changed: true,
});

const PhysicsSizeReducer = PairReducer(
    ActionType.UPDATE_PHYSICS_WIDTH, ActionType.UPDATE_PHYSICS_HEIGHT,
    1, 100, false);
const GraphicSizeReducer = PairReducer(
    ActionType.UPDATE_GRAPHIC_WIDTH, ActionType.UPDATE_GRAPHIC_HEIGHT,
    100, 5000, true);
const FPSRangeReducer = PairReducer(
    ActionType.UPDATE_FPS_LOWER, ActionType.UPDATE_FPS_UPPER,
    1, 500, true, true);

export default function LevelReducer(state = newLevel(), action: Action): LevelState {
    switch (action.type) {
        case ActionType.UPDATE_NAME:
            return {...state, changed: true,
                name: guardNonEmptyString(action.newValue, "Untitled")};
        case ActionType.MARK_CHANGED:
            return {...state, changed: true};
        case ActionType.MARK_UNCHANGED:
            return {...state, changed: false};
        default:
            return {...state, changed: true,
                physicsSize: PhysicsSizeReducer(state.physicsSize, action),
                graphicSize: GraphicSizeReducer(state.graphicSize, action),
                fpsRange: FPSRangeReducer(state.fpsRange, action),
            };
    }
};