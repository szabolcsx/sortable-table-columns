import { Action } from "redux";

import { TableActionTypes } from "../constants/actions/table";

import { SortDirectionType } from "react-virtualized";

interface IMoveRowsAction extends Action {
    payload: {
        from: number;
        to: number;
    };
};

export interface IMoveRowFunction {
    (from: number, to: number): void | IMoveRowsAction;
}

export const moveRow = (from: number, to: number):IMoveRowsAction => ({
    type: TableActionTypes.MoveRow,
    payload: { from, to }
});

export const sort = (sortBy: string, sortDirection: SortDirectionType) => ({
    type: TableActionTypes.Sort,
    payload: { sortBy, sortDirection }
});