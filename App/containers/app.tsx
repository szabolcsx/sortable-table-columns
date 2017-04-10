import * as React from "react";
import * as ReactDOM from "react-dom";
import {
    connect,
    MapStateToProps,
    MapDispatchToPropsFunction
} from "react-redux";

import * as _ from "lodash";

import { bindActionCreators } from "redux";

import { createSelector } from "reselect";

import { IState } from "../interfaces/state";
import { ITableRow, IStore } from "../interfaces/state/itable";

import * as TableActions from "../actions/table";

import {
    SortableElement,
    SortableContainer,
    SortableHandle,
    arrayMove
} from "react-sortable-hoc";

import {
    AutoSizer,
    Column,
    Table,
    TableProps,
    SortDirection,
    SortDirectionType,
    defaultTableHeaderRowRenderer,
    defaultTableHeaderRenderer,
    defaultTableRowRenderer,
    TableHeaderProps,
    TableHeaderRowProps,
} from "react-virtualized";

import classNames from "classnames";
import Draggable from "react-draggable";

import "react-virtualized/styles.css";
import "./table.scss";


interface IAppContainerStateProps {
    sortBy: string;
    sortDirection: SortDirectionType;
    rows: ITableRow[];
};

interface IAppContainerDispatchProps {
    moveRow: TableActions.IMoveRowFunction;
    sort: (sortBy: string, sortDirection: SortDirectionType) => void;
};

type IAppContainerProps = IAppContainerStateProps & IAppContainerDispatchProps;

interface ITableColumnDefinition {
    label: string;
    dataKey: string;
    width: number;
    flexGrow: number;
};

interface IAppContainerState {
    tableColumns: _.Dictionary<ITableColumnDefinition>;
    allTableColumns: string[];
};

const TableHeaderCellDragHandle = SortableHandle(({ label, dataKey, sortBy, sortDirection }) => {
    let sort = false;
    let sortAsc = false;
    let sortDesc = false;

    if (typeof sortBy !== "undefined") {
        if (dataKey === sortBy) {
            if (sortDirection === SortDirection.ASC) {
                sortAsc = true;
            } else {
                sortDesc = true;
            }
        }
        sort = true;
    }

    return (
        <div className="table-header-cell-drag-handle">
            <div className="table-header-cell-label">
                {label}
            </div>
            {
                sort &&
                <div className="table-header-cell-sort-indicator">
                    <i className={classNames({
                        "fa": true,
                        "fa-sort": sort,
                        "fa-sort-asc": sortAsc,
                        "fa-sort-desc": sortDesc
                    })}></i>
                </div>
            }

        </div>
    );
});

interface ITableHeaderCellProps extends TableHeaderProps {
    onResize: ({ dataKey: string, deltaX }) => void;
}

const TableHeaderCell = ({ columnData, dataKey, disableSort, label, sortBy, sortDirection, onResize }: ITableHeaderCellProps) => {
    return (
        <div className="table-header-cell">
            <TableHeaderCellDragHandle
                dataKey={dataKey}
                label={label}
                sortBy={sortBy}
                sortDirection={sortDirection} />
            <Draggable
                axis="x"
                defaultClassName="table-header-cell-resize-handle"
                defaultClassNameDragging="table-header-cell-resize-handle-active"
                position={{
                    x: 0,
                    y: 0
                }}
                bounds={{
                    left: -1 * columnData.width + 10,
                    top: 0,
                    right: 9999,
                    bottom: 0
                }}
                zIndex={999}
                collection={2}
                onMouseDown={event => event.preventDefault()}
                onStop={(event, data) => onResize({ dataKey, deltaX: data.x })}>
                <div role="resize"
                    onClick={event => event.preventDefault()}>&#8203;</div>
            </Draggable>
        </div>
    )
};


const SortableTable = SortableContainer(Table, { withRef: true });

const SortableTableHeaderCell = ({ ...props }: ITableHeaderCellProps) => <TableHeaderCell {...props} />;//SortableElement(({ ...props }: ITableHeaderCellProps) => <TableHeaderCell {...props} />);

class TableHeaderCellWrapper extends React.Component<{}, {}> {
    render() {
        return React.Children.only(this.props.children);
    }
}

const SortableTableHeaderCellWrapper = SortableElement(TableHeaderCellWrapper);

class TableHeaderRow extends React.Component<TableHeaderRowProps, {}> {
    render() {
        const {
            className,
            style,
            columns
        } = this.props;

        const sortableColumns = _.map(columns, (column, index) =>
            <SortableTableHeaderCellWrapper
                key={`foocol${index}`}
                index={index}>
                {column}
            </SortableTableHeaderCellWrapper>)

        return (
            <div className={className}
                style={style}
                role="row">
                {sortableColumns}
            </div>
        );
    }
}

const SortableTableHeaderRow = SortableContainer(TableHeaderRow, { withRef: true });
const SortableTableRowRenderer = SortableElement(defaultTableRowRenderer);

const rowRenderer = ({ ...props }) => <SortableTableRowRenderer collection={1} {...props} />;
const headerRendererCreator = (onResize: ({ dataKey: string, deltaX }) => void) => ({ ...props }: ITableHeaderCellProps) => <TableHeaderCell onResize={onResize} /*index={props.columnData.index} collection={0}*/ {...props} />;

const cellWrapperRenderer = ({ ...props }) => {
    return (
        <div
            {...props.a11yProps}
            key={`Header-Col${props.index}`}
            className={props.classNames}
            style={props.style}>
            {props.renderedHeader}
        </div>
    );
};

const headerRowRendererCreator = (moveColumn: (from: number, to: number) => void) => ({ ...props }) =>
    <SortableTableHeaderRow
        axis="x"
        lockAxis="x"
        helperClass="table-header-cell table-header-cell-dragged"
        distance={15}
        useDragHandle
        onSortEnd={({ oldIndex, newIndex }) => moveColumn(oldIndex, newIndex)}
        {...props} />;

const CustomTable = ({ ...props }) =>
    <SortableTable
        getContainer={wrappedInstance => ReactDOM.findDOMNode(wrappedInstance["Grid"])}
        rowRenderer={rowRenderer}
        {...props} />;

class AppContainer extends React.Component<IAppContainerProps, IAppContainerState> {
    constructor(props: IAppContainerProps) {
        super(props);

        this.state = {
            tableColumns: {
                "id": {
                    label: "Id",
                    dataKey: "id",
                    width: 100,
                    flexGrow: 0
                },
                "root": {
                    label: "Root",
                    dataKey: "root",
                    width: 100,
                    flexGrow: 0
                },
                "code": {
                    label: "Code",
                    dataKey: "code",
                    width: 100,
                    flexGrow: 0
                },
                "description": {
                    label: "Description",
                    dataKey: "description",
                    width: 300,
                    flexGrow: 1
                }
            },
            allTableColumns: [
                "id", "root", "code", "description"
            ]
        };
    }

    moveColumn(from: number, to: number) {
        const {
            allTableColumns
        } = this.state;

        let columns = arrayMove(allTableColumns, from, to);

        this.setState({
            allTableColumns: columns
        });
    }

    resizeColumn({ dataKey, deltaX }) {
        const {
            tableColumns
        } = this.state;

        const {
            width
        } = tableColumns[dataKey];

        tableColumns[dataKey].width = Math.max(10, width + deltaX);

        this.setState({
            tableColumns
        });
    }

    onHeaderClick(dataKey: string, event) {
        if (event.target.getAttribute("role") !== "resize") {
            const {
                sort,
                sortDirection
            } = this.props;

            sort(dataKey, sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
        }
    }

    render() {
        const {
            sortBy,
            sortDirection,
            rows,
            moveRow,
            sort
        } = this.props;

        const {
            tableColumns,
            allTableColumns
        } = this.state;

        const tableWidth = _.reduce<ITableColumnDefinition, number>(tableColumns, (res, data) => res + Number(data.width), 0);

        return (
            <div>
                <AutoSizer disableHeight>
                    {({ width }) =>
                        <CustomTable
                            className="table"
                            gridClassName="table-grid"
                            rowClassName={({ index }) => {
                                if (index === -1) {
                                    return "table-header-row";
                                } else {
                                    return "table-grid-row";
                                }
                            }}
                            width={tableWidth}
                            height={600}
                            headerHeight={30}
                            rowHeight={20}
                            rowCount={rows.length}
                            rowGetter={({ index }) => rows[index]}
                            axis="y"
                            lockAxis="y"

                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            overscanRowCount={30}
                            headerRowRenderer={headerRowRendererCreator((from, to) => this.moveColumn(from, to))}
                            onHeaderClick={({ columnData, dataKey, event }) => this.onHeaderClick(dataKey, event)}
                            onSortEnd={({ oldIndex, newIndex }) => moveRow(oldIndex, newIndex)}>
                            {
                                allTableColumns.map((column, index) =>
                                    <Column
                                        key={index}
                                        className="table-grid-row-cell"
                                        headerClassName="table-header-cell-wrapper"
                                        {...tableColumns[column]}
                                        columnData={{
                                            index,
                                            width: tableColumns[column].width
                                        }}
                                        headerRenderer={headerRendererCreator(({ dataKey, deltaX }) => this.resizeColumn({ dataKey, deltaX }))} />
                                )
                            }
                        </CustomTable>
                    }
                </AutoSizer>
            </div>
        );
    }
}

const tableSelector = (state: IState) => state.table;

const rowsSelector = createSelector(
    tableSelector,
    table => table.rows.allIds.map(id => table.rows.byId[id])
);

const mapStateToProps: MapStateToProps<IAppContainerStateProps, {}> = (state: IState) => ({
    sortBy: state.table.sortBy,
    sortDirection: state.table.sortDirection,
    rows: rowsSelector(state)
});

const mapDispatchToProps: MapDispatchToPropsFunction<IAppContainerDispatchProps, {}> = dispatch => ({
    moveRow: (from, to) => dispatch(TableActions.moveRow(from, to)),
    sort: (sortBy, direction) => dispatch(TableActions.sort(sortBy, direction))
});

export const App = connect<IAppContainerStateProps, IAppContainerDispatchProps, {}>(
    mapStateToProps,
    mapDispatchToProps
)(AppContainer);