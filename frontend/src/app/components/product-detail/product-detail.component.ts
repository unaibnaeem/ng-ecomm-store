import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { CustomerService } from '../../services/customer.service';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';

import { ProductCardComponent } from '../product-card/product-card.component';

import { type Product } from '../../types/product';
import { type Review } from '../../types/review';

@Component({
  selector: 'app-product-detail',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatIconModule,
    ProductCardComponent,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent {
  product!: Product;
  selectedImage!: string;
  similarProducts: Product[] = [];
  loadingSkeletons = new Array(4);

  reviews: Review[] = [];
  review: Review = { name: '', rating: 5, comment: '' };
  visibleReviews = 5;

  route = inject(ActivatedRoute);
  authService = inject(AuthService);
  productService = inject(ProductService);
  customerService = inject(CustomerService);
  wishlistService = inject(WishlistService);
  cartService = inject(CartService);

  ngOnInit() {
    this.route.params.subscribe((x: any) => {
      this.getProductDetails(x.id);
    });
  }

  getProductDetails(id: string) {
    this.customerService.getProductById(id).subscribe({
      next: (result) => {
        this.product = result;
        this.selectedImage = this.product.images[0];

        this.reviews =
          this.product.reviews?.map((review) => ({
            ...review,
            rating: Number(review.rating),
          })) || [];

        this.customerService
          .getProducts('', this.product.categoryId, '', '', -1, 1, 4)
          .subscribe({
            next: (result) => {
              this.similarProducts = result.filter(
                (p) => p._id !== this.product._id,
              );
            },
          });
      },
    });
  }

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

    if (this.isInWishlist(product)) {
      this.wishlistService.removeFromWishlist(product._id!).subscribe({
        next: () => {
          this.wishlistService.initWishlist();
        },
      });
    } else {
      this.wishlistService.addToWishlist(product._id!).subscribe({
        next: () => {
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

    if (this.isInCart(product)) {
      this.cartService.removeFromCart(product._id!).subscribe({
        next: () => {
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

  showMoreReviews() {
    this.visibleReviews += 5;
  }

  showLessReviews() {
    this.visibleReviews = 5;
  }

  getStars(rating: number): string {
    return '⭐'.repeat(rating);
  }

  onSubmitReview(event: Event) {
    event.preventDefault();
    if (!this.review.name.trim() || !this.review.comment.trim()) return;

    this.review.rating = +this.review.rating;

    this.customerService.addReview(this.product._id!, this.review).subscribe({
      next: (result) => {
        this.reviews = result.reviews;
        this.review = { name: '', rating: 5, comment: '' };
      },
    });
  }

  onDeleteReview(id: string, reviewId: string) {
    if (confirm('Are you sure you want to delete this review?')) {
      this.productService.deleteReview(id, reviewId).subscribe({
        next: (result) => {
          this.reviews = result.reviews;
        },
      });
    }
  }
}
