import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment.production';

import { type Product } from '../types/product';
import { type Category } from '../types/category';
import { type Brand } from '../types/brand';
import { type Review } from '../types/review';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  http = inject(HttpClient);

  constructor() {}

  getCategories() {
    return this.http.get<Category[]>(environment.apiURL + '/categories');
  }

  getBrands() {
    return this.http.get<Brand[]>(environment.apiURL + '/brands');
  }

  getProducts(
    searchTerm: string,
    categoryId: string,
    brandId: string,
    sortBy: string,
    sortOrder: number,
    page: number,
    pageSize: number,
  ) {
    return this.http.get<Product[]>(
      environment.apiURL +
        `/products?searchTerm=${searchTerm}&categoryId=${categoryId}&brandId=${brandId}&sortBy=${sortBy}&sortOrder=${sortOrder}&page=${page}&pageSize=${pageSize}`,
    );
  }

  getProductById(id: string) {
    return this.http.get<Product>(environment.apiURL + '/product/' + id);
  }

  getRegularProducts() {
    return this.http.get<Product[]>(environment.apiURL + '/regular-products');
  }

  getNewProducts() {
    return this.http.get<Product[]>(environment.apiURL + '/new-products');
  }

  getFeaturedProducts() {
    return this.http.get<Product[]>(environment.apiURL + '/featured-products');
  }

  addReview(
    id: string,
    review: Review,
  ): Observable<{ message: string; reviews: Review[] }> {
    return this.http.post<{ message: string; reviews: Review[] }>(
      environment.apiURL + '/product/' + id + '/reviews',
      review,
    );
  }
}
