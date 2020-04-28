import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  tabMenuItem: MenuItem[];
  activeItem: MenuItem;
  
  constructor() { }

  ngOnInit(): void {
    this.tabMenuItem = [
      {label: 'Datos de la cuenta', icon: 'pi pi-user-edit', routerLink:'data'},
      {label: 'Pedidos', icon: 'pi pi-sign-out', routerLink:'orders'}
  ];
  this.activeItem = this.tabMenuItem[0];

  }

}
