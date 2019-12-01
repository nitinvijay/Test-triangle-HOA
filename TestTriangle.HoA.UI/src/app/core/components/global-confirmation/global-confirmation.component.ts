import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
  ChangeDetectorRef,
  TemplateRef
} from '@angular/core';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { SessionTimeoutComponent } from './session-timeout/session-timeout.component';
import { ButtonType } from '../../../shared/models/common.model';
import { NotImplementedComponent } from './not-implemented/not-implemented.component';
import { IResolveEmit, IConfirmEmit } from './global-confirmation.model';
import { GlobalConfirmationService } from './global-confirmation.service';

/**
 * Global confirmation component
 */
@Component({
  selector: 'app-global-confirmation',
  templateUrl: './global-confirmation.component.html',
  styleUrls: ['./global-confirmation.component.scss']
})
export class GlobalConfirmationComponent implements OnInit, OnDestroy {
  /**
   * Confirmation message
   */
  displayConfirmationMsg: boolean;
  /**
   * Confirmation message title
   */
  title: string;
  /**
   * Confirmation message dynamic component
   */
  dynamicComponent: any;
  /**
   * Confirmation message dynamic Id
   */
  dynamicId: any;

  /**
   * dynamic container
   */
  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: false })
  dynamicContainer;
  /**
   * Confirmation message
   */
  confirmationMsg: string;
  /**
   * Show Confirmation message subscriber
   */
  private showConfirmationSubScriber: any;

  /**
   * Resolve confirmation notifier
   */
  private _resolveConfirmation: Subject<IResolveEmit>;

  /**
   * Resolve Cancel notifier
   */
  private $resolveCancel: Subject<IResolveEmit>;
  /**
   * Confirmation message OK
   */
  ok: string;

  /**
   * Confirmation message Cancel
   */
  cancel: string;

  /**
   * Confirmation message template
   */
  template: TemplateRef<any>;

  /**
   * Confirmation message isWideCss Flag
   */
  isWideCss: boolean;

  /**
   * Confirmation message isLarge css flag
   */
  isLargeCss: boolean;

  /**
   * Confirmation message component
   */
  components = {
    SessionTimeoutComponent: SessionTimeoutComponent,
    NotImplementedComponent: NotImplementedComponent
  };

  /**
   * Constructor
   * @param confirmationService Global confirmation service
   * @param resolver component factory resolver
   * @param cdRef change detector
   */
  constructor(
    private confirmationService: GlobalConfirmationService,
    private resolver: ComponentFactoryResolver,
    private cdRef: ChangeDetectorRef
  ) {}

  /**
   * ngOnint
   */
  ngOnInit() {
    this.showConfirmationSubScriber = this.confirmationService.addToConfirmation.subscribe(
      (confirmation: IConfirmEmit) => {
        this.confirmationMsg = confirmation.message;
        this.dynamicId = confirmation.dynamicId;
        this.title = confirmation.title;
        this.displayConfirmationMsg = true;
        this._resolveConfirmation = confirmation.resolveConfirm;
        this.$resolveCancel = confirmation.resolveCancel;
        this.dynamicComponent = confirmation.dynamicComponent;
        this.ok = confirmation.ok;
        this.cancel = confirmation.cancel;
        this.template = confirmation.template;
        this.isWideCss = confirmation.isWideCss;
        this.isLargeCss = confirmation.isLargeCss;
        this.cdRef.detectChanges();
        if (confirmation.dynamicComponent != null) {
          const component = this.components[this.dynamicComponent];

          let factory: ComponentFactory<any>;
          factory = this.resolver.resolveComponentFactory(component);
          this.dynamicContainer.createComponent(factory);
        }
      }
    );
  }

  /**
   * Method to close global confirmation message
   */
  onClose() {
    const resolveEmit: IResolveEmit = {
      resolved: true,
      type: ButtonType.Cancel
    };
    this.displayConfirmationMsg = false;
    this.dynamicComponent = null;
    if (this.$resolveCancel !== undefined) {
      this.$resolveCancel.next(resolveEmit);
    }
  }

  /**
   * Method of confirm of global confirmation message
   */
  onConfirm() {
    const resolveEmit: IResolveEmit = {
      resolved: true,
      type: ButtonType.Ok
    };
    this.displayConfirmationMsg = false;
    this.dynamicComponent = null;
    if (this._resolveConfirmation !== undefined) {
      this._resolveConfirmation.next(resolveEmit);
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    if (this.showConfirmationSubScriber) {
      this.showConfirmationSubScriber.unsubscribe();
    }
  }
}
