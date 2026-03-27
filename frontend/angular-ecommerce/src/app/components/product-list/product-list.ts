import { Component, OnInit } from '@angular/core';
import { ProductService} from '../../services/ProductService';
import { Product } from '../../models/product';
@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[]=[];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.listProducts();
  }

  listProducts(): void{
    try{
      this.productService.getProductList().subscribe(
        (data)=>{
          this.products = data;
      });
    }catch(e){
      console.error("Somethig goes wrong");
    }
  }

}
