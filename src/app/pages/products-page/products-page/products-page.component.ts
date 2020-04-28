import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPageComponent implements OnInit {

  products: Product[] = [
    {
      id : "1",
      nombre : "HP Pavilion 267H",
      descripcion: "Portátil HP Pavilion 15,6\", 512 GB SSD, 8GB RAM DDR4",
      precio: "512€",
      estrellas: 4,
      foto: "demo.jpg"
    },
    {
      id : "2",
      nombre : "HP Pavilion 320H",
      descripcion: "Portátil HP Pavilion 14\", 256 GB SSD, 8GB RAM DDR4",
      precio: "599€",
      estrellas: 5,
      foto: "demo.jpg"
    },
    {
      id : "3",
      nombre : "HP Pavilion 267H",
      descripcion: "Portátil HP Pavilion 15,6\", 512 GB SSD, 8GB RAM DDR4",
      precio: "512€",
      estrellas: 4,
      foto: "demo.jpg"
    },
    {
      id : "4",
      nombre : "HP Pavilion 267H",
      descripcion: "Portátil HP Pavilion 15,6\", 512 GB SSD, 8GB RAM DDR4",
      precio: "512€",
      estrellas: 4,
      foto: "demo.jpg"
    },
    {
      id : "5",
      nombre : "ACER E-15 5500",
      descripcion: "Portátil ACER E-15 15,6\", 1 TB SSD, 16GB RAM DDR4",
      precio: "710€",
      estrellas: 4,
      foto: "demo.jpg"
    }
  ];
  selectedCities: string[] = [];
  selectedProduct: Product = new Product;

  displayDialog: boolean;

  sortOptions: SelectItem[];

  sortKey: string;

  sortField: string = "nombre";

  sortOrder: number;

  constructor(private router:Router) { }

  ngOnInit() {
      //this.carService.getCarsLarge().then(cars => this.cars = cars);

      this.sortOptions = [
          {label: 'Valoraciones', value: 'estrellas'},
          {label: 'Precio', value: 'precio'},
          {label: 'Nombre', value: 'nombre'}
      ];
  }

  selectProduct(event: Event, product: Product) {
      /* this.selectedProduct = product;
      this.displayDialog = true;
      event.preventDefault(); */
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

export class Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  estrellas: number;
  foto: string;
}
