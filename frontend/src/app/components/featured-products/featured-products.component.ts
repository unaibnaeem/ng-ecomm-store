import { Component, inject } from '@angular/core';

import { CustomerService } from '../../services/customer.service';
import { PaginationService } from '../../services/pagination.service';

import { ProductCardComponent } from '../product-card/product-card.component';

import { type Product } from '../../types/product';

@Component({
  selector: 'app-featured-products',
  imports: [ProductCardComponent],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss',
})
export class FeaturedProductsComponent {
  featuredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  isLoading: boolean = false;

  customerService = inject(CustomerService);
  paginationService = inject(PaginationService);

  ngOnInit() {
    this.isLoading = true;

    this.customerService.getFeaturedProducts().subscribe({
      next: (result) => {
        this.featuredProducts = result;
        this.paginationService.calculateTotalPages(
          this.featuredProducts.length,
        );
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get paginatedFeaturedProducts(): Product[] {
    return this.paginationService.getPaginatedItems(this.featuredProducts);
  }

  nextPage() {
    this.paginationService.nextPage();
  }

  previousPage() {
    this.paginationService.previousPage();
  }
}
