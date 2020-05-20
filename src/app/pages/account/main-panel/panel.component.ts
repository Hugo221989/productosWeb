import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { TranslateService } from '@ngx-translate/core';
import { ProductsService } from '../../products-page/service/products.service';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
  language: string = "es";

  tabMenuItem: MenuItem[];
  activeItem: MenuItem;
  
  constructor(private productsService: ProductsService,
    public translate: TranslateService) { }

  ngOnInit(): void {
    this.getLanguageBrowser();
  }

  getLanguageBrowser(){
      this.language = this.productsService.getLanguageBrowser();  
      this.translate.stream('datos.cuenta').subscribe(data => {this.datosCuenta = data});
      this.translate.stream('pedidos').subscribe(data => {this.pedidos = data});
      this.setTabMenuItems();
  }

  setTabMenuItems(){
    setTimeout(() => {
      this.tabMenuItem = [
        {label: this.datosCuenta, icon: 'pi pi-user-edit', routerLink:'data'},
        {label: this.pedidos, icon: 'pi pi-sign-out', routerLink:'orders'}
      ];
      this.activeItem = this.tabMenuItem[0];
    }, 500);
  }
  datosCuenta: string;
  pedidos: string;

}
