import { Component, OnInit } from '@angular/core';
import { AdalService } from 'adal-angular4';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  UserName: string;
  constructor(private adalService: AdalService) { }

  ngOnInit() {
    this.UserName = this.adalService.userInfo.userName;
  }

  bannerClick() {

  }

  /**
   * Method to emit logout status
   */
  logOff() {
    this.adalService.logOut();
  }

}
