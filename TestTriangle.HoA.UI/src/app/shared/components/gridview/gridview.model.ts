
export enum EventType {
  RowExpanded = 0,
  Edit = 1,
  Delete = 2
}
export class BaseGridDataViewEvent {
  Type: EventType;
  Data: BaseGridDataView;
}
export class BaseGridDataView {
 type: string;
 index: number;
}

export class Columns {
  hasFilter: boolean;
  hasSort: boolean;
  header: string;
  sortDir: string = '';
}

export class ODataGrid {
  constructor() {
    this.Page = 1;
  }
  Page: number;
  PageSize: number;
  SortBy: string;
  SortByOrder: string;
  Filters: Filter[];
}

export class Filter {
  Field: string;
  Type: string;
  Value: any;
  Comparison: string;
}

export class GridDataView<T extends BaseGridDataView> {
  Headers: Array<Columns>;
  Body: Array<Array<string>>;
  Data: T[];
  CellFormatter: Formatter<T>;
  Page: number = 1;
  PageSize: number = 20;
  Total: number;
  hasChildGrid: boolean;
  hasEdit: boolean;
  hasDelete: boolean;
  oData: ODataGrid;
  onEdit: (event: BaseGridDataView, parentRowIndex: number) => any;
  onDelete: (event: BaseGridDataView, parentRowIndex: number) => any;
  childRowLoader: (row: BaseGridDataView, index: number) => Promise<GridDataView<BaseGridDataView>>;
  onODataChange: (oData: ODataGrid, parentRow: BaseGridDataView) => Promise<GridDataView<BaseGridDataView>>;
}

export class Formatter<T extends BaseGridDataView> {
  [header: string]: (header: string, data: T) => string;
}

export class Pagination {
  Page: number;
  Label: string;
  Active: boolean;

}
