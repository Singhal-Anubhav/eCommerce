import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart-details',
  standalone: false,
  templateUrl: './cart-details.html',
  styleUrl: './cart-details.css',
})
export class CartDetails implements OnInit {

  totalPrice: number = 0;
  cartItems: CartItem[] = [];
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.fetchCartDetails();
  }

  fetchCartDetails(): void {
    //update the total Price
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //update total quantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //update the cart items
    this.cartItems = this.cartService.cartItem;

  }

  incrementItem(_t13: CartItem): void {
    this.cartService.addToCart(_t13);
  }

  decrementItem(_t13: CartItem): void {
    this.cartService.subtractToCart(_t13);
  }

  removeItem(theItem: CartItem): void {
    this.cartService.removeCartItem(theItem);
  }

}
