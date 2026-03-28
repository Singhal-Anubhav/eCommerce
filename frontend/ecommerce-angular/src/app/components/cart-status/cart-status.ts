import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-status',
  standalone: false,
  templateUrl: './cart-status.html',
  styleUrl: './cart-status.css',
})
export class CartStatus implements OnInit{
  totalPrice: number =0;
  totaQuantity: number=0;
  constructor(private cartService: CartService){}

  ngOnInit(): void {
  this.updateCartService();
  }

  updateCartService(): void{
    //subscribe to total price
    this.cartService.totalPrice.subscribe(
      data=> this.totalPrice=data
    );
    //subscribe to cart total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totaQuantity =data
    );
  }

  
}
