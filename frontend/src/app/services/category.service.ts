import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.production';

import { type Category } from '../types/category';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  http = inject(HttpClient);

  constructor() {}

  getCategories() {
    return this.http.get<Category[]>(environment.apiURL + '/category');
  }

  getCategoryById(id: string) {
    return this.http.get<Category>(environment.apiURL + '/category/' + id);
  }

  addCategory(categoryName: string) {
    return this.http.post(environment.apiURL + '/category', {
      name: categoryName,
    });
  }

  updateCategory(id: string, updatedCategoryName: string) {
    return this.http.put(environment.apiURL + '/category/' + id, {
      name: updatedCategoryName,
    });
  }

  deleteCategory(id: string) {
    return this.http.delete(environment.apiURL + '/category/' + id);
  }
}
