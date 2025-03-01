import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CustomerService } from '../../services/customer.service';
import { StateService } from '../../services/state.service';

import { ProductCardComponent } from '../product-card/product-card.component';

import { type Product } from '../../types/product';
import { type Category } from '../../types/category';
import { type Brand } from '../../types/brand';

@Component({
  selector: 'app-product-list',
  imports: [
    NgClass,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ProductCardComponent,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  searchTerm: string = '';
  categoryId: string = '';
  brandId: string = '';
  sortBy: string = '';
  sortOrder: number = -1;
  page = 1;
  pageSize = 6;
  isNext = true;
  showFilters: boolean = false;

  products: Product[] = [];
  categories: Category[] = [];
  brands: Brand[] = [];

  route = inject(ActivatedRoute);
  customerService = inject(CustomerService);
  stateService = inject(StateService);

  ngOnInit() {
    this.customerService.getCategories().subscribe({
      next: (result) => {
        this.categories = result;
      },
    });

    this.customerService.getBrands().subscribe({
      next: (result) => {
        this.brands = result;
      },
    });

    this.route.queryParams.subscribe((x: any) => {
      this.searchTerm = x.search || '';
      this.categoryId = x.categoryId || '';

      this.stateService.page$.subscribe((page) => {
        this.page = page;
        this.getProducts();
      });
    });
  }

  getProducts() {
    setTimeout(() => {
      this.customerService
        .getProducts(
          this.searchTerm,
          this.categoryId || '',
          this.brandId || '',
          this.sortBy,
          this.sortOrder,
          this.page,
          this.pageSize,
        )
        .subscribe({
          next: (result) => {
            this.products = result;

            this.isNext = result.length === this.pageSize;
          },
        });
    }, 500);
  }

  onChangeOrder(event: any) {
    this.sortBy = 'price';
    this.sortOrder = event.value;
    this.getProducts();
  }

  onChangePage(page: number) {
    if (!this.isNext && page > this.page) {
      return;
    }

    this.page = page;
    this.stateService.setPage(page);
    this.getProducts();
  }

  onCategoryChange() {
    this.brandId = '';
    this.page = 1;
    this.stateService.setPage(this.page);
    this.getProducts();
  }

  clearBrandFilter(event: Event) {
    event.stopPropagation();
    this.brandId = '';
    this.getProducts();
  }
}
