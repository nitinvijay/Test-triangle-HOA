import { Component, OnInit, ViewChildren, QueryList, ViewContainerRef, ElementRef,
   ViewChild, Input, ComponentFactoryResolver,  AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { GridDataView, BaseGridDataView,  Pagination, Filter, ODataGrid, Columns } from './gridview.model';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-gridview',
  templateUrl: './gridview.component.html',
  styleUrls: ['./gridview.component.scss']
})
export class GridviewComponent implements OnInit, OnChanges, AfterContentInit {
  currentPage: number = 1;
  totalPages: number = 1;
  pagingData: Pagination[];
  pagintationItems: number = 5;
  @Input('pageSetter')
  set pageSetter(value) {
    this.setPage(value, true);
  }
  @Input() parentRowIndex: number = -1;
  @Input() parentRowData: BaseGridDataView;
  @Input() gridData: GridDataView<BaseGridDataView>;
  @ViewChildren('childCompContainer', { read: ViewContainerRef })
  public widgetTargets: QueryList<ViewContainerRef>;
  @ViewChild('historyTable', {static: false}) historyTable: ElementRef;
  @Input() isDataLoading: boolean = true;
  @Input() rowExpander: Subject<BaseGridDataView> = new Subject<BaseGridDataView>();

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.gridData && this.gridData) {
      this.currentPage = this.gridData.Page;
    }
    if (changes.isDataLoading) {
      this.setPage(this.currentPage, true);
    }
  }

  ngOnInit() {
    this.rowExpander.subscribe(s => {
      this.rowExpander_dynamic_Clicked(s, s.index, false);
    });
  }

  ngAfterContentInit() {
    // this.childGrids.changes.subscribe(c => console.log(c));
  }

  setPage(page: number, force: boolean = false) {
    if (this.currentPage !== page || force) {
      const scope = this;
      this.currentPage = page;
      this.totalPages = Math.ceil(this.gridData.Total / this.gridData.PageSize);
      if (this.currentPage > 0 && this.currentPage <= this.totalPages) {
        if (this.totalPages > this.pagintationItems) {
          const halfItems = (this.pagintationItems - 1) / 2;
          let startIndex = this.currentPage - halfItems;
          if (startIndex < 1) {
            startIndex = 1;
          } else if ((startIndex + this.pagintationItems) > this.totalPages) {
            startIndex = (startIndex - ((startIndex + this.pagintationItems) - this.totalPages)) + 1;
          }
          if (startIndex < 1) {
            startIndex = 1;
          }
          const endIndex = startIndex + this.pagintationItems;
          const pageItems = [];
          for (let i = 1; i <= this.totalPages; i++) {
            pageItems.push(i);
          }
          this.pagingData = pageItems.slice(startIndex - 1, endIndex - 1).map(m => <Pagination> {
            Label: m,
            Page: m,
            Active: scope.currentPage === m
          });
        } else {
          const pageItems = [];
          for (let i = 1; i <= this.totalPages; i++) {
            pageItems.push(i);
          }
          this.pagingData = pageItems.map(m => <Pagination> {
            Label: m,
            Page: m,
            Active: scope.currentPage === m
          });
        }
      } else {
        this.currentPage = 1;
      }
      if (!force) {
        this.setUpFilters();
        if (this.gridData.oData.Page !== this.currentPage) {
          this.gridData.oData.Page = this.currentPage;
          this.oDataChange();
        }
      }
    }
  }

  oDataChange() {
    const scope = this;
    scope.isDataLoading = true;
    this.gridData.onODataChange(this.gridData.oData, this.parentRowData).then(data => {
      scope.gridData = data;
      scope.isDataLoading = false;
    });
  }

  setUpFilters() {
    // if (!this.gridData.oData) {
    //   this.gridData.oData = new ODataGrid();
    //   this.gridData.Page = this.currentPage;
    //   this.gridData.oData.Filters = new Array<Filter>();
    // }
   }

  onSort(col: Columns) {
    this.setUpFilters();
    col.sortDir = col.sortDir === 'asc' ? 'desc' : 'asc';
    this.gridData.oData.SortBy = col.header;
    this.gridData.oData.SortByOrder = col.sortDir;
    this.oDataChange();
  }

  clearFilter(filter: Filter) {
    this.setUpFilters();
    const filterIndex = this.gridData.oData.Filters.findIndex(f => f.Field === filter.Field);
    if (filterIndex !== -1) {
      this.gridData.oData.Filters.splice(filterIndex, 1);
      this.oDataChange();
    }
  }


  onFilter(filter: Filter) {
    this.setUpFilters();
    this.gridData.oData.Filters.push(filter);
    this.oDataChange();
  }


  onEdit(data: BaseGridDataView) {
    if (this.gridData.hasEdit) {
      this.gridData.onEdit(data, this.parentRowIndex);
    }
  }

  onDelete(data: BaseGridDataView) {
    if (this.gridData.hasDelete) {
      this.gridData.onDelete(data, this.parentRowIndex);
    }
  }

  rowExpander_dynamic_Clicked(
    data: BaseGridDataView,
    rowIndex: number,
    isLoaded: boolean
  ) {
    if (!isLoaded) {
      if (this.gridData.childRowLoader) {
        const target = this.widgetTargets.toArray()[rowIndex];
        const factory = this.componentFactoryResolver.resolveComponentFactory(GridviewComponent);
        target.clear();
        const cmpRef = target.createComponent(factory);
        cmpRef.instance.isDataLoading = true;
        this.gridData.childRowLoader(data, rowIndex).then(childData => {
          cmpRef.instance.gridData = childData;
          cmpRef.instance.isDataLoading = false;
          cmpRef.instance.parentRowIndex = rowIndex;
          cmpRef.instance.parentRowData = data;
          cmpRef.instance.pageSetter = 1;
        });
      }
    }
  }

}
