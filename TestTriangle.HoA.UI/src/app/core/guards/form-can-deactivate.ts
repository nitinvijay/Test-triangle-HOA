import {
  ComponentCanDeactivate
} from './component-can-deactivate';
import {
  NgForm
} from '@angular/forms';
import {
  GlobalConfirmationService
} from '../components/global-confirmation/global-confirmation.service';
import {
  IResolveEmit
} from '../components/global-confirmation/global-confirmation.model';
import {
  Subscription
} from 'rxjs';

export abstract class FormCanDeactivate extends ComponentCanDeactivate {
  isFromComponent: boolean = false;
  constructor(fromComponent: boolean = false) {
    super();
    this.isFromComponent = fromComponent;
  }
  abstract get form(): NgForm;
  abstract get confirmation(): GlobalConfirmationService;
  abstract get canDeactivateCallback(): Function;

  canDeactivate(): boolean {
    if (this.form !== undefined && this.form.touched) {
      const can = !this.form.dirty;
      if (this.isFromComponent) {
        if (can) {
          this.canDeactivateCallback();
        } else {
          const subs = this.confirmation.showConfirmationMsg(
            'You have unsaved changes. If you leave, your changes will be lost. Do you want to discard your changes?',
            'Unsaved Changes',
            '',
            'Discard Changes',
            'Continue Editing'
          ).subscribe((confirm: IResolveEmit) => {
            if (confirm.resolved) {
              this.canDeactivateCallback();
            }
            subs.unsubscribe();
          });
        }
      } else {
        return can;
      }
    } else {
      if (this.isFromComponent) {
        this.canDeactivateCallback();
      } else {
        return true;
      }
    }

  }
}
