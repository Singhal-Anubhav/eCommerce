import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductCategory } from '../../models/product-category';
import { ProductService } from '../../services/ProductService';

@Component({
  selector: 'app-product-category-menu',
  standalone: false,
  templateUrl: './product-category-menu.html',
  styleUrl: './product-category-menu.css',
})
export class ProductCategoryMenu implements OnInit{
  productCatgories: ProductCategory[]=[];

  constructor(private productService: ProductService,
    private cd: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.listProductCategory();
  }

  listProductCategory(): void{

    this.productService.getProductCategoryList().subscribe({
      next:(data) => {
        console.log("output: "+ JSON.stringify(data));
        this.productCatgories = data;
        this.cd.detectChanges();
      },
      error:(err) => {
        console.log(err);
      }
    })
  }
}
