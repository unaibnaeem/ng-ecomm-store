import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';

import { OrderService } from '../../../services/order.service';

import { type Order } from '../../../types/order';
import { type Product } from '../../../types/product';

@Component({
  selector: 'app-orders',
  imports: [FormsModule, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent {
  allOrders: Order[] = [];
  isLoading: boolean = false;

  orderService = inject(OrderService);
  snackBar = inject(MatSnackBar);

  ngOnInit() {
    this.isLoading = true;

    this.orderService.getAdminOrders().subscribe({
      next: (result) => {
        this.allOrders = result.map((order) => ({
          ...order,
          status: order.status || 'Processing',
        }));
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

  updateStatus(orderId: string, orderStatus: string) {
    this.orderService.updateOrderStatus(orderId, orderStatus).subscribe({
      next: () => {
        this.snackBar.open(
          `Order ${orderId} status updated to ${orderStatus}`,
          'Close',
          {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'custom-snackbar',
          },
        );
      },
      error: () => {
        this.snackBar.open('Failed to update order status', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center',
          panelClass: 'error-snackbar',
        });
      },
    });
  }

  deleteOrder(orderId: string) {
    if (confirm('Are you sure you want to delete this order?')) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: () => {
          this.allOrders = this.allOrders.filter(
            (order) => order._id !== orderId,
          );
          this.snackBar.open('Order deleted successfully!', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'custom-snackbar',
          });
        },
        error: () => {
          this.snackBar.open('Failed to delete order', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
            panelClass: 'error-snackbar',
          });
        },
      });
    }
  }
}
