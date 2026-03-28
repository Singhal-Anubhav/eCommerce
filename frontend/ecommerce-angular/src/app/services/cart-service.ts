import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItem: CartItem[] = [];

  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  constructor() { }

  addToCart(theCartItem: CartItem) {
    //check if we already have an item in a cart
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem | undefined;

    // find the item in the cart based on item id
    if (this.cartItem.length > 0) {
      existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id);
      alreadyExistInCart = (existingCartItem != undefined)
      ;
    }
    //check if we found it

    if (alreadyExistInCart) {
      existingCartItem!.quantity++;
    } else {
      this.cartItem.push(theCartItem);
    }


    //compute cart total;
    this.computeCartTotals();
  }

  subtractToCart(theCartItem: CartItem): void{
    theCartItem.quantity--;

    if(theCartItem.quantity === 0){
      this.removeCartItem(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }

  removeCartItem(theCartItem: CartItem): void{
    const index = this.cartItem.findIndex(tempItem=>
      tempItem.id === theCartItem.id
    );

    if(index>-1){
      this.cartItem.splice(index,1);
    }
    this.computeCartTotals();
  }

  computeCartTotals(): void {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let tempCartItem of this.cartItem) {
      totalPriceValue += tempCartItem.unitPrice * tempCartItem.quantity;
      totalQuantityValue += tempCartItem.quantity;
      this.logCart(tempCartItem.unitPrice, tempCartItem.quantity, tempCartItem.name);
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCart(totalPriceValue, totalQuantityValue);
  }

  logCart(price: number, quantity: number, name?: string): void {
    if (name != null) {
      console.log(`name:${name}, quantity:${quantity}, price=${price}`);
    } else {
      console.log(`totalPrice:${price}, totaQuantity:${quantity}`);
    }
  }
}
