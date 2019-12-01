import { Component, OnInit, Input, EventEmitter, Output, OnDestroy, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, AbstractControl, NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Ticket } from '../customers.model';
import { FormGroupExtension } from 'src/app/shared/utils/utils';
import { GlobalConfirmationService } from 'src/app/core/components/global-confirmation/global-confirmation.service';
import { CustomersService } from '../customers.service';
import { FormCanDeactivate } from 'src/app/core/guards/form-can-deactivate';
import { CommonUtility } from 'src/app/shared/utils/common.utility';
import { BaseResponse, DropdownModel } from 'src/app/shared/models/common.model';
import { IResolveEmit } from 'src/app/core/components/global-confirmation/global-confirmation.model';
import { CommonDataService } from 'src/app/core/services/common-data.service';

@Component({
  selector: 'app-manage-ticket',
  templateUrl: './manage-ticket.component.html',
  styleUrls: ['./manage-ticket.component.scss']
})
export class ManageTicketComponent extends FormCanDeactivate implements OnInit, OnDestroy, AfterViewChecked {

  /** Properties */
  ticketTitle: string;
  registerForm: FormGroup;
  formSaveOperationInProgress: boolean = false;
  isEditModeOn: boolean = false;
  saveFormErrors: string[] = [];
  subscriber = new Subscription();
  statusList: DropdownModel[];

  /** Input Output */
  @Input() isCustomerAdd: boolean = false;
  @Input() customerId: number = -1
  @Input() ticketIndex: number;
  @Input() ticketDetails: Ticket;
  @Input() ticketsArray: FormArray;
  @Output()
  AddFormCloseEvent = new EventEmitter < any > ();
  @Output()
  AddFormSaveMessageUpdatedEvent = new EventEmitter < any > ();
  @Output()
  DeleteTicketFormEvent = new EventEmitter < any > ();
  @Output() DeleteTicketEvent = new EventEmitter<any>();

  /**
   * Base class
   */
  @ViewChild('ticketForm', {
    static: false
  })
  form: NgForm;
  confirmation: GlobalConfirmationService;
  canDeactivateCallback: Function;

  constructor(public formBuilder: FormBuilder,
    private commonDataService: CommonDataService,
    private confirmationService: GlobalConfirmationService,
    private customersService: CustomersService,
    private cdr: ChangeDetectorRef) {
      super(true);
      this.confirmation = confirmationService;
      this.canDeactivateCallback = this.emitFormCloseEvent.bind(this);
    }

  ngOnInit() {
    const statusSub = this.commonDataService.getStatus().subscribe(s => {
      this.statusList = s.data;
    });
    this.subscriber.add(statusSub);
    this.ticketTitle = 'Edit Ticket';
    if (!this.ticketDetails) {
      this.ticketTitle = 'Add Ticket';
      this.ticketDetails = new Ticket();
    }
    this.registerForm = this.formBuilder.group({
      ticketId: [this.ticketDetails.ticketId],
      customerId: [this.ticketDetails.customerId],
      subject: [this.ticketDetails.subject, Validators.required],
      category: [this.ticketDetails.category, Validators.required],
      status: [this.ticketDetails.status, Validators.required],
      description: [this.ticketDetails.description, Validators.required],
      issueStartedOn: [this.ticketDetails.issueStartedOn]
    });
    if (this.ticketDetails.ticketId > 0 && !this.isCustomerAdd) {
      this.isEditModeOn = true;
    }
    if (this.ticketsArray) {
      this.ticketsArray.push(this.registerForm);
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getFormattedDate(): string {
    return CommonUtility._formatDate(new Date(this.ticketDetails.issueStartedOn), 'MM/dd/yyyy');
  }

  /**
   * Ticket Section
   */
  saveTicket() {
    FormGroupExtension.MarkFormGroupAsTouched(this.registerForm);
    const isFormValid = this.registerForm.valid;
    this.saveFormErrors = [];
    if (isFormValid) {
      if (this.formSaveOperationInProgress) {} else {
        this.formSaveOperationInProgress = true;
        const saveObj = this.getSaveTicketModel();
        if (this.isEditModeOn) {
          saveObj.ticketId = this.ticketDetails.ticketId;
          saveObj.customerId = this.ticketDetails.customerId;
          this.updateTicket(saveObj);
        } else {
          saveObj.customerId = this.customerId;
          this.addTicket(saveObj);
        }
      }
    }
  }

  deleteTicket() {
    this.confirmationService
    .showConfirmationMsg(
      'Do want to delete ticket',
      'Delete Ticket',
      this.ticketDetails.subject,
      'Delete'
    )
    .subscribe((confirm: IResolveEmit) => {
      if (confirm.resolved) {
        this.formSaveOperationInProgress = true;
        const subs = this.customersService
          .deleteTicket(
            this.ticketDetails.ticketId
          )
          .subscribe((res: BaseResponse<any>) => {
            this.formSaveOperationInProgress = false;
            if (res.success === true) {
              this.AddFormCloseEvent.emit();
              this.DeleteTicketFormEvent.emit({ success: res.success });
            } else {
              this.DeleteTicketFormEvent.emit({
                success: res.success,
                errors: res.errors
              });
            }

          });
        this.subscriber.add(subs);
      }
    });
  }
  /** Ticket Section ends here */

  /** Form Methods */
  validateControl(controlName: string) {
    const control: AbstractControl = this.registerForm.controls[controlName];
    return !FormGroupExtension.Validate(control);
  }
  /** Form Methods ends here */

  /**
   * Private methods Section
   */
  private addTicket(ticket: Ticket) {
    const subs = this.customersService
      .postTicket(ticket)
      .subscribe(data => {
        this.serverOperationHandle(
          data,
          ticket.ticketId,
          ticket.customerId
        );
      });
    this.subscriber.add(subs);
  }

  private updateTicket(
    ticket: Ticket
  ) {
    const subs = this.customersService
      .putTicket(ticket)
      .subscribe(data => {
        this.serverOperationHandle(
          data,
          ticket.ticketId,
          ticket.customerId
        );
      });
    this.subscriber.add(subs);
  }

  private getSaveTicketModel(): Ticket {
    const ticket: Ticket = < Ticket > CommonUtility.trimObjectProperties(this.registerForm.value);
    return ticket;
  }

  private serverOperationHandle(
    data: BaseResponse < any > ,
    customerId,
    ticketId
  ) {
    data = {
      success: true,
      errors: null
    } as BaseResponse < any > ;
    if (data.success === true) {
      this.AddFormCloseEvent.emit();
      this.AddFormSaveMessageUpdatedEvent.emit({
        success: data.success,
        isEdit: this.isEditModeOn,
        ticketId: ticketId,
        customerId: customerId,
        errors: data ? data.errors : []
      });
    } else {
      this.saveFormErrors = data ? data.errors : [];
    }
    this.formSaveOperationInProgress = false;
  }
  /** Private methods Section ends here */

  formCloseClicked() {
    super.canDeactivate();
  }

  emitFormCloseEvent() {
    this.AddFormCloseEvent.emit();
  }

  ngOnDestroy() {
    if (this.subscriber && this.subscriber.unsubscribe) {
      this.subscriber.unsubscribe();
    }
  }

}
