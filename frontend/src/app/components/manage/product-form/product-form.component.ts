import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { CategoryService } from '../../../services/category.service';
import { BrandService } from '../../../services/brand.service';
import { ProductService } from '../../../services/product.service';

import { type Category } from '../../../types/category';
import { type Brand } from '../../../types/brand';

@Component({
  selector: 'app-product-form',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent {
  id!: string;
  isEdit = false;
  categories: Category[] = [];
  brands: Brand[] = [];

  router = inject(Router);
  route = inject(ActivatedRoute);
  formBuilder = inject(FormBuilder);

  categoryService = inject(CategoryService);
  brandService = inject(BrandService);
  productService = inject(ProductService);

  productForm = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    shortDescription: [null, [Validators.required, Validators.minLength(10)]],
    description: [null, [Validators.required, Validators.minLength(20)]],
    price: [null, Validators.required],
    discount: [0],
    images: this.formBuilder.array([]),
    categoryId: [null, Validators.required],
    brandId: [null, Validators.required],
    isFeaturedProduct: [false],
    isNewProduct: [false],
  });

  ngOnInit() {
    this.categoryService.getCategories().subscribe((result) => {
      this.categories = result;
    });
    this.brandService.getBrands().subscribe((result) => {
      this.brands = result;
    });

    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.isEdit = true;
      this.productService.getProductById(this.id).subscribe({
        next: (result: any) => {
          for (let i = 0; i < result.images.length; i++) {
            this.onAddImage();
          }
          this.productForm.patchValue(result);
        },
      });
    } else {
      this.onAddImage();
    }
  }

  get images() {
    return this.productForm.get('images') as FormArray;
  }

  onAddImage() {
    this.images.push(this.formBuilder.control(null));
  }

  onRemoveImage() {
    this.images.removeAt(this.images.controls.length - 1);
  }

  onAddProduct() {
    let value = this.productForm.value;
    console.log(value);

    this.productService.addProduct(value as any).subscribe({
      next: (result: any) => {
        alert('Product Added!');
        this.router.navigateByUrl('/admin/products');
      },
      error: (err) => {
        console.error('Error from API', err);
        alert('Failed to add product.');
      },
    });
  }

  onUpdateProduct() {
    let value = this.productForm.value;

    this.productService.updateProduct(this.id, value as any).subscribe({
      next: (result) => {
        alert('Product Updated!');
        this.router.navigateByUrl('/admin/products');
      },
      error: (err) => {
        console.error('Error from API', err);
        alert('Failed to update product.');
      },
    });
  }
}
