import { Component, OnInit, OnDestroy } from '@angular/core';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { AccountService } from '../service/account.service';
import { TranslateService } from '@ngx-translate/core';
import { User } from 'src/app/models/user';
import { ProductsService } from '../../products-page/service/products.service';
import { Observable, Subscription } from 'rxjs';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { SettingsState } from 'src/app/settings/settings.model';
import { Store, select } from '@ngrx/store';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit, OnDestroy {
  language: string = "es";

  pedidos: Pedido[] = [];
  selectedPedido: Pedido;
  selectedPedidoFecha: Date;
  productos: Producto[] = [];
  displayDialog: boolean;
  textoBuscadorOvservable$: Observable<string>;
  textoBuscador: string = null;
  contenedorBusquedaProducto: boolean = false;
  private subscription: Subscription[] = [];
  
  constructor(private accountService: AccountService,
              private productsService: ProductsService,
              public translate: TranslateService,
              private store: Store<{settings: SettingsState}>) { }

  cols: any[];

  ngOnInit(): void {

    this.getLanguageBrowser();
    this.manageBuscadorSuperior();
    this.getOrders();
  }

  getOrders(){
    let usuario: User;
    let idUsuario: number;
    if(sessionStorage.getItem('auth-user')){
      usuario = JSON.parse(sessionStorage.getItem('auth-user'));
      idUsuario = usuario.id;
    }
    
    this.accountService.getOrders(idUsuario).subscribe( data => {
      this.pedidos = data;
    })
  }

  onRowSelect(event) {
    this.selectedPedidoFecha = this.selectedPedido.fechaPedido;
    this.productos = this.selectedPedido.productos;
    this.displayDialog = true;
}

  getLanguageBrowser(){
    this.language = this.productsService.getLanguageBrowser();
    }

    manageBuscadorSuperior(){
    /*para el buscador*/
    this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
    this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
        this.textoBuscador = texto;
        if(this.textoBuscador != null && this.textoBuscador != ''){
          this.contenedorBusquedaProducto = true;
        }else{
          this.contenedorBusquedaProducto = false;
        }
    }))
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}
