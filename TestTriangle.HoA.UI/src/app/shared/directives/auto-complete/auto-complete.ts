import { Directive, ElementRef } from '@angular/core';

/**
 * Auto complete disable directive
 */
@Directive({
     selector: '[disableAutoComplete]'
})
export class DisableAutoComplete {
/**
 * Creates an instance of disable auto complete.
 * @param elRef
 */
constructor(elRef: ElementRef) {
       elRef.nativeElement.autocomplete = 'new-password';
    }
}
