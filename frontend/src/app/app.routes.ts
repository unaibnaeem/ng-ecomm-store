import { Routes } from '@angular/router';

import { authGuard } from './core/auth-guard';
import { adminGuard } from './core/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./components/customer-profile/customer-profile.component').then(
        (m) => m.CustomerProfileComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/product-list/product-list.component').then(
        (m) => m.ProductListComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-detail/product-detail.component').then(
        (m) => m.ProductDetailComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'featured-products',
    loadComponent: () =>
      import('./components/featured-products/featured-products.component').then(
        (m) => m.FeaturedProductsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'new-products',
    loadComponent: () =>
      import('./components/new-products/new-products.component').then(
        (m) => m.NewProductsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./components/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/shopping-cart/shopping-cart.component').then(
        (m) => m.ShoppingCartComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./components/customer-orders/customer-orders.component').then(
        (m) => m.CustomerOrdersComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: 'error-handler', pathMatch: 'full' },
];
