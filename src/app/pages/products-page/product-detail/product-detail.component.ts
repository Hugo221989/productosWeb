import { Component, OnInit } from '@angular/core';
import { Product } from '../products-page/products-page.component';

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

  constructor() { }

   ngOnInit() {
        this.images = [];
        this.images.push({source:'assets/laptops/hp-envy-17/1.png', alt:'Description for Image 1', title:'Title 1'});
        this.images.push({source:'assets/laptops/hp-envy-17/2.png', alt:'Description for Image 2', title:'Title 2'});
        this.images.push({source:'assets/laptops/hp-envy-17/3.png', alt:'Description for Image 3', title:'Title 3'});
        this.images.push({source:'assets/laptops/hp-envy-17/4.png', alt:'Description for Image 4', title:'Title 4'});
        this.images.push({source:'assets/laptops/hp-envy-17/5.png', alt:'Description for Image 5', title:'Title 5'});
        console.log(this.images.length)
    }

}
