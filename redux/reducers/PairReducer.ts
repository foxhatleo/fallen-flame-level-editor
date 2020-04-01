import {Action, ActionType} from "../ActionType";
import {guardInt, guardNumber, guardRange} from "../Validators";

export default function PairReducer(
    updateFirstActionType: ActionType,
    updateSecondActionType: ActionType,
    lowerBound: number = Number.NEGATIVE_INFINITY,
    upperBound: number = Number.POSITIVE_INFINITY,
    int: boolean = false,
    upperThanLower: boolean = false):
    (prevValues: [number, number], actualAction: Action) => [number, number] {
    return (p, a) => {
        const newv: [number, number] = [p[0], p[1]];
        switch (a.type) {
            case updateFirstActionType:
            case updateSecondActionType:
                const ui = Number(a.type == updateSecondActionType);
                newv[ui] = (a as {newValue: number}).newValue;
                newv[ui] = int ? guardInt(newv[ui]) : guardNumber(newv[ui]);
                newv[ui] = guardRange(newv[ui], lowerBound, upperBound);
                if (upperThanLower && newv[0] > newv[1]) {
                    newv[(ui + 1) % 2] = newv[ui];
                }
                return newv;
            default:
                return p;
        }
    };
}