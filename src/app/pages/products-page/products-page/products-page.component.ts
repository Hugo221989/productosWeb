import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Router, ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.model';
import { actionSettingsBreadcrumbExist, actionSettingsBuscador, actionSettingsCambiarProductoId } from 'src/app/settings/settings.actions';
import { ProductsService } from '../service/products.service';
import { Producto } from 'src/app/models/producto';
import { Observable, Subscription } from 'rxjs';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { Categoria, SubCategoria, CategoriaPadre } from 'src/app/models/categoria';
import { TreeNode, MessageService } from 'primeng/api';
import { CategoriaService } from '../service/categoria.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  providers: [
    MessageService
  ]
})

export class ProductsPageComponent implements OnInit, OnDestroy {
  language: string = "es";

  catPadreUrl: string;
  subCatUrl: string;
  catUrl: string;

  products: Producto[] = [];
  productsClone: Producto[] = [];
  selectedProduct: Producto = new Producto;

  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string = "nombre";
  sortOrder: number;

  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  textoBuscador: string = null;
  subCategoriaText: string = null;

  primerNivelTree: TreeNode[] = [];
  segundoNivelTree: TreeNode[] = [];
  tercerNivelTree: TreeNode[] = [];
  selectedMenuNode: TreeNode;
  treeMenuDisplay: boolean = true;

  categoriaPadre: CategoriaPadre;
  categoria: Categoria[] = [];
  subCategoria: SubCategoria[] = [];
  rangePriceValues: number[] = [0,100];

  blockedDocument: boolean = true;
  productLoaded: Promise<boolean>;

  constructor(private router:Router,
              private productsService: ProductsService,
              private route: ActivatedRoute,
              private categoriaService: CategoriaService,
              private store: Store<{settings: SettingsState}>,
              public translate: TranslateService) { }

  ngOnInit() {
      this.getLanguageBrowser();
      this.getUrlParams();
      this.getSessionCatUrl();
      this.getCategoriaPadre();
      this.getFiltroPriceSession();
      this.productsService.cambiarBreadcrumb(null, null);
      localStorage.setItem('nombreBreadcrumb', null);
      localStorage.setItem('nombreBreadcrumbEng', null);
      /*para el buscador*/
        this.manageBuscadorSuperior();
      this.filtrarPorPrecio();
      this.unblockScreen();
      this.sortOptionsMethod();
  }

  getLanguageBrowser(){
  this.language = this.productsService.getLanguageBrowser();
  }

  getUrlParams(){
    this.catPadreUrl = this.route.snapshot.paramMap.get("catPadre");
    this.subCatUrl = this.route.snapshot.paramMap.get("subcat");
    this.subCategoriaText = this.subCatUrl;

    this.catUrl = this.route.snapshot.paramMap.get("cat");
  }

  manageBuscadorSuperior(){
    /*para el buscador*/
    this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
    this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
        this.textoBuscador = texto;
        if(this.textoBuscador != null && this.textoBuscador != ''){
          this.getProductList();
        }else if('nutricion' == this.catUrl || 'alimentacion' == this.catUrl || 'promociones' == this.catUrl){
          this.getProductListByCategoriaPadre();
        }else if(this.subCategoriaText != null && this.subCategoriaText != '' && this.subCategoriaText != 'all'){
          setTimeout(() => {
            this.getProductListBySubCat(this.subCategoriaText);
          }, 300);
        }else{
          this.getProductsByCat(this.catUrl);
        }
    }))
  }

  getProductList(){
    this.productsService.getProductsList(this.textoBuscador).subscribe( data =>{
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    })
  }
  getProductListBySubCat(cat: string){
    this.productsService.getProductsListBySubCat(cat).subscribe( data =>{
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    });
    this.selectLateralCurrentNode(this.catUrl, this.subCategoriaText);
    if(cat != null){console.log("MODULO: ",this.categoriaPadre);
      this.router.navigate([this.categoriaPadre.modulo, this.catPadreUrl, this.catUrl, this.subCategoriaText]);
    }
  }
  getProductsByCat(cat: string){
    this.productsService.getProductsListByCat(cat).subscribe( data =>{
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    })
    this.selectLateralCurrentNode(this.catUrl, null);
    let subCat = "all";
    this.catUrl = cat;
    this.subCategoriaText = null;
    if(this.catUrl != null){
      this.router.navigate([this.categoriaPadre.modulo, this.catPadreUrl, cat, subCat]);
    }
    
  }
  getProductListByCategoriaPadre(){
    this.productsService.getProductsListByCatPadre(this.productsService.ConvertStringToNumber(this.catPadreUrl)).subscribe( data => {
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    })
    this.subCategoriaText = "all";
    this.selectLateralCurrentNode(this.catUrl, 'all');
  }

  selectProductDetail(event: Event, product: Producto) {
      let categoriaPadre;
      let categoriaPadreId;
      this.store.dispatch(actionSettingsBreadcrumbExist({
        hayBreadcrumbFinal: true
      }))
      this.productsService.cambiarBreadcrumb(product.nombre, product.nombreEng);
      if(this.subCategoriaText == null){
        this.subCategoriaText = 'all';
        window.sessionStorage.setItem('categoria', this.catUrl);
      }
      this.productsService.getCatSubCatProduct(product.id).subscribe(data => {
        categoriaPadre = data.categoriaPadreModulo;
        categoriaPadreId = data.categoriaPadreId;
        this.catUrl = data.categoriaKey;
        this.subCatUrl = data.subCategoriaKey 
        /*BUSCAMOS CAT Y SUBCAT PARA COLOCAR BIEN LA URL*/
        console.log("BUCLE?");
        this.router.navigate([categoriaPadre, categoriaPadreId, this.catUrl , this.subCatUrl, 'detail', product.id]);
      })
      
      this.store.dispatch(actionSettingsCambiarProductoId({
        productoId: product.id
      }))
      setTimeout(() => {
        this.store.dispatch(actionSettingsBuscador({
          buscador: null
        })) 
        this.reloadPage();
      }, 100);
  }

  reloadPage() {
    window.location.reload();
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

  getCategoriaPadre(){
    this.categoriaService.getCategoriaPadre(this.productsService.ConvertStringToNumber(this.catPadreUrl)).subscribe( data => {
      this.categoriaPadre = data;
      this.getSubCatsByCat(this.catUrl);
    })
  }

  getSubCatsByCat(selectedCat: string){
    /*INICIALIZAMOS LOS NIVELES DE NODOS*/
    this.primerNivelTree = [];
    this.segundoNivelTree = [];
    this.tercerNivelTree = [];

    let labelCatPadre: string;
    if(this.categoriaPadre != null){
        if(this.language == "en"){
            labelCatPadre = this.categoriaPadre.nombreEng;
        }else{
            labelCatPadre = this.categoriaPadre.nombre;
        }

      for(let cat of this.categoriaPadre.categoria){ 
        let catNode: TreeNode;
        let labelCat: string;
        if(this.language == "en"){
          labelCat = cat.nombreEng;
        }else{
          labelCat = cat.nombre;
        }
        
        /*SI ES LA CATEGORIA SELECIONADA AÑADIMOS LAS SUBCATEGORIAS SOLO DE ESA*/
        if(cat.key == selectedCat){
          let subCatNode: TreeNode;
          let labelSubcat: string;
          for(let subCat of cat.subCategoria){
            if(this.language == "en"){
              labelSubcat = subCat.nombreEng;
            }else{
              labelSubcat = subCat.nombre;
            }
            subCatNode = {
              label: labelSubcat,
              key: cat.key+'/'+subCat.key
            }
            this.tercerNivelTree.push(subCatNode);
          }

          catNode = {
            label: labelCat,
            key: cat.key,
            children: this.tercerNivelTree,
            expanded: true
          }
          this.segundoNivelTree.push(catNode);

        }else{

        /*SI ES LA CATEGORIA SELECIONADA AÑADIMOS LAS SUBCATEGORIAS SOLO DE ESA*/
          catNode = {
            label: labelCat,
            key: cat.key+'/all'
          }
          this.segundoNivelTree.push(catNode);
        }
      }
    

        this.primerNivelTree = [
          {
            label: labelCatPadre,
            key: this.categoriaPadre.key+'/all',
            children: this.segundoNivelTree,
            expanded: true
          }
        ]
      }else{
        this.treeMenuDisplay = false;
      }
  }

  nodeSelect(event) {
    let nodeKey = event.node.key;
    if(nodeKey.indexOf('/') != -1){
      let subCatExtract = nodeKey.substring(nodeKey.indexOf('/')+1, nodeKey.length);
      let catExtract = nodeKey.substring(0, nodeKey.indexOf('/'));
      this.subCategoriaText = subCatExtract;
      if(catExtract == (this.categoriaPadre.key)){console.log("1");
        this.getProductListByCategoriaPadre();
        this.getSubCatsByCat(catExtract);
        this.catUrl = catExtract;
        this.router.navigate([this.categoriaPadre.modulo,this.catPadreUrl, catExtract, subCatExtract]);
      }else if(subCatExtract != null && subCatExtract != 'all'){console.log("2");
        this.getProductListBySubCat(subCatExtract);
      }else{console.log("3");
        this.getProductsByCat(catExtract);
        this.getSubCatsByCat(catExtract);
      }
    }else{
      this.getProductsByCat(nodeKey);
      this.getSubCatsByCat(nodeKey);
    }
    this.selectedMenuNode = {
      key: nodeKey
    }
    this.filtrarPorPrecio();
  }

  filtrarPorPrecio(){
    if(this.productsClone != null && this.productsClone.length > 0){
      this.products = this.productsClone.filter(p => {
        if((this.productsService.ConvertStringToNumber(p.precio) >= this.rangePriceValues[0]) && 
        (this.productsService.ConvertStringToNumber(p.precio) <= this.rangePriceValues[1])){
          return p;
        }
      })
    }
    this.saveFiltroPriceSession();
  }

  saveFiltroPriceSession(){
    window.sessionStorage.setItem('filtrosPrice', JSON.stringify(this.rangePriceValues));
  }

  getFiltroPriceSession(){
    if(window.sessionStorage.getItem('filtrosPrice')){
      this.rangePriceValues = JSON.parse(window.sessionStorage.getItem('filtrosPrice'));
    }
  }

  getSessionCatUrl(){
    if(window.sessionStorage.getItem('categoria')){
      this.catUrl = window.sessionStorage.getItem('categoria');
      window.sessionStorage.removeItem('categoria');
    }
  }

  selectLateralCurrentNode(cat: string, subCat: string){
    if(subCat != null && subCat != ''){
      this.selectedMenuNode = {
        key: this.catUrl+'/'+this.subCategoriaText
      }
    }else{
      this.selectedMenuNode = {
        key: this.catUrl
      }
    }
  }

  sortOptionsMethod(){
    this.sortOptions = [
      {label: 'Valoraciones', value: 'estrellas'},
      {label: 'Precio', value: 'precio'},
      {label: 'Nombre', value: 'nombre'}
  ]; 
  }

  unblockScreen(){
    this.blockedDocument = true;
    setTimeout(() => {
      this.blockedDocument = false;
      this.productLoaded = Promise.resolve(true); 
    }, 1000);
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}

