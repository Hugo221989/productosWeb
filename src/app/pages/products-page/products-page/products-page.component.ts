import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { SettingsState } from 'src/app/settings/settings.model';
import { actionSettingsBreadcrumbExist, actionSettingsCambiarProductoId, actionSettingsBuscador } from 'src/app/settings/settings.actions';
import { ProductsService } from '../service/products.service';
import { ProductoDto } from 'src/app/models/producto';
import { Observable, Subscription } from 'rxjs';
import { selectSettingsBuscador } from 'src/app/settings/settings.selectors';
import { Categoria, SubCategoria, CategoriaPadreDto } from 'src/app/models/categoria';
import { TreeNode, MessageService } from 'primeng/api';
import { CategoriaService } from '../service/categoria.service';
import { TranslateService } from '@ngx-translate/core';
import { myAnimation } from 'src/app/animations/animation';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss'],
  providers: [
    MessageService
  ],
  animations: [myAnimation]
})

export class ProductsPageComponent implements OnInit, OnDestroy {
  language: string = "es";

  catPadreUrl: string;
  subCatUrl: string;
  catUrl: string;

  products: ProductoDto[] = [];
  productsClone: ProductoDto[] = [];

  sortOptions: SelectItem[];
  sortKey: string;
  sortField: string = "nombre";
  sortOrder: number;

  textoBuscadorOvservable$: Observable<string>;
  private subscription: Subscription[] = [];
  textoBuscador: string = null;

  primerNivelTree: TreeNode[] = [];
  segundoNivelTree: TreeNode[] = [];
  tercerNivelTree: TreeNode[] = [];
  selectedMenuNode: TreeNode;
  treeMenuDisplay: boolean = true;

  categoriaPadre: CategoriaPadreDto;
  modulo: string;
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
      /*para el buscador*/
      this.manageBuscadorSuperior();
      this.getSessionCatUrl();
      this.getCategoriaPadre();
      this.getFiltroPriceSession();
      this.productsService.cambiarBreadcrumb(null, null);
      localStorage.setItem('nombreBreadcrumb', null);
      localStorage.setItem('nombreBreadcrumbEng', null);
      this.manageRouterEvents();
      this.filtrarPorPrecio();
      this.unblockScreen();
      this.sortOptionsMethod();
      this.gotoTop();
  }

  getLanguageBrowser(){
  this.language = this.productsService.getLanguageBrowser();
  }

  manageRouterEvents(){
    this.subscription.push(this.router.events.pipe(
      filter(
          event => event instanceof NavigationEnd))
          .subscribe( ()=> {
            this.getUrlParams();console.log("subcat: ",this.subCatUrl, "cat: ",this.catUrl);
            if(this.subCatUrl == 'all' && this.catUrl == 'all' ){
              this.getProductListByCategoriaPadre();
              this.getSubCatsTreeNodeByCat(this.catUrl);
            }else if(this.subCatUrl != null && this.subCatUrl != 'all'){
              this.getProductListBySubCat(this.subCatUrl);
              this.getSubCatsTreeNodeByCat(this.catUrl);
            }else{
              this.getProductsByCat(this.catUrl);
              this.getSubCatsTreeNodeByCat(this.catUrl);
            }
            this.selectLateralCurrentNode(this.catUrl, this.subCatUrl);
          }));
  }
  
  getUrlParams(){
    this.catPadreUrl = this.route.snapshot.paramMap.get("catPadre");
    this.subCatUrl = this.route.snapshot.paramMap.get("subcat");

    this.catUrl = this.route.snapshot.paramMap.get("cat");
    const children: ActivatedRoute[] = this.route.root.children;
    let modulo = children[0].snapshot.data['modulo'];
    this.modulo = modulo;
  }

  manageBuscadorSuperior(){
    /*para el buscador*/
    this.textoBuscadorOvservable$ = this.store.pipe(select(selectSettingsBuscador));
    this.subscription.push(this.textoBuscadorOvservable$.subscribe( (texto) => {
        this.textoBuscador = texto;
        if(this.textoBuscador != null && this.textoBuscador != ''){
          this.getProductListConBuscador();
        }else  if(this.subCatUrl == 'all' && this.catUrl == 'all' ){
          this.getProductListByCategoriaPadre();
        }else if(this.subCatUrl != null && this.subCatUrl != '' && this.subCatUrl != 'all'){
          this.getProductListBySubCat(this.subCatUrl);
        }else{
          this.getProductsByCat(this.catUrl);
        }
    }))
  }

  getProductListConBuscador(){
    this.productsService.getProductsList(this.textoBuscador).subscribe( data =>{
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    })
  }

  getProductListBySubCat(subCat: string){
    this.productsService.getProductsListBySubCat(subCat).subscribe( data =>{
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    });
    this.selectLateralCurrentNode(this.catUrl, this.subCatUrl);
  }

  getProductsByCat(cat: string){
    this.productsService.getProductsListByCat(cat).subscribe( data =>{
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    })
    this.selectLateralCurrentNode(this.catUrl, null);
    this.catUrl = cat;
    this.subCatUrl = null;
  }
  getProductListByCategoriaPadre(){
    this.productsService.getProductsListByCatPadre(this.catPadreUrl).subscribe( data => {
      this.products = data;
      this.productsClone = this.products;
      this.filtrarPorPrecio();
    })
    this.subCatUrl = "all";
    this.selectLateralCurrentNode(this.catUrl, 'all');
  }

  selectProductDetail(event: Event, product: ProductoDto) {
      this.changeBreadcrumbStore(product);
      this.setSessionCatUrl();

      this.router.navigate([this.categoriaPadre.modulo, product.categoriaPadre, product.categoria , product.subCategoria, 'detail', product.id]);

      this.changeProductIdStore(product);
      this.cleanInputSearch();
  }

  changeBreadcrumbStore(product: ProductoDto){
    this.store.dispatch(actionSettingsBreadcrumbExist({
      hayBreadcrumbFinal: true
    }))
    this.productsService.cambiarBreadcrumb(product.nombre, product.nombreEng);
  }

  changeProductIdStore(product: ProductoDto){
    this.store.dispatch(actionSettingsCambiarProductoId({
      productoId: product.id
    }))
  }

  cleanInputSearch(){
    this.store.dispatch(actionSettingsBuscador({
      buscador: null
    }))
    let inputSearchNavBar: HTMLElement = document.getElementById('inputSearchNavBar') as HTMLElement;
    inputSearchNavBar.innerText = "";
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
    this.categoriaService.getCategoriaPadre(this.catPadreUrl).subscribe( data => {
      this.categoriaPadre = data;
      this.getSubCatsTreeNodeByCat(this.catUrl);
    })
  }

  getSubCatsTreeNodeByCat(selectedCat: string){
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

      for(let cat of this.categoriaPadre.categorias){ 
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
          for(let subCat of cat.subcategorias){
            if(this.language == "en"){
              labelSubcat = subCat.nombreEng;
            }else{
              labelSubcat = subCat.nombre;
            }
            subCatNode = {
              label: labelSubcat,
              key: this.categoriaPadre.key+'/'+cat.key+'/'+subCat.key
            }
            this.tercerNivelTree.push(subCatNode);
          }

          catNode = {
            label: labelCat,
            key: this.categoriaPadre.key+'/'+cat.key+'/all',
            children: this.tercerNivelTree,
            expanded: true
          }
          this.segundoNivelTree.push(catNode);

        }else{

        /*SI ES LA CATEGORIA SELECIONADA AÑADIMOS LAS SUBCATEGORIAS SOLO DE ESA*/
          catNode = {
            label: labelCat,
            key: this.categoriaPadre.key+'/'+cat.key+'/all'
          }
          this.segundoNivelTree.push(catNode);
        }
      }
    

        this.primerNivelTree = [
          {
            label: labelCatPadre,
            key: this.categoriaPadre.key+'/all/all',
            children: this.segundoNivelTree,
            expanded: true
          }
        ]
      }else{
        this.treeMenuDisplay = false;
      }
  }

  sideMenuSelect(event) {
    let nodeKey = event.node.key;
    let categoriaKey;
    let subCategoriaKey;
    if(nodeKey.indexOf('/') != -1){
      let restoNode = nodeKey.substring(nodeKey.indexOf('/')+1, nodeKey.length);
      if(restoNode.indexOf('/') != -1){
        categoriaKey = restoNode.substring(0, restoNode.indexOf('/'));
        subCategoriaKey = restoNode.substring(restoNode.indexOf('/')+1, restoNode.length); 
      }
    }

    if(categoriaKey == 'all' && subCategoriaKey == 'all'){
      this.getProductListByCategoriaPadre();
      this.getSubCatsTreeNodeByCat(categoriaKey);
    }else if(categoriaKey != 'all' && subCategoriaKey == 'all'){
      this.getProductsByCat(categoriaKey);
      this.getSubCatsTreeNodeByCat(categoriaKey);
    }else{
      this.getProductListBySubCat(subCategoriaKey);
    }

    this.selectedMenuNode = {
      key: nodeKey
    }
    this.filtrarPorPrecio();
  }

  filtrarPorPrecio(){
    if(this.productsClone != null && this.productsClone.length > 0){
      this.products = this.productsClone.filter(p => {
        if((p.precio >= this.rangePriceValues[0]) && 
        (p.precio <= this.rangePriceValues[1])){
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

  setSessionCatUrl(){
    if(this.subCatUrl == null){
      this.subCatUrl = 'all';
      window.sessionStorage.setItem('categoria', this.catUrl);
    }
  }

  selectLateralCurrentNode(cat: string, subCat: string){
    if(subCat != null && subCat != ''){
      this.selectedMenuNode = {
        key: cat+'/'+this.subCatUrl
      }
    }else{
      this.selectedMenuNode = {
        key: cat
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

  gotoTop() {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

  ngOnDestroy(){
    this.subscription.forEach(s => s.unsubscribe());
  }

}

