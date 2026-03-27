import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/ProductService';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  productCategoryName: string = 'Books';
  searchMode: boolean = false;

  constructor(private productService: ProductService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });

  }

  listProducts(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    }else{
      this.handleListProducts();
    }
  }
  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(keyword).subscribe({
      next:(data) =>{
        this.products = data;
        this.cd.detectChanges();
      },
      error:(err)=>{
        console.log(err);
      }
    })

  }

  handleListProducts(): void {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.productCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    this.productService.getProductList(this.currentCategoryId).subscribe({
      next: (data) => {
        this.products = data;
        this.cd.detectChanges();
        console.log(this.products);
      },
      error: (err) => {
        console.error("API Error:", err);
      }
    });
  }

}
