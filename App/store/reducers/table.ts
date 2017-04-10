import { ITable } from "../../interfaces/state";

import { TableActionTypes } from "../../constants/actions/table";

import initialState from "../../constants/state";
import { SortDirection } from "react-virtualized";

import * as _ from "lodash";

export default (state: ITable = initialState.table, action): ITable => {
    switch (action.type) {
        case TableActionTypes.MoveRow: {
            const {
                from,
                to
            } = action.payload;

            const allIds = _.clone(state.rows.allIds);

            const fromRow = allIds[from];

            allIds.splice(from, 1);
            allIds.splice(to, 0, fromRow);

            return {
                ...state,
                rows: {
                    ...state.rows,
                    allIds
                }
            };
        }

        case TableActionTypes.Sort: {
            const { sortBy, sortDirection } = action.payload;

            const { allIds } = state.rows;

            return {
                ...state,
                sortBy,
                sortDirection,
                rows: {
                    ...state.rows,
                    allIds: allIds.sort((a, b) => {
                        const operationA = state.rows.byId[a];
                        const operationB = state.rows.byId[b];

                        const fieldA = operationA[sortBy];
                        const fieldB = operationB[sortBy];

                        let result = 0;

                        if (fieldA > fieldB) {
                            result = 1;
                        } else if (fieldA < fieldB) {
                            result = -1;
                        }

                        if (sortDirection === SortDirection.DESC) {
                            result *= -1;
                        }

                        return result;
                    })
                }
            };
        }

        default: {
            return state;
        }
    }
};