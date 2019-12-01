import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionService } from '../../../services/session.service';

/**
 * Session Timeout component
 */
@Component({
  selector: 'app-session-timeout',
  templateUrl: './session-timeout.component.html',
  styleUrls: ['./session-timeout.component.scss']
})

export class SessionTimeoutComponent implements OnInit {

  /**
   * session countdown notifier
   */
  $countdown: Subject<string>;
  /**
   * Constructor
   * @param sessionService Session service instance
   */
  constructor(public sessionService: SessionService) { }

  /**
   * ngOnInit method to get the session countdown
   */
  ngOnInit() {
    this.$countdown = this.sessionService.$countDown;
  }

}
