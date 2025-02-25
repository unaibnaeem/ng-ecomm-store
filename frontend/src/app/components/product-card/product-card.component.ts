import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

import { type Product } from '../../types/product';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, MatIconModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() product!: Product;

  authService = inject(AuthService);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  get sellingPrice() {
    return Math.round(
      this.product.price - (this.product.price * this.product.discount) / 100,
    );
  }

  isInWishlist(product: Product) {
    let productExists = this.wishlistService.wishlist.find(
      (x) => x._id === product._id,
    );

    if (productExists) return true;
    else return false;
  }

  onAddToWishlist(event: Event, product: Product) {
    event.stopPropagation();
    console.log('Added to wishlist:', product);

    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product._id!).subscribe({
        next: (result) => {
          this.wishlistService.initWishlist();
        },
      });
    } else {
      this.wishlistService.addToWishlist(product._id!).subscribe({
        next: (result) => {
          this.wishlistService.initWishlist();
        },
      });
    }
  }

  isInCart(product: Product) {
    let productExists = this.cartService.cart.find(
      (x) => x.product._id === product._id,
    );

    if (productExists) return true;
    else return false;
  }

  onAddToCart(event: Event, product: Product) {
    event.stopPropagation();
    console.log('Added to cart:', product);

    if (this.isInCart(product)) {
      this.cartService.removeFromCart(product._id!).subscribe({
        next: (result) => {
          this.cartService.initCart();
        },
      });
    } else {
      this.cartService.addToCart(product._id!, 1).subscribe({
        next: () => {
          this.cartService.initCart();
        },
      });
    }
  }
}
