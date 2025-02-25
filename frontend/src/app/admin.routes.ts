import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import(
        './components/manage/admin-dashboard/admin-dashboard.component'
      ).then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./components/manage/categories/categories.component').then(
        (m) => m.CategoriesComponent,
      ),
  },
  {
    path: 'categories/add',
    loadComponent: () =>
      import('./components/manage/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent,
      ),
  },
  {
    path: 'categories/:id',
    loadComponent: () =>
      import('./components/manage/category-form/category-form.component').then(
        (m) => m.CategoryFormComponent,
      ),
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('./components/manage/brands/brands.component').then(
        (m) => m.BrandsComponent,
      ),
  },
  {
    path: 'brands/add',
    loadComponent: () =>
      import('./components/manage/brand-form/brand-form.component').then(
        (m) => m.BrandFormComponent,
      ),
  },
  {
    path: 'brands/:id',
    loadComponent: () =>
      import('./components/manage/brand-form/brand-form.component').then(
        (m) => m.BrandFormComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./components/manage/products/products.component').then(
        (m) => m.ProductsComponent,
      ),
  },
  {
    path: 'products/add',
    loadComponent: () =>
      import('./components/manage/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./components/manage/product-form/product-form.component').then(
        (m) => m.ProductFormComponent,
      ),
  },
  {
    path: 'all-orders',
    loadComponent: () =>
      import('./components/manage/orders/orders.component').then(
        (m) => m.OrdersComponent,
      ),
  },
];
