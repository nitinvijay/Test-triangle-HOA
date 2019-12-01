import {
  Component,
  OnInit,
  AfterViewChecked,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  ChangeDetectorRef
} from '@angular/core';
import {
  FormCanDeactivate
} from '../../core/guards/form-can-deactivate';
import {
  NgForm,
  FormGroup,
  FormBuilder,
  AbstractControl,
  Validators,
  FormArray
} from '@angular/forms';
import {
  Customers, Ticket, CustomersTicket
} from '../customers.model';
import {
  Subscription
} from 'rxjs';
import {
  GlobalToasterService
} from '../../core/components/global-toaster/global-toaster.service';
import {
  GlobalConfirmationService
} from '../../core/components/global-confirmation/global-confirmation.service';
import {
  CustomersService
} from '../customers.service';
import {
  CommonDataService
} from '../../core/services/common-data.service';
import {
  FormGroupExtension,
  CommonValidator
} from '../../shared/utils/utils';
import {
  CommonUtility
} from '../../shared/utils/common.utility';
import {
  BaseResponse, DropdownModel
} from '../../shared/models/common.model';
import {
  IResolveEmit
} from '../../core/components/global-confirmation/global-confirmation.model';
import { GlobalToasterType } from 'src/app/core/components/global-toaster/global-toaster.model';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent extends FormCanDeactivate
implements OnInit, AfterViewChecked, OnDestroy {

  /**
   * Properties
   */
  maxTickets = 2;
  tickets: Ticket[] = [];
  customerId: number = -1
  manageTicketVisible: boolean = false;
  reloadTicketCustomer: boolean = false;
  registerForm: FormGroup;
  formSaveOperationInProgress = false;
  ticketsLoadInProgress = false;
  customerTitle: string;
  IsEditModeOn: boolean;
  saveFormErrors: string[] = [];
  saveTicketToServerFlag = false;
  countryList: DropdownModel[];
  subscriber: Subscription = new Subscription();

  /**
   * Input Output ViewChild
   */
  @Input()
  customer: Customers;
  @Output()
  AddFormCloseEvent = new EventEmitter < any > ();
  @Output()
  AddFormSaveMessageUpdatedEvent = new EventEmitter < any > ();
  @Output()
  DeleteCustomerFormEvent = new EventEmitter < any > ();
  @ViewChild('customerAddDiv', {
    static: false
  }) customerFormDiv: ElementRef;

  /**
   * Base class
   */
  @ViewChild('customerForm', {
    static: true
  })
  form: NgForm;
  confirmation: GlobalConfirmationService;
  canDeactivateCallback: Function;

  constructor(
    private commonDataService: CommonDataService,
    private toastService: GlobalToasterService,
    private confirmationService: GlobalConfirmationService,
    public formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private customersService: CustomersService,
    private toasterService: GlobalToasterService
  ) {
    super(true);
    this.confirmation = confirmationService;
    this.canDeactivateCallback = this.emitFormCloseEvent.bind(this);
  }

  ngOnInit() {
    const counrtySub = this.commonDataService.getCountries().subscribe(s => {
      this.countryList = s.data;
    });
    this.subscriber.add(counrtySub);
    if (!CommonUtility.isEmpty(this.customer)) {
      this.IsEditModeOn = true;
      this.customerTitle = 'Edit Customer';
      this.customerId = this.customer.customerId;
    } else {
      this.customerTitle = 'Add Customer';
    }
    const preLoadedValues = this.getCustomerPreFillData();
    this.registerForm = this.formBuilder.group({
      firstName: [{
          value: preLoadedValues.firstName,
          disabled: this.IsEditModeOn
        },
        [Validators.required, CommonValidator.ValidateWhitespaces]
      ],
      lastName: [preLoadedValues.lastName],
      address: [preLoadedValues.address],
      postalCode: [preLoadedValues.postalCode],
      city: [preLoadedValues.city],
      state: [preLoadedValues.state],
      country: [preLoadedValues.country],
      phone: [preLoadedValues.phone]
    });
    this.registerForm.addControl('tickets', new FormArray([]));
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  /**
   * Customer Section
   */
  saveCustomer() {
    FormGroupExtension.MarkFormGroupAsTouched(this.registerForm);
    ( this.registerForm.controls['tickets'] as FormArray).controls.forEach(f => {
      FormGroupExtension.MarkFormGroupAsTouched(f as FormGroup);
    });
    const isFormValid = this.registerForm.valid;
    this.saveFormErrors = [];
    if (isFormValid) {
      if (this.formSaveOperationInProgress) {} else {
        this.formSaveOperationInProgress = true;

        if (this.IsEditModeOn) {
          const saveObj = this.getSaveCustomerModelForUpdate();
          saveObj.customerId = this.customer.customerId;
          saveObj.firstName = this.customer.firstName;
          this.updateCustomer(saveObj);
        } else {
          const saveObj = this.getSaveCustomerModelForAdd();
          this.addCustomer(saveObj);
        }
      }
    }
  }

  onDeleteCustomer() {
    this.confirmationService
      .showConfirmationMsg(
        'Do want to delete customer',
        'Delete Customer',
        this.customer.firstName,
        'Delete'
      )
      .subscribe((confirm: IResolveEmit) => {
        if (confirm.resolved) {
          this.formSaveOperationInProgress = true;
          const subs = this.customersService
            .deleteCustomer(
              this.customer.customerId
            )
            .subscribe((res: BaseResponse<any>) => {
              this.formSaveOperationInProgress = false;
              if (res.success === true) {
                this.AddFormCloseEvent.emit();
                this.DeleteCustomerFormEvent.emit({ success: res.success });
              } else {
                this.DeleteCustomerFormEvent.emit({
                  success: res.success,
                  errors: res.errors
                });
              }

            });
          this.subscriber.add(subs);
        }
      });
  }
  /** Customer Section ends here */

  /** Ticket Section */
  addTicket() {
    this.tickets.push({} as Ticket);
  }

  removeTicket(index) {
    if (this.tickets && this.tickets.length > index) {
      this.tickets.splice(index, 1);
      (this.registerForm.controls['tickets'] as FormArray).removeAt(index);
      this.tickets = this.tickets.slice();
    }
  }

  setTicketSaveMessage(event: any) {
    let msg = '';
    let toasterType = GlobalToasterType.info;
    if (event.success) {
      if (event.isEdit) {
        msg = 'Ticket updated successfully.';
      } else {
        msg = 'Ticket added successfully.';
      }
      this.reloadTicketCustomer = true;
    } else {
      msg = `Something went with ticket ${event.isEdit ? 'update' : 'add'}, please contact administrator.`;
      toasterType = GlobalToasterType.danger;
    }
    this.toasterService.displayToastMessage(msg, toasterType);
  }

  addNewTicket() {
    this.manageTicketVisible = true;
  }

  manageTicketFormClosed() {
    this.manageTicketVisible = false;
  }

  /** Ticket Section Ends here */

  /**
   * Form methods Section
   * @param controlName
   */
  validateControl(controlName: string) {
    const control: AbstractControl = this.registerForm.controls[controlName];
    return !FormGroupExtension.Validate(control);
  }
  /** Form methods Section ends here */


  /**
   * Private methods
   */
  private getCustomerPreFillData(): Customers {
    if (this.IsEditModeOn) {
      const formData = {
        firstName: this.customer.firstName,
        lastName: this.customer.lastName,
        address: this.customer.address,
        phone: this.customer.phone,
        postalCode: this.customer.postalCode,
        city: this.customer.city,
        state: this.customer.state,
        country: this.customer.country
      };
      return formData as Customers;
    } else {
      const defaultValues = {
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        postalCode: '',
        city: '',
        state: '',
        country: ''
      };
      return defaultValues as Customers;
    }
  }

  private getSaveCustomerModelForAdd(): CustomersTicket {
    const customer: CustomersTicket = CommonUtility.trimObjectProperties(this.registerForm.value) as CustomersTicket;
    if (customer.tickets) {
      customer.tickets.forEach(f => {
        delete f.customerId;
        delete f.ticketId;
      });
    }
    return customer;
  }

  private getSaveCustomerModelForUpdate(): Customers {
    const customer: Customers = CommonUtility.trimObjectProperties(this.registerForm.value) as Customers;
    return customer;
  }

  private addCustomer(customer: CustomersTicket) {
    const subs = this.customersService
      .postCustomer(customer)
      .subscribe(data => {
        this.serverOperationHandle(
          data,
          customer.firstName,
          customer.lastName
        );
      });
    this.subscriber.add(subs);
  }

  private updateCustomer(
    customer: Customers
  ) {
    const subs = this.customersService
      .putCustomer(customer)
      .subscribe(data => {
        this.serverOperationHandle(
          data,
          customer.firstName,
          customer.lastName
        );
      });
    this.subscriber.add(subs);
  }

  private serverOperationHandle(
    data: BaseResponse < any > ,
    firstName,
    lastName
  ) {
    data = {
      success: true,
      errors: null
    } as BaseResponse < any > ;
    if (data.success === true) {
      this.AddFormCloseEvent.emit();
      this.AddFormSaveMessageUpdatedEvent.emit({
        success: data.success,
        isEdit: this.IsEditModeOn,
        firstName: firstName,
        lastName: lastName,
        errors: data ? data.errors : []
      });
    } else {
      this.saveFormErrors = data ? data.errors : [];
    }
    this.formSaveOperationInProgress = false;
  }
  /** Private methods Section Ends here */


  formCloseClicked() {
    super.canDeactivate();
  }

  emitFormCloseEvent() {
    this.AddFormCloseEvent.emit(this.IsEditModeOn && this.reloadTicketCustomer);
  }


  ngOnDestroy(): void {
    if (this.subscriber && this.subscriber.unsubscribe) {
      this.subscriber.unsubscribe();
    }
  }
}
