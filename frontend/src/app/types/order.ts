import { type Cart } from './cart';

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Order {
  _id?: string;
  userId: User;
  items: Cart[];
  paymentType: string;
  address: any;
  date: Date;
  totalAmount: number;
  status?: string;
  paymentIntentId?: string;
}
