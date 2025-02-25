import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.production';

import { type Product } from '../types/product';
import { type Review } from '../types/review';

@Injectable({ providedIn: 'root' })
export class ProductService {
  http = inject(HttpClient);

  constructor() {}

  getProducts() {
    return this.http.get<Product[]>(environment.apiURL + '/product');
  }

  getProductById(id: string) {
    return this.http.get<Product>(environment.apiURL + '/product/' + id);
  }

  addProduct(model: Product) {
    return this.http.post(environment.apiURL + '/product', model);
  }

  updateProduct(id: string, model: Product) {
    return this.http.put(environment.apiURL + '/product/' + id, model);
  }

  deleteProduct(id: string) {
    return this.http.delete(environment.apiURL + '/product/' + id);
  }

  deleteReview(id: string, reviewId: string) {
    return this.http.delete<{ message: string; reviews: Review[] }>(
      environment.apiURL + '/product/' + id + '/reviews/' + reviewId,
    );
  }
}
