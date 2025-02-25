import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.production';

import { type Cart } from '../types/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: Cart[] = [];

  http = inject(HttpClient);

  constructor() {}

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  initCart() {
    return this.getCartItems().subscribe({
      next: (result) => {
        this.cart = result;
      },
    });
  }

  getCartItems() {
    return this.http.get<Cart[]>(environment.apiURL + '/cart');
  }

  addToCart(productId: string, quantity: number) {
    return this.http.post(environment.apiURL + '/cart/' + productId, {
      quantity: quantity,
    });
  }

  removeFromCart(productId: string) {
    return this.http.delete(environment.apiURL + '/cart/' + productId);
  }
}
