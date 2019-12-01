import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  menuVisibility = false;

  constructor() { }

  ngOnInit() {
  }

  showMenu() {
    this.menuVisibility = true;
  }

  hideMenu() {
    this.menuVisibility = false;
  }

}
