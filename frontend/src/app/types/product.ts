import { type Review } from './review';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  discount: number;
  images: string[];
  categoryId: string;
  isFeaturedProduct: boolean;
  isNewProduct: boolean;
  reviews: Review[];
}
