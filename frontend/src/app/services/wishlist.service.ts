import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.production';

import { type Product } from '../types/product';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlist: Product[] = [];

  http = inject(HttpClient);

  constructor() {}

  initWishlist() {
    return this.getWishlist().subscribe({
      next: (result) => {
        this.wishlist = result;
      },
    });
  }

  getWishlist() {
    return this.http.get<Product[]>(environment.apiURL + '/wishlist');
  }

  addToWishlist(productId: string) {
    return this.http.post(environment.apiURL + '/wishlist/' + productId, {});
  }

  removeFromWishlist(productId: string) {
    return this.http.delete<Product[]>(
      environment.apiURL + '/wishlist/' + productId,
    );
  }
}
