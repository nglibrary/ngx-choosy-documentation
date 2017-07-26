import { Component, OnInit } from '@angular/core';
import * as f from 'feather-icons';
import {
  addresses,
  colors,
  products,
  universities,
  users
} from '../../data';

@Component({
  selector: 'app-examples',
  templateUrl: './examples.component.html',
  styleUrls: ['./examples.component.scss']
})
export class ExamplesComponent implements OnInit {

  addresses: any[];
  colors: any[];
  products: any[];
  universities: any[];
  users: any[];
  foobar;

  ex5Event;
  addEv;
  es5IsOpen = false;
  fthr = f;
  menu = [];

  buttonMenu: any = [];
  ngOnInit() {
    this.addresses = addresses;
    this.colors = colors;
    this.products = products;
    this.universities = universities;
    this.users = users;

    this.buttonMenu = [
      { name: 'Dashboard', icon: 'cogs' },
      { name: 'Account', icon: 'user-circle-o' },
      { name: 'Messages', icon: 'envelope-open' },
      { name: 'Language', icon: 'globe' },
      { name: 'Logout', icon: 'sign-out' }
    ];

  }
  ngAfterViewInit() {

    this.fthr.replace();
  }
  ex5(event) {
    this.ex5Event = event;
  }
  addressEvent(event) {
    this.addEv = event;
  }
  openAddressDd($event) {
    console.log('open', this.addEv);
    this.addEv.actions.toggle();
  }

}
