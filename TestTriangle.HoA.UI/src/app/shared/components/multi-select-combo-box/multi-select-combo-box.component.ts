import {
  Component,
  HostListener,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  SimpleChanges,
  ViewChild,
  ElementRef,
  Inject,
  OnChanges,
  SimpleChange,
  AfterViewInit,
  Injector,
  AfterViewChecked,
  ViewContainerRef,
  OnDestroy
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  NG_VALIDATORS,
  FormControl,
  NgControl
} from '@angular/forms';
import {
  DOCUMENT
} from '@angular/common';

import {
  isNullOrUndefined
} from 'util';
import { CommonUtility } from '../../utils/common.utility';

/**
 * NO-OP
 */
const noop = () => {};

/**
 * Multi select combo box Component
 */
@Component({
  selector: 'app-multi-select-combo-box',
  templateUrl: './multi-select-combo-box.component.html',
  styleUrls: ['./multi-select-combo-box.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelectComboBoxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultiSelectComboBoxComponent),
      multi: true
    }
  ]
})
export class MultiSelectComboBoxComponent
implements ControlValueAccessor, OnInit, OnChanges, AfterViewInit, AfterViewChecked, OnDestroy {
  /**
   * Data  of multi select combo box component
   */
  public _data: any[] = [];
  /**
   * Originaldata  of multi select combo box component
   */
  public _originaldata: any[] = [];
  /**
   * Selected items of multi select combo box component
   */
  public selectedItems: any[] = [];
  /**
   * Determines whether dropdown open is
   */
  public isDropdownOpen = false;
  /**
   * Placeholder  of multi select combo box component
   */
  _placeholder = 'Select';
  /**
   * Filter  of multi select combo box component
   */
  public filter: {
    text: '';
  } = {
    text: ''
  };

  /**
   * Tab key of multi select combo box component
   */
  tabKey: boolean = false;

  /**
   * Shift key of multi select combo box component
   */
  shiftKey: boolean = false;
  /**
   * Server value rendered of multi select combo box component
   */
  private serverValueRendered = false;
  /**
   * View child of multi select combo box component
   */
  @ViewChild('searchBox', { static: false }) searchBox: ElementRef;

  /**
   * View child of multi select combo box component
   */
  @ViewChild('multiSelectBox', { static: false }) multiSelectBox: ElementRef;

  /**
   * View child of multi select combo box component
   */
  @ViewChild('dd', { static: true }) dd: ElementRef;

  /**
   * hasOptionGroup  of multi select combo box component
   */
  @Input() hasOptionGroup = false;

  /**
   * groupField  of multi select combo box component
   */
  @Input() groupField = 'group';

  /**
   * singleSelection  of multi select combo box component
   */
  @Input() singleSelection = true;

  /**
   * valueField  of multi select combo box component
   */
  @Input() valueField = 'value';

  /**
   * textField  of multi select combo box component
   */
  @Input() textField = 'display';

  /**
   * enableCheckAll  of multi select combo box component
   */
  @Input() enableCheckAll = false;


  /**
   * selectAllText  of multi select combo box component
   */
  @Input() selectAllText = 'Select All';
  /**
   * unSelectAllText  of multi select combo box component
   */
  @Input() unSelectAllText = 'UnSelect All';

  /**
   * allowSearchFilter  of multi select combo box component
   */
  @Input() allowSearchFilter = true;

  /**
   * limitSelection  of multi select combo box component
   */
  @Input() limitSelection = -1;

  /**
   * maxHeight  of multi select combo box component
   */
  @Input() maxHeight = 197;

  /**
   * clearSearchFilter  of multi select combo box component
   */
  @Input() clearSearchFilter = true;

  /**
   * itemsShowLimit  of multi select combo box component
   */
  @Input() itemsShowLimit = 9999999999;

  /**
   * searchPlaceholderText  of multi select combo box component
   */
  @Input() searchPlaceholderText = 'Search';

  /**
   * closeDropDownOnSelection  of multi select combo box component
   */
  @Input() closeDropDownOnSelection = true;

  /**
   * isLazyLoading  of multi select combo box component
   */
  @Input() isLazyLoading = false;
  /**
   * isSearchByValue  of multi select combo box component
   */
  @Input() isSearchByValue = false;
  /**
   * showLoader  of multi select combo box component
   */
  @Input() showLoader = true; // Flag to show loader, case: hide whem no data to be loaded in ddl AND NOT show loader
  /**
   * textAlignClassForMultiSelect  of multi select combo box component
   */
  @Input() textAlignClassForMultiSelect = '';
  /**
   * isSameValueSelected  of multi select combo box component
   */
  @Input() isSameValueSelected = false;

  /**
   * Clear filter enabled of multi select combo box component
   */
  @Input() clearFilterEnabled = true;

   /**
   * Written value of multi select combo box component
   */
  _writtenValue: string;
  /**
   * Determines whether propagated is
   */
  isPropagated: boolean = false;

  /**
   * Input  of multi select combo box component
   */
  @Input('value') _value: any;

  /**
   * Sets value
   */
  set value(val) {
    this._value = val;
    // if (this.value !== null) {
    this.onChange(this.value);
    // }
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  /**
   * Gets value
   */
  get value() {
    if (this.selectedItems && this.selectedItems.length > 0) {
      if (this.singleSelection) {
        if (this.complexGetter) {
          return this.selectedItems[0];
        } else {
          return this.selectedItems[0][this.valueField];
        }
      } else {
        if (this.complexGetter) {
          return this.selectedItems;
        } else {
          return this.selectedItems.map(v => v[this.valueField]);
        }
      }
    } else {
      return this.singleSelection ? null : [];
    }
  }
  /**
   * Loading  of multi select combo box component
   */
  @Input() Loading = true;

  /**
   * default Select  of multi select combo box component
   */
  @Input() defaultSelect = false;
  /**
   * complexGetter  of multi select combo box component
   */
  @Input() complexGetter = true;

  /**
   * Sets input
   */
  @Input()
  public set placeholder(value: string) {
    if (value) {
      this._placeholder = value;
    } else {
      this._placeholder = 'Select';
    }
  }

  /**
   * isdisabled  of multi select combo box component
   */
  @Input() isdisabled = false;
  /**
   * isAddAfterList  of multi select combo box component
   */
  @Input() isAddAfterList = false;
  /**
   * AddAfterText  of multi select combo box component
   */
  @Input() AddAfterText = '';
  /**
   * ActionField  of multi select combo box component
   */
  @Input() ActionField: string = '';


  /**
   * Sets input
   */
  @Input()
  public set data(value: Array < any > ) {
    if (this.Loading) {
      this.Loading = !this.isdisabled;
    }
    if (!value) {
      this._data = [];
    } else {
      const _items = value.filter((item: any) => {
        if (
          typeof item === 'string' ||
          (typeof item === 'object' &&
            item &&
            item[this.valueField] &&
            item[this.textField] &&
            (!this.hasOptionGroup || item[this.groupField]))
        ) {
          return item;
        }
      });
      this._data = _items;
      this.Loading = false;
    }
    this._originaldata = this.cloneData(this._data);
    this.setSelectedItems(true);
  }

  /**
   * onAddTemplate  of multi select combo box component
   */
  @Output('onAddTemplate')
  onAddTemplate: EventEmitter < any > = new EventEmitter < any > ();


  /**
   * Adds template click
   */
  AddTemplateClick() {
    this.onAddTemplate.emit();
  }

  /**
   * onItemAction  of multi select combo box component
   */
  @Output('onItemAction')
  onItemAction: EventEmitter < any > = new EventEmitter < any > ();

  /**
   * Determines whether item action click on
   * @param item
   * @param action
   */
  onItemActionClick(item: any, action: any) {
    this.onItemAction.emit([item, action]);
  }

  /**
   * onFilterChange  of multi select combo box component
   */
  @Output('onFilterChange')
  onFilterChange: EventEmitter < any > = new EventEmitter < any > ();

  /**
   * onFilterChange  of multi select combo box component
   */
  @Output('onSelect') onSelect: EventEmitter < any > = new EventEmitter < any > ();

  /**
   * onFilterChange  of multi select combo box component
   */
  @Output('onDeSelect') onDeSelect: EventEmitter < any > = new EventEmitter < any > ();

  /**
   * onSelectAll  of multi select combo box component
   */
  @Output('onSelectAll')
  onSelectAll: EventEmitter < Array < any >> = new EventEmitter < Array < any >> ();

  /**
   * onDeSelectAll  of multi select combo box component
   */
  @Output('onDeSelectAll')
  onDeSelectAll: EventEmitter < Array < any >> = new EventEmitter < Array < any >> ();

  /**
   * onSameSelect  of multi select combo box component
   */
  @Output('onSameSelect') onSameSelect: EventEmitter < any > = new EventEmitter < any > ();

  /**
   * Determines whether touched on
   */
  onTouched: () => void = noop;
  /**
   * Determines whether change on
   */
  private onChange: (_: any) => void = noop;

  /**
   * Control  of multi select combo box component
   */
  private control: FormControl;
  /**
   * Creates an instance of multi select combo box component.
   * @param cdr
   * @param document
   * @param injector
   * @param viewContainerRef
   */
  constructor(private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) public document: any,
    private injector: Injector,
    private viewContainerRef: ViewContainerRef) {}


  /**
   * after view init
   */
  ngAfterViewInit(): void {
    const ngControl: NgControl = this.injector.get(NgControl, null);
    if (ngControl) {
      // ngControl.valueAccessor = this;
      if (this.selectFirstValue) {
        this.control = ngControl.control as FormControl;
        if (this.control && this.control.setValue && typeof this.control.setValue === 'function') {
          this.control.setValue(this._value, {
            onlySelf: true,
            emitEvent: false
          });
        }
      }
    }

  }

  /**
   * after view checked
   */
  ngAfterViewChecked() {
    // this.cdr.detectChanges();
  }

  /**
   * on init
   */
  ngOnInit(): void {
    if (this.isdisabled) {
      this.Loading = false;
    }
  }
  /**
   * on changes
   * @param changes
   */
  ngOnChanges(changes: {
    [propKey: string]: SimpleChange
  }) {

  }

  /**
   * Shallows clone
   * @param obj
   * @returns clone
   */
  private shallowClone(obj): any[] {
    const clone = Object.create(Object.getPrototypeOf(obj));
    const props = Object.getOwnPropertyNames(obj);
    props.forEach(key => {
      const desc = Object.getOwnPropertyDescriptor(obj, key);
      Object.defineProperty(clone, key, desc);
    });
    return Object.values(clone);
  }

  /**
   * Marks for check
   */
  public markForCheck() {
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  /**
   * Sets selected items
   * @param [force]
   * @returns
   */
  setSelectedItems(force: boolean = false) {
    this.selectedItems = [];
    if (this._value !== undefined && this._value !== null &&
      ((typeof this._value === 'string' && this._value.length > 0) ||
        (typeof this._value === 'object' && this._value[this.valueField]) ||
        !CommonUtility._isObjEmpty(this._value))) {
      this._data = this.cloneData(this._originaldata);
      if (CommonUtility._isObjEmpty(this._data)) {
        return;
      }
      if (this.singleSelection) {
        if (typeof this._value !== 'object') {
          this.selectedItems = this._data.filter(
            f => f[this.valueField] == this._value
          );
        }
        if (
          typeof this._value === 'object' &&
          this._value &&
          this._value[this.valueField]
        ) {
          this.selectedItems = this._data.filter(
            f => f[this.valueField] == this._value[this.valueField]
          );
        }
      } else {
        if (this._value) {
          if (typeof this._value === 'string') {
            this._value = [this._value];
            this._writtenValue = this._value;
          }
          const takeValue = this.limitSelection > 0 ? this.limitSelection : this._value.length;
          this._value.splice(0, takeValue).forEach(v => {
            if (typeof v !== 'object') {
              this.selectedItems = this.selectedItems.concat(this._data.filter(
                f => f[this.valueField] == v
              ));
            }
            if (typeof v === 'object' && v && v[this.valueField]) {
              this.selectedItems = this.selectedItems.concat(
                this._data.filter(f => f[this.valueField] == v[this.valueField])
              );
            }
          });
        }
      }
      this.value = (this.value !== undefined && this.value !== null) ? this.value : this._writtenValue;
      this.selectFirstValue(force);
    } else if (this.serverValueRendered) {
      this.selectFirstValue(force);
    }
  }

  /**
   * Selects first value
   * @param [force]
   */
  selectFirstValue(force: boolean = false) {
    if (this.defaultSelect && this._data && this._data.length > 0 &&
      (!this.selectedItems || this.selectedItems.length === 0)) {
      if (!(this._value && this._writtenValue && this._value === this._writtenValue &&
          this._data.findIndex(f => f[this.valueField] == this._writtenValue) === -1)) {
        this.selectedItems = new Array < any > (this._data[0]);
        this._writeValue(this.value);
      } else if ((!this.value || this.value === null) && force) {
        this.selectedItems = new Array < any > (this._data[0]);
        this._writeValue(this.value);
      }
    }
  }

  /**
   * Determines whether dropdown focus on
   */
  onDropdownFocus() {
    if (this.singleSelection) {
      this.searchBox.nativeElement.focus();
      [].forEach.call(this.dd.nativeElement.querySelectorAll('.wk-dropdown-list ul.item2 li.selected'), function (li) {
        li.classList.remove('selected');
      });
    } else {
      this.multiSelectBox.nativeElement.focus();
      this.isDropdownOpen = true;
    }
  }

  /**
   * Determines whether item click on
   * @param $event
   * @param item
   * @returns
   */
  onItemClick($event: any, item: any) {
    if (this.isdisabled) {
      return false;
    }
    this.clearFilterEnabled = true;
    const found = this.isSelected(item);
    const allowAdd =
      this.limitSelection === -1 ||
      (this.limitSelection > 0 &&
        this.selectedItems.length < this.limitSelection);
    if (!found) {
      if (allowAdd) {
        this.addSelected(item);
      }
    } else if (!this.singleSelection) {
      this.removeSelected(item);
    } else if (found && this.singleSelection) {
      const textValue = (this.selectedItems && this.selectedItems.length > 0) ?
        this.selectedItems[0][this.textField] : '';
      this.searchBox.nativeElement.value = textValue;
    }
    if (this.isSameValueSelected) {
      this.onSameSelect.emit(item);
    }
    if (this.singleSelection && this.closeDropDownOnSelection) {
      this.clearFilter();
      this.closeDropdown();
    }
  }

  /**
   * Clones data
   * @param data
   * @returns data
   */
  private cloneData(data: any[]): any[] {
    // return JSON.parse(JSON.stringify(data));
    const clone = Object.create(Object.getPrototypeOf(data));
    const props = Object.getOwnPropertyNames(data);
    props.forEach(key => {
      const desc = Object.getOwnPropertyDescriptor(data, key);
      Object.defineProperty(clone, key, desc);
    });
    // return Object.values(clone);
    return Object.keys(clone).map(item => clone[item]);
  }

  /**
   * Clears filter
   */
  clearFilter() {
    this._data = this.cloneData(this._originaldata);
    // this.selectedItems = [];
    const textValue = (this.selectedItems && this.selectedItems.length > 0) ?
      this.selectedItems[0][this.textField] : '';
    this.searchBox.nativeElement.value = textValue;
    this._writeValue(this.value);
  }

  /**
   * Validate fn of multi select combo box component
   */
  validateFn: any = () => {};

  /**
   * Validates multi select combo box component
   * @param c
   * @returns
   */
  validate(c: FormControl) {
    return this.validateFn(c);
  }

  /**
   * Determines whether filter text focus on
   * @param $event
   */
  onFilterTextFocus($event) {
    $event.target.select();
    $event.target.defaultValue = '__focussed__';
    // this.clearFilterEnabled = false;
  }

  /**
   * Scrolls to center
   * @param list
   * @param selectedLi
   */
  scrollToCenter(list: any[], selectedLi: any) {
    selectedLi.scrollIntoView({
      behavior: 'auto',
      block: 'nearest',
      inline: 'start'
    });
    // const index = [].indexOf.call(list, selectedLi);
    // const listLength = list.length;
    // const ul = this.dd.nativeElement.querySelector('.wk-dropdown-list ul');
    // if (index < 4) { // Scroll To Top
    //   ul.scroll(0, 0);
    // } else if (listLength < index + 5) {
    //   ul.scroll(0, ul.scrollHeight);
    // } else {
    //   ul.scroll(0, ((index - 3) * 32.83));
    // }
  }


  // @HostListener('window:keydown', ['$event'])
  /**
   * Determines whether arrow keys on
   * @param $event
   * @param [isFromInput]
   */
  onArrowKeys($event, isFromInput = false) {
    if (isFromInput || this.isDropdownOpen) {
      const list = this.dd.nativeElement.querySelectorAll('.wk-dropdown-list ul.item2 li:not(.option-group)');
      if (list && list !== null && list.length > 0) {
        const selectedLi = this.dd.nativeElement.querySelector('.wk-dropdown-list ul.item2 li.selected');
        let element = < HTMLElement > {};
        switch ($event.which) {
          case 27:
            [].forEach.call(this.dd.nativeElement.querySelectorAll('.wk-dropdown-list ul.item2 li.selected'), function (li) {
              li.classList.remove('selected');
            });
            this.searchBox.nativeElement.blur();
            break;
          case 13:
            const index = [].indexOf.call(list, selectedLi);
            if (index > -1) {
              const selectedData = this._data[index];
              if (CommonUtility._isObjEmpty(this.selectedItems) ||
                (this.selectedItems[0][this.valueField] !== selectedData[this.valueField])) {
                this.selectedItems = [];
                this.selectedItems.push(selectedData);
                const textValue = selectedData[this.textField];
                this._writeValue(this.value);
                this.searchBox.nativeElement.value = textValue;
                this.isDropdownOpen = false;
                this.onSelect.emit(this.value);
              }
            }
            $event.preventDefault();
            $event.stopPropagation();
            break;
          case 40:
            this.isDropdownOpen = true;
            if (selectedLi && selectedLi !== null) {
              selectedLi.classList.remove('selected');
              const nextLi = selectedLi.nextElementSibling;
              if (nextLi && nextLi !== null) {
                nextLi.classList.add('selected');
                element = ( < HTMLElement > nextLi);
              } else {
                list[0].classList.add('selected');
                element = ( < HTMLElement > list[0]);
              }
            } else {
              list[0].classList.add('selected');
              element = ( < HTMLElement > list[0]);
            }
            this.scrollToCenter(list, element);
            break;
          case 38:
            this.isDropdownOpen = true;
            if (selectedLi && selectedLi !== null) {
              selectedLi.classList.remove('selected');
              const prevLi = selectedLi.previousElementSibling;
              if (prevLi && prevLi !== null) {
                prevLi.classList.add('selected');
                element = ( < HTMLElement > prevLi);
              } else {
                list[list.length - 1].classList.add('selected');
                element = ( < HTMLElement > list[list.length - 1]);
              }
            } else {
              list[list.length - 1].classList.add('selected');
              element = ( < HTMLElement > list[list.length - 1]);
            }
            this.scrollToCenter(list, element);
            break;
        }
      }
    }
  }

  /**
   * Determines whether key down on
   * @param $event
   */
  onKeyDown($event) {
    this.tabKey = $event.which === 9 ? true : false;
    this.shiftKey = $event.shiftKey;
    if (this.singleSelection && [40, 38, 27, 13].indexOf($event.which) !== -1) {
      this.onArrowKeys($event, true);
    }
  }

  /**
   * Determines whether select by text on
   * @param text
   */
  onSelectByText(text: string) {
    const data = this.cloneData(this._originaldata);
    const index =
      text.length > 0 ?
      data.findIndex(
        f =>
        f[this.textField]
        .trim()
        .toLowerCase() == text
      ) :
      -1;
    let textValue = (this.selectedItems && this.selectedItems.length > 0) ?
      this.selectedItems[0][this.textField] : '';
    if (index > -1) {
      this.selectedItems = [];
      const selectedData = data[index];
      this.selectedItems.push(selectedData);
      textValue = selectedData[this.textField];
    }
    this._writeValue(this.value);
    this._data = data;
    this.searchBox.nativeElement.value = textValue;
    this.isDropdownOpen = false;
  }

  /**
   * Determines whether filter text blur on
   * @param $event
   */
  onFilterTextBlur($event) {
    const text = $event.target.value ?
      $event.target.value.trim().toLowerCase() :
      '';
    if (Array.from(($event.relatedTarget || document.activeElement).classList).indexOf('wk-dropdown-list') !== -1
          && !this.tabKey) {
      const textValue = (this.selectedItems && this.selectedItems.length > 0) ?
        this.selectedItems[0][this.textField] : '';
      this.clearFilterEnabled = (text === textValue.trim().toLowerCase());
      return;
    }
    this.clearFilterEnabled = true;
    this.onSelectByText(text);
    if (this.shiftKey && this.tabKey) {
      this.shiftKey = false;
      this.tabKey = false;
      const selector = 'input, button, a, area, object, select, textarea, [contenteditable]';
      const component = this.dd.nativeElement.parentNode;
      let sibling = component;
      while (isNullOrUndefined(sibling.previousElementSibling)) {
        sibling = sibling.parentNode;
      }
      sibling = sibling.previousElementSibling;
      let siblingFound = false;
      while (!isNullOrUndefined(sibling) && !siblingFound) {
        if (sibling.matches(selector)) {
          siblingFound = true;
        } else if (sibling.querySelectorAll(selector).length > 0) {
          const s = sibling.querySelectorAll(selector);
          sibling = s[s.length - 1];
          siblingFound = true;
        } else {
          if (!isNullOrUndefined(sibling.previousElementSibling)) {
            sibling = sibling.previousElementSibling;
          } else {
            let hasParent = true;
            sibling = sibling.parentNode;
            let elemP = sibling.previousElementSibling;
            while (isNullOrUndefined(elemP) && !isNullOrUndefined(sibling) && !isNullOrUndefined(sibling.parentNode) && hasParent) {
              sibling = sibling.parentNode;
              hasParent = sibling.tagName.toLowerCase() !== 'body';
              if (hasParent) {
                elemP = sibling.previousElementSibling;
              }
            }
            sibling = elemP;
          }
        }
      }
      if (sibling && sibling !== null && sibling.focus) {
        sibling.focus();
      }
    }
  }

  /**
   * Determines whether filter text change on
   * @param $event
   * @returns
   */
  onFilterTextChange($event) {
    if ($event.target === ($event.relatedTarget || document.activeElement)) {
      const searchText = $event.target.value ?
        $event.target.value.trim().toLowerCase() :
        '';
      if ($event.target.defaultValue === '__focussed__' && searchText === '') {
        return false;
      }
      this.clearFilterEnabled = false;
      if (this.isLazyLoading) {
        this.onFilterChange.emit($event);
      } else {
        const data = this.cloneData(this._originaldata);

        this._data =
          searchText.length > 0 ? (this.isSearchByValue ?
            data.filter(
              f =>
              f[this.textField]
              .trim()
              .toLowerCase()
              .indexOf(searchText) > -1 ||
              f[this.valueField]
              .trim()
              .toLowerCase()
              .indexOf(searchText) > -1
            ) :
            data.filter(
              f =>
              f[this.textField]
              .trim()
              .toLowerCase()
              .indexOf(searchText) > -1
            )) :
          data;
        this.isDropdownOpen = true;
      }
    }
  }
  /**
   * Writes value
   * @param value
   */
  _writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Writes value
   * @param value
   */
  writeValue(value: any): void {
    if (this.serverValueRendered) {
      this._writtenValue = value;
    }
    this.serverValueRendered = true;
    this._writeValue(value);
    this.setSelectedItems();
    if (this.searchBox && this.searchBox.nativeElement) {
      const textValue = (this.selectedItems && this.selectedItems.length > 0) ?
        this.selectedItems[0][this.textField] : '';
      this.searchBox.nativeElement.value = textValue;
    }
  }

  // Allows Angular to disable the input.
  /**
   * Sets disabled state
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.isdisabled = isDisabled;
  }

  // From ControlValueAccessor interface
  /**
   * Registers on change
   * @param fn
   */
  registerOnChange(fn: any): void {
    if (!this.isPropagated) {
      this.onChange = fn;
      this.isPropagated = true;
    }
  }

  // From ControlValueAccessor interface
  /**
   * Registers on touched
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // From Validator interface
  /**
   * Registers on validator change
   * @param fn
   */
  registerOnValidatorChange(fn: any): void {

  }

  // Set touched on blur
  /**
   * Hosts listener
   */
  @HostListener('blur')
  public onblur() {
    this.closeDropdown();
    if (this.onTouched) {
      this.onTouched();
    }
  }

  /**
   * Tracks by fn
   * @param index
   * @param item
   * @returns
   */
  trackByFn(index, item) {
    return item[this.valueField];
  }

  /**
   * Determines whether selected is
   * @param clickedItem
   * @returns
   */
  isSelected(clickedItem: any) {
    let found = false;
    this.selectedItems.forEach(item => {
      if (clickedItem[this.valueField] == item[this.valueField]) {
        found = true;
      }
    });
    return found;
  }

  /**
   * Determines whether limit selection reached is
   * @returns true if limit selection reached
   */
  isLimitSelectionReached(): boolean {
    return this.limitSelection === this.selectedItems.length;
  }

  /**
   * Determines whether all items selected is
   * @returns true if all items selected
   */
  isAllItemsSelected(): boolean {
    return this._data && this._data.length === this.selectedItems.length;
  }

  /**
   * Shows button
   * @returns true if button
   */
  showButton(): boolean {
    if (!this.singleSelection) {
      if (this.limitSelection > 0) {
        return false;
      }
      return true;
    } else {
      // should be disabled in single selection mode
      return false;
    }
  }

  /**
   * Items show remaining
   * @returns show remaining
   */
  itemShowRemaining(): number {
    return this.selectedItems.length - this.itemsShowLimit;
  }

  /**
   * Adds selected
   * @param item
   */
  addSelected(item: any) {
    if (this.singleSelection) {
      this.selectedItems = [];
      this.selectedItems.push(item);
    } else {
      this.selectedItems.push(item);
    }
    this._writeValue(this.value);
    // if (this.onChange) {
    //   this.onChange(this.value);
    // }

    this.onSelect.emit(this.value);
  }

  /**
   * Removes selected
   * @param itemSel
   */
  removeSelected(itemSel: any) {
    this.selectedItems.forEach(item => {
      if (itemSel[this.valueField] == item[this.valueField]) {
        this.selectedItems.splice(this.selectedItems.indexOf(item), 1);
      }
    });
    this._writeValue(this.value);
    // if (this.onChange) {
    //   this.onChange(this.value);
    // }
    this.closeDropdown();
    this.onDeSelect.emit(this.value);
  }


  /**
   * Toggles dropdown
   * @param evt
   * @param [open]
   * @returns
   */
  toggleDropdown(evt, open ? : boolean) {
    evt.preventDefault();
    if (this.singleSelection) {
      this.searchBox.nativeElement.defaultValue = '';
    }
    if (this.isdisabled && this.singleSelection) {
      return;
    }
    if (this.Loading && this.singleSelection) {
      return;
    }
    if ((evt.target || evt.srcElement).classList.contains('k-i-close')) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = open ? true : !this.isDropdownOpen;
    }
    if (this.cdr) {
      this.cdr.markForCheck();
    }
  }

  /**
   * Closes dropdown
   */
  closeDropdown() {
    if (!this.clearFilterEnabled) {
      this.clearFilterEnabled = true;
      const text = this.searchBox.nativeElement.value ?
      this.searchBox.nativeElement.value.trim().toLowerCase() :
      '';
      this.onSelectByText(text);
    }
    this.isDropdownOpen = false;
    // clear search text
    if (this.clearSearchFilter) {
      this.filter.text = '';
    }
  }

  /**
   * Toggles select all
   * @returns
   */
  toggleSelectAll() {
    if (this.isdisabled) {
      return false;
    }
    if (!this.isAllItemsSelected()) {
      this.selectedItems = this._data.slice();
      this.onSelectAll.emit(this.value);
    } else {
      this.selectedItems = [];
      this.onDeSelectAll.emit(this.value);
    }
    this._writeValue(this.value);
  }

  /**
   * on destroy
   */
  ngOnDestroy() {
    this.onChange = noop;
    this.onTouched = noop;
  }
}
