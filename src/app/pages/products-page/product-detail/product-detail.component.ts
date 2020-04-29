import { Component, OnInit } from '@angular/core';
import { Product } from '../products-page/products-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {

  images: any[];
  product: Product = {
      id : "1",
      nombre : "HP Pavilion 267H",
      descripcion: "Portátil HP Pavilion 15,6\", 512 GB SSD, 8GB RAM DDR4",
      precio: "512€",
      estrellas: 4,
      foto: "demo.jpg"
}


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

  responsiveOptions;

  constructor(private router:Router) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
   }

   producto: Product;

   ngOnInit() {
        this.images = [];
        this.images.push({source:'assets/laptops/hp-envy-17/1.png', alt:'Description for Image 1', title:'Title 1'});
        this.images.push({source:'assets/laptops/hp-envy-17/2.png', alt:'Description for Image 2', title:'Title 2'});
        this.images.push({source:'assets/laptops/hp-envy-17/3.png', alt:'Description for Image 3', title:'Title 3'});
        this.images.push({source:'assets/laptops/hp-envy-17/4.png', alt:'Description for Image 4', title:'Title 4'});
        this.images.push({source:'assets/laptops/hp-envy-17/5.png', alt:'Description for Image 5', title:'Title 5'});



        this.producto = history.state;
    }

    verProducto(id:string){
      this.gotoTop();
      this.router.navigate(['/detail', id]);
    }

    gotoTop() {
      window.scroll({ 
        top: 0, 
        left: 0, 
        behavior: 'smooth' 
      });
    }

}
