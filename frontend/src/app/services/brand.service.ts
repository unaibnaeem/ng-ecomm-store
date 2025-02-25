import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.production';

import { type Brand } from '../types/brand';

@Injectable({ providedIn: 'root' })
export class BrandService {
  http = inject(HttpClient);

  constructor() {}

  getBrands() {
    return this.http.get<Brand[]>(environment.apiURL + '/brand');
  }

  getBrandById(id: string) {
    return this.http.get<Brand>(environment.apiURL + '/brand/' + id);
  }

  addBrand(brandName: string) {
    return this.http.post(environment.apiURL + '/brand', {
      name: brandName,
    });
  }

  updateBrand(id: string, updatedBrandName: string) {
    return this.http.put(environment.apiURL + '/brand/' + id, {
      name: updatedBrandName,
    });
  }

  deleteBrand(id: string) {
    return this.http.delete(environment.apiURL + '/brand/' + id);
  }
}
