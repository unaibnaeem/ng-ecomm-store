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

  customerService = inject(CustomerService);
  paginationService = inject(PaginationService);

  ngOnInit() {
    this.customerService.getFeaturedProducts().subscribe({
      next: (result) => {
        this.featuredProducts = result;
        this.paginationService.calculateTotalPages(
          this.featuredProducts.length,
        );
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
