import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { WishlistService } from '../../services/wishlist.service';
import { ProductCardComponent } from '../product-card/product-card.component';

import { type Product } from '../../types/product';

@Component({
  selector: 'app-wishlist',
  imports: [RouterLink, MatIconModule, ProductCardComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss',
})
export class WishlistComponent {
  wishlist: Product[] = [];

  wishlistService = inject(WishlistService);

  ngOnInit() {
    this.wishlistService.initWishlist();
  }
}
