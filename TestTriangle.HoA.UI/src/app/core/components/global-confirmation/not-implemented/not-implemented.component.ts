import { Component, OnInit, Input } from '@angular/core';

/**
 * Not implemented component
 */
@Component({
  selector: 'app-not-implemented',
  templateUrl: './not-implemented.component.html',
  styleUrls: ['./not-implemented.component.scss']
})
export class NotImplementedComponent implements OnInit {

  /**
   * Feedback link to open on click of feedback click
   */
  // tslint:disable-next-line:no-input-rename
  @Input('FeedbackLink') FeedbackLink = '';

  /**
   * Constructor
   */
  constructor() { }

  /**
   * ngOnInit
   */
  ngOnInit() {

  }

  /**
   * Method to handle feedback click
   */
  feedback(): any {
    window.open(this.FeedbackLink);
  }

}
