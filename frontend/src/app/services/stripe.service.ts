import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { loadStripe, Stripe } from '@stripe/stripe-js';

import { environment } from '../../environments/environment.production';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private stripePromise: Promise<Stripe | null>;

  http = inject(HttpClient);

  constructor() {
    this.stripePromise = loadStripe(environment.stripePublicKey);
  }

  async confirmPayment(clientSecret: string, cardElement: any) {
    const stripe = await this.stripePromise;

    if (!stripe) {
      throw new Error('Stripe not loaded');
    }

    return stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
  }

  createPaymentIntent(amount: number) {
    return this.http.post<{ clientSecret: string }>(
      environment.apiURL + '/payment/create-payment-intent',
      { amount },
    );
  }
}
