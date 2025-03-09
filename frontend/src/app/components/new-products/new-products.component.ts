import { Component, inject } from '@angular/core';

import { CustomerService } from '../../services/customer.service';
import { PaginationService } from '../../services/pagination.service';

import { ProductCardComponent } from '../product-card/product-card.component';

import { type Product } from '../../types/product';

@Component({
  selector: 'app-new-products',
  imports: [ProductCardComponent],
  templateUrl: './new-products.component.html',
  styleUrl: './new-products.component.scss',
})
export class NewProductsComponent {
  newProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  isLoading: boolean = false;

  customerService = inject(CustomerService);
  paginationService = inject(PaginationService);

  ngOnInit() {
    this.isLoading = true;

    this.customerService.getNewProducts().subscribe({
      next: (result) => {
        this.newProducts = result;
        this.paginationService.calculateTotalPages(this.newProducts.length);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get paginatedNewProducts(): Product[] {
    return this.paginationService.getPaginatedItems(this.newProducts);
  }

  nextPage() {
    this.paginationService.nextPage();
  }

  previousPage() {
    this.paginationService.previousPage();
  }
}
