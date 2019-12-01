import { Injectable, Injector } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ButtonType } from '../../shared/models/common.model';
import { GlobalConfirmationService } from '../components/global-confirmation/global-confirmation.service';
import { Config } from '../config/app-config';
import { AdalService } from 'adal-angular4';

/**
 * User session service
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  /**
   * session timeout timer
   */
  sessionTimeOutTimer: any;
  /**
   * warning timeout timer
   */
  warningTimeOutTimer: any;
 /**
  * Countdown timer interval
  */
  countdownInterval: any;
  /**
   * Session Timeout
   */
  sessionTimeOut;

  /**
   * Warning timeout
   */
  warningTimeOut;
  /**
   * countdown
   */
  countdown = 30;

  /**
   * Countdown subject
   */
  $countDown: Subject<string>;

  /**
   * Session status
   */
  sessionStatus: Subject<string>;

  /**
   * Session time
   */
  sessionTime = Config.sessionTimeOut;

  /**
   * Adal Service to get Token
   */
  adal: AdalService;

/**
 * Constructor to intialiize the timer
 * @param confirmationService global confirmation service
 * @param http http service
 */
  constructor(private confirmationService: GlobalConfirmationService, private http: HttpClient, private injector: Injector) {
    this.sessionTimeOut = this.sessionTime * 60 * 1000;
    this.warningTimeOut = this.sessionTimeOut - (this.countdown * 1000);
    this.countdown = 30;
    this.$countDown = new Subject<string>();
    this.sessionStatus = new Subject<string>();
    this.adal = this.injector.get(AdalService);
  }

  /**
   * Method to show countdown in session time out window
   */
  startCountdown() {
    this.countdown = 30;
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
      this.$countDown.next((--this.countdown).toString());
      }
    }, 1000
    );
  }

  /**
   * Method to emit logout status
   */
  logOff() {
    this.sessionStatus.next('CLOSE');
    this.adal.logOut();
  }

  /**
   * Method to start timer for session timeout
   */
  startTimer() {
    this.resetTimer();


    this.sessionTimeOutTimer = setTimeout(() => {
      this.logOff();
    }, this.sessionTimeOut);

    this.warningTimeOutTimer = setTimeout(() => {
      this.startCountdown();
      this.confirmationService.showConfirmationMsgWithDynamicComponent
      ('Session is about to expire soon', 'I am here', 'Log off', 'SessionTimeoutComponent')
      .forEach(observable =>
        observable.subscribe(event => {
          // Extend session by making a server call
          if (event.type === ButtonType.Ok) {
            this.startTimer();
            this.sessionStatus.next('RESET');
          }
          if (event.type === ButtonType.Cancel) {
            this.logOff();
          }
        }));
    }, this.warningTimeOut);
  }

   /**
    * Method to reset timer
    */
  resetTimer() {
    this.sessionTimeOut = this.sessionTime * 60 * 1000;
    this.warningTimeOut = this.sessionTimeOut - (this.countdown * 1000);

    if (this.sessionTimeOutTimer !== undefined) {
      clearTimeout(this.sessionTimeOutTimer);
    }
    if (this.warningTimeOutTimer !== undefined) {
      clearTimeout(this.warningTimeOutTimer);
    }
    if (this.countdownInterval !== undefined) {
      clearInterval(this.countdownInterval);
    }
  }
}
