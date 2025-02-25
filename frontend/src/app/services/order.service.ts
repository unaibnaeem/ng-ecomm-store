import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment.production';

import { type Order } from '../types/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  http = inject(HttpClient);

  constructor() {}

  getOrders() {
    return this.http.get<Order[]>(environment.apiURL + '/orders');
  }

  addOrder(order: Order) {
    return this.http.post(environment.apiURL + '/order', order);
  }

  getAdminOrders() {
    return this.http.get<Order[]>(environment.apiURL + '/all-orders');
  }

  updateOrderStatus(id: string, status: string) {
    return this.http.post(environment.apiURL + '/all-orders/' + id, {
      status: status,
    });
  }

  deleteOrder(id: string) {
    return this.http.delete<Order[]>(environment.apiURL + '/all-orders/' + id);
  }
}
