import { IState } from "../../interfaces/state";

import * as _ from "lodash";

import { SortDirection } from "react-virtualized";

const ids = _.range(10000);

const initialState: IState = {
    table: {
        sortBy: null,
        sortDirection: SortDirection.ASC,
        rows: {
            byId: _.keyBy(ids.map(id => ({
                id: id,
                code: `C${id}`,
                root: `R${id}`,
                description: `Description ${id}`
            })), "id"),
            allIds: ids
        }
    }
};

export default initialState;