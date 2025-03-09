import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { OrderService } from '../../services/order.service';

import { type Order } from '../../types/order';
import { type Product } from '../../types/product';

@Component({
  selector: 'app-customer-orders',
  imports: [RouterLink, DatePipe],
  templateUrl: './customer-orders.component.html',
  styleUrl: './customer-orders.component.scss',
})
export class CustomerOrdersComponent {
  orders: Order[] = [];
  isLoading: boolean = false;

  orderService = inject(OrderService);

  ngOnInit() {
    this.isLoading = true;

    this.orderService.getOrders().subscribe({
      next: (result) => {
        this.orders = result;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  sellingPrice(product: Product) {
    return Math.round(product.price - (product.price * product.discount) / 100);
  }
}
