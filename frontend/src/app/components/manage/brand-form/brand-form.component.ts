import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brand-form',
  imports: [FormsModule, RouterLink, MatButtonModule, MatInputModule],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent {
  id!: string;
  brandName!: string;
  isEdit = false;

  brandService = inject(BrandService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.isEdit = true;
      this.brandService.getBrandById(this.id).subscribe((result: any) => {
        console.log(result);
        this.brandName = result.name;
      });
    }
  }

  onAddBrand() {
    console.log(this.brandName);
    this.brandService.addBrand(this.brandName).subscribe({
      next: (result: any) => {
        alert('Brand Added!');
        this.router.navigateByUrl('/admin/brands');
      },
      error: (err) => {
        console.error('Error from API', err);
        alert('Failed to add brand. Check console for details.');
      },
    });
  }

  onUpdateBrand() {
    console.log(this.brandName);
    this.brandService.updateBrand(this.id, this.brandName).subscribe({
      next: (result: any) => {
        alert('Brand Updated!');
        this.router.navigateByUrl('/admin/brands');
      },
      error: (err) => {
        console.error('Error from API', err);
        alert('Failed to update brand. Check console for details.');
      },
    });
  }
}
