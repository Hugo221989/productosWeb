import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.model';
import { actionSettingsBreadcrumbExist, actionSettingsNombreBreadcrumb } from 'src/app/settings/settings.actions';
import { ProductsService } from '../service/products.service';
import { Producto } from 'src/app/models/producto';
import { Observable } from 'rxjs';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {
  subCatUrl: string;

  products: Producto[] = [];
  selectedCities: string[] = [];
  selectedProduct: Producto = new Producto;

  displayDialog: boolean;
  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string = "nombre";
  sortOrder: number;

  textoBuscadorOvservable$: Observable<string>;
  textoBuscador: string = null;
  subCategoria: string = null;

  constructor(private router:Router,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private store: Store<{settings: SettingsState}>) { }

  ngOnInit() {
      //this.carService.getCarsLarge().then(cars => this.cars = cars);
      /* this.store.dispatch(actionSettingsBreadcrumbExist({
        hayBreadcrumbFinal: false
      })) */
       
      this.getUrlParams();
      this.store.dispatch(actionSettingsNombreBreadcrumb({
        nombreBreadcrumbFinal: null
      }))
      localStorage.setItem('nombreBreadcrumb', null);

      /*para el buscador*/
      this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
      this.textoBuscadorOvservable$.subscribe( (texto) => {
          this.textoBuscador = texto;
          if(this.textoBuscador != null && this.textoBuscador != ''){
            this.getProductList();
          }else{
            this.getProductListBySubCat();
          }
      })

      this.sortOptions = [
          {label: 'Valoraciones', value: 'estrellas'},
          {label: 'Precio', value: 'precio'},
          {label: 'Nombre', value: 'nombre'}
      ];  
  }

  getUrlParams(){
    this.subCatUrl = this.route.snapshot.paramMap.get("cat");
    this.subCategoria = this.subCatUrl;
  }

  getProductList(){
    this.productsService.getProductsList(this.textoBuscador).subscribe( data =>{
      this.products = data;
    })
  }

  getProductListBySubCat(){
    this.productsService.getProductsListBySubCat(this.subCategoria).subscribe( data =>{
      this.products = data;
    })
  }

  selectProduct(event: Event, product: Producto) {
      this.store.dispatch(actionSettingsBreadcrumbExist({
        hayBreadcrumbFinal: true
      }))
      this.store.dispatch(actionSettingsNombreBreadcrumb({
        nombreBreadcrumbFinal: product.nombre
      }))
      this.router.navigate(['products/detail', product.id]);
  }

  onSortChange(event) {
      let value = event.value;

      if (value.indexOf('!') === 0) {
          this.sortOrder = -1;
          this.sortField = value.substring(1, value.length);
      }
      else {
          this.sortOrder = 1;
          this.sortField = value;
      }
  }

  onDialogHide() {
      this.selectedProduct = null;
  }

}

