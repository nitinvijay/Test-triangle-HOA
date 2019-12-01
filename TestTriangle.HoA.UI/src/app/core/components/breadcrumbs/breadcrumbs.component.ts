import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';
import { BreadCrumb } from '../../../shared/models/common.model';
import { RouterService } from '../../services/router.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit, OnDestroy, AfterViewChecked {

  public breadcrumbs: any = [];
  public prevBreadcrumbs: any = [];
  showBreadCrumb = true;
  private renderBreadCrumb = true;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private routerService: RouterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }
  ngOnInit() {
    /**
     * build breadcrumbs using activated route
     */
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        distinctUntilChanged(),
        map(event => this.buildBreadCrumb(this.activatedRoute.root))
      )
      .subscribe(res => {
        this.breadcrumbs = new Set(res);
      });
  }
  /**
   * Actual logic to build the breadcrumb
   * @param route Activated route for the page
   * @param url url param passed used during recursion
   * @param breadcrumbs breadcrumbs used to pass built up breadcrumb during recursion
   */
  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Array<BreadCrumb> = []
  ): Array<BreadCrumb> {

    if (!this.renderBreadCrumb) {
      if (this.prevBreadcrumbs && this.prevBreadcrumbs.length > 3) {
        // Enable clicking of 2nd Route param
        this.prevBreadcrumbs[2].disabled = false;
      }
      return this.prevBreadcrumbs;
    }
    const label = route.routeConfig
      ? route.routeConfig.data
        ? route.routeConfig.data['breadcrumb']
        : 'NoLabel'
      : 'Home';
    this.showBreadCrumb = true;
    const path = route.routeConfig ? route.routeConfig.path : '';
    const component = route.routeConfig ? route.routeConfig.component : 'Home';

    // In the routeConfig the complete path is not available,
    // so we rebuild it each time
    let nextUrl = `${url}${path}`;
    if (!nextUrl.endsWith('/')) {
      nextUrl += '/';
    }
    const breadcrumb = {
      label: label,
      url: nextUrl,
      disabled:
        component === '' || component === undefined || component === null
    };
    let newBreadcrumbs = [];
    // Remove double home breadcrumb and remove breadcrumbs,
    // who does not have label in the route data
    if (label === 'NoLabel' || label === 'hidden') {
      newBreadcrumbs = [...breadcrumbs];
    } else {
      newBreadcrumbs = [...breadcrumbs, breadcrumb];
    }
    if (route.firstChild) {
      // If we are not on our current path yet,
      // there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    // Disable the current page from breadcrumb
    newBreadcrumbs[newBreadcrumbs.length - 1].disabled = true;
    // Don't Show breadcrumb on home page
    if (newBreadcrumbs.length <= 1 || label === 'hideAll') {
      return [];
    }
    return newBreadcrumbs.filter((item, index) => newBreadcrumbs.findIndex(i => i.url === item.url) === index);
  }
  breadcrumbClick(breadcrumb: any) {
    if (breadcrumb.label === 'Home') {
      // TODO
    }

    const urlArr = breadcrumb.url.split('/');
    urlArr.splice(0, 1);
    urlArr.splice(urlArr.length - 1, 1);
    this.router.navigate(['/', ...urlArr], { skipLocationChange: true });
  }

  ngOnDestroy(): void {}
}
