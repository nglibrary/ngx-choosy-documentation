import { Component } from '@angular/core';
import * as f from 'feather-icons';
import {
  addresses,
  colors,
  products,
  universities,
  users
  } from './data';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  addresses: any[];
  colors: any[];
  products: any[];
  universities: any[];
  users: any[];

  ex5Event;
  addEv;
  es5IsOpen = false;
  fthr = f;
  menu = [];
  ngOnInit() {
    this.addresses = addresses;
    this.colors = colors;
    this.products = products;
    this.universities = universities;
    this.users = users;
    this.menu = [
      { name: 'Demo' },
      { name: 'Installation' },
      { name: 'Single select' },
      { name: 'Multi select' },
      { name: 'Button dropdown' },
      { name: 'Autocomplete' },
      { name: 'Configuration' },
      { name: 'Changelog' }
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
