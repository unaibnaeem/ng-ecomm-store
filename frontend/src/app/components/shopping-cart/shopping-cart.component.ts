import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgStyle } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';

import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';

import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { StripeService } from '../../services/stripe.service';

import { environment } from '../../../environments/environment.production';

import { type Product } from '../../types/product';
import { type Order } from '../../types/order';

@Component({
  selector: 'app-shopping-cart',
  imports: [
    NgStyle,
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatRadioModule,
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  stripe: Stripe | null = null;
  elements!: StripeElements;
  cardElement!: StripeCardElement | null;
  cardElementMounted: boolean = false;
  isCardValid: boolean = false;

  @ViewChild('cartSection', { static: false }) cartSection!: ElementRef;
  @ViewChild('checkoutSection', { static: false }) checkoutSection!: ElementRef;
  @ViewChild('summarySection', { static: false }) summarySection!: ElementRef;

  @ViewChild('cardElementContainer', { static: false })
  cardElementContainer!: ElementRef;

  private cdr = inject(ChangeDetectorRef);

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  cartService = inject(CartService);
  orderService = inject(OrderService);
  stripeService = inject(StripeService);

  addressForm = this.formBuilder.group({
    address1: ['', [Validators.required]],
    address2: [''],
    city: ['', [Validators.required]],
    postalCode: ['', [Validators.required]],
    paymentType: ['cashOnDelivery'],
  });

  ngOnInit() {
    this.cartService.initCart();

    this.addressForm.get('paymentType')?.valueChanges.subscribe({
      next: (paymentType) => {
        setTimeout(() => {
          if (paymentType === 'card') {
            this.initializeStripeElements();
          }
        }, 200);
      },
    });
  }

  ngAfterViewInit() {
    if (this.addressForm.get('paymentType')?.value === 'card') {
      this.initializeStripeElements();
    }
  }

  async initializeStripeElements() {
    if (this.cardElement && this.cardElementMounted) {
      this.cardElement.unmount();
      this.cardElement = null;
      this.cardElementMounted = false;
    }

    this.stripe = await loadStripe(environment.stripePublicKey);

    if (!this.stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const elements = this.stripe.elements();

    this.cardElement = elements.create('card', {
      style: {
        base: {
          color: '#32325d',
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: 'antialiased',
          fontSize: '16px',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
        invalid: {
          color: '#fa755a',
          iconColor: '#fa755a',
        },
      },
    });

    if (
      !this.cardElementContainer ||
      !this.cardElementContainer.nativeElement
    ) {
      console.error('Card element container not found.');
      return;
    }

    if (this.cardElementContainer?.nativeElement) {
      setTimeout(() => {
        if (this.cardElement) {
          this.cardElement.mount(this.cardElementContainer.nativeElement);
          this.cardElementMounted = true;

          this.cardElement?.on('change', (event) => {
            this.isCardValid = event.complete;
            this.cdr.detectChanges();
          });
        } else {
          console.error('Stripe card element is NULL!');
        }
      }, 500);
    } else {
      console.error('Card element container not found.');
    }
  }

  get isPaymentDisabled() {
    return (
      this.addressForm.invalid ||
      (this.addressForm.value.paymentType === 'card' && !this.isCardValid)
    );
  }

  get isOrderDisabled() {
    return this.isPaymentDisabled;
  }

  get cartItems() {
    return this.cartService.cart;
  }

  get totalAmount() {
    let amount = 0;

    for (let index = 0; index < this.cartItems.length; index++) {
      const element = this.cartItems[index];
      amount += this.sellingPrice(element.product) * element.quantity;
    }

    return amount;
  }

  sellingPrice(product: Product) {
    return Math.round(product.price - (product.price * product.discount) / 100);
  }

  onChangeItemCount(productId: string, quantity: number) {
    this.cartService.addToCart(productId, quantity).subscribe({
      next: () => {
        this.cartService.initCart();
      },
    });
  }

  onRemoveFromCart(productId: string) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartService.initCart();
      },
    });
  }

  scrollToSection(section: ElementRef | HTMLElement) {
    const element =
      section instanceof ElementRef ? section.nativeElement : section;

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      console.error('Section not found:', section);
    }
  }

  async onCompleteOrder() {
    let user = this.cartService.getUser();

    let order: Order = {
      userId: user._id,
      items: this.cartItems,
      paymentType: this.addressForm.value.paymentType ?? 'cashOnDelivery',
      address: this.addressForm.value ?? '',
      date: new Date(),
      totalAmount: this.totalAmount,
    };

    if (order.paymentType === 'card') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!this.cardElementMounted) {
        console.error('Card element not mounted. Exiting payment process.');
        return;
      }

      this.stripeService.createPaymentIntent(this.totalAmount).subscribe({
        next: async (result) => {
          const clientSecret = result.clientSecret;

          if (!this.cardElement) {
            console.error('Card element is missing.');
            return;
          }

          if (!this.stripe) {
            console.error('Stripe is not initialized.');
            return;
          }

          this.stripe
            ?.confirmCardPayment(clientSecret, {
              payment_method: {
                card: this.cardElement,
              },
            })
            .then((result) => {
              if (result.error) {
                console.error('Payment confirmation error:', result.error);
                alert('Payment failed. Please try again.');
              } else if (
                result.paymentIntent &&
                result.paymentIntent.status === 'succeeded'
              ) {
                order.paymentIntentId = result.paymentIntent.id;
                this.placeOrder(order);
              }
            });
        },
        error: (error) => {
          console.error('Error creating PaymentIntent', error);
        },
      });
    } else {
      this.placeOrder(order);
    }
  }

  placeOrder(order: Order) {
    this.orderService.addOrder(order).subscribe({
      next: () => {
        alert('Order Placed!');
        this.cartService.initCart();
        this.router.navigateByUrl('/orders');
      },
      error: (error) => {
        console.error('Error adding order', error);
      },
    });
  }
}
