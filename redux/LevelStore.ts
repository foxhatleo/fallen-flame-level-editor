import {createStore, Store} from "redux";
import rootReducer from "./reducers";
import StateType from "./StateType";
import {Action} from "./ActionType";

export type LevelStore = Store<StateType, Action>;

export default createStore(rootReducer);
