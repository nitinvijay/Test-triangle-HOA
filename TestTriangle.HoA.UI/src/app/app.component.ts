import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AdalService } from 'adal-angular4';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'TestTriangleHoAUI';

  constructor(private adalService: AdalService, private router: Router) {
    this.adalService.init(environment.config);
    this.adalService.handleWindowCallback();
    if (this.adalService.userInfo.authenticated) {
      // this.router.navigate(['/Customers']);
    } else {
      this.adalService.login();
    }
  }
}
