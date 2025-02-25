import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-category-form',
  imports: [FormsModule, RouterLink, MatButtonModule, MatInputModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent {
  id!: string;
  categoryName!: string;
  isEdit = false;

  router = inject(Router);
  route = inject(ActivatedRoute);
  categoryService = inject(CategoryService);

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    console.log(this.id);

    if (this.id) {
      this.isEdit = true;
      this.categoryService.getCategoryById(this.id).subscribe((result: any) => {
        console.log(result);
        this.categoryName = result.name;
      });
    }
  }

  onAddCategory() {
    console.log(this.categoryName);
    this.categoryService
      .addCategory(this.categoryName)
      .subscribe((result: any) => {
        alert('Category Added!');
        this.router.navigateByUrl('/admin/categories');
      });
  }

  onUpdateCategory() {
    console.log(this.categoryName);
    this.categoryService.updateCategory(this.id, this.categoryName).subscribe({
      next: (result: any) => {
        alert('Category Updated!');
        this.router.navigateByUrl('/admin/categories');
      },
      error: (err) => {
        console.error('Error from API', err);
        alert('Failed to add Category. Check console for details.');
      },
    });
  }
}
