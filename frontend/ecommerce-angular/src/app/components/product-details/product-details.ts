import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/ProductService';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart-service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit{
  product!: Product;

  constructor(private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private cd: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.getProductDetails();
  }
  getProductDetails() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProductById(id).subscribe({
      next:(data)=>{
        this.product = data;
        this.cd.detectChanges();
      },
      error:(err)=> {
        console.log(err);
      },
    }
    )
  }

  addToCart(product: Product):void{
    let cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }
  
}
