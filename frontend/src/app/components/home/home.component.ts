import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';

import { CustomerService } from '../../services/customer.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { StateService } from '../../services/state.service';
import { PaginationService } from '../../services/pagination.service';

import { ProductCardComponent } from '../product-card/product-card.component';

import { type Product } from '../../types/product';

@Component({
  selector: 'app-home',
  imports: [RouterLink, MatButtonModule, ProductCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  regularProducts: Product[] = [];

  private homeResetSubscription!: Subscription;

  customerService = inject(CustomerService);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);
  stateService = inject(StateService);
  paginationService = inject(PaginationService);

  ngOnInit() {
    this.loadProducts();

    this.homeResetSubscription = this.stateService.resetHomePage$.subscribe({
      next: (reset) => {
        if (reset) {
          this.paginationService.currentPage = 1;
          this.loadProducts();
        }
      },
    });

    this.wishlistService.initWishlist();
    this.cartService.initCart();
  }

  loadProducts() {
    this.customerService.getRegularProducts().subscribe({
      next: (result: Product[]) => {
        this.regularProducts = result;
        this.paginationService.calculateTotalPages(result.length);
      },
    });

    if (this.paginationService.currentPage === 1) {
      this.customerService.getFeaturedProducts().subscribe({
        next: (result: Product[]) => {
          this.featuredProducts = result;
        },
      });

      this.customerService.getNewProducts().subscribe({
        next: (result: Product[]) => {
          this.newProducts = result;
        },
      });
    }
  }

  get paginatedRegularProducts(): Product[] {
    return this.paginationService.getPaginatedItems(this.regularProducts);
  }

  previousPage() {
    this.paginationService.previousPage();
  }

  nextPage() {
    this.paginationService.nextPage();
  }

  ngOnDestroy() {
    if (this.homeResetSubscription) {
      this.homeResetSubscription.unsubscribe();
    }
  }
}
