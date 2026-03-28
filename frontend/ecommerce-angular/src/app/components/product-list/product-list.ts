import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/ProductService';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart-service';
import { CartItem } from '../../models/cart-item';
@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list-grid.html',
  styleUrl: './product-list.css',
})
export class ProductList implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  productCategoryName: string = 'Books';
  previousCategoryName: string = 'Books';
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotaElements: number = 0;

  constructor(private productService: ProductService,
    private cartService: CartService,
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
    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts() {
    const keyword = this.route.snapshot.paramMap.get('keyword')!;
    if (this.previousCategoryName != keyword) {
      this.thePageNumber = 1;
    }
    this.previousCategoryName = keyword;


    this.productService.searchProductsPaginate(keyword, this.thePageNumber - 1, this.thePageSize).subscribe(this.processStrem());

  }

  handleListProducts(): void {
    const hasCategoryId = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.productCategoryName = this.route.snapshot.paramMap.get('name')!;
    }

    /*
    Check if we have different category than previous
    Note: Angular will reuse a component if it is currently being viewed

    if we have a diff category id than previous
    then set the pageNumber to 1;
    */

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }
    console.log(`currentCategoryId=${this.currentCategoryId} and previousCategryId=${this.previousCategoryId}`);
    this.previousCategoryId = this.currentCategoryId;



    this.productService.getProductListPaginate(this.currentCategoryId,
      this.thePageNumber - 1, this.thePageSize).subscribe(this.processStrem());
  }

  processStrem() {
    return {
      next: (data: any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotaElements = data.page.totalElements;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
      }
    }
  }

  updatePageSize(newPageSize: string) {
    if (+newPageSize != this.thePageSize) {
      this.thePageSize = +newPageSize;
      this.thePageNumber = 1;
      this.listProducts();
    }
  }

  addToCart(theProduct: Product): void {
    console.log(`Adding to the cart : ${theProduct.name}, ${theProduct.unitPrice}`);

    const cartItem = new CartItem(theProduct);

    this.cartService.addToCart(cartItem);
  }
}
