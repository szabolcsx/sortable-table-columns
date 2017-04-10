import { SortDirectionType } from "react-virtualized";

export interface IIndexedStore<T> {
    [key: number]: T;
}

export interface IStore<T> {
    byId: IIndexedStore<T>;
    allIds: number[];
}

export interface ITableRow {
    id: number;
    code: string;
    root: string;
    description: string;
};

export interface ITable {
    sortBy: string;
    sortDirection: SortDirectionType;
    rows: IStore<ITableRow>;
};