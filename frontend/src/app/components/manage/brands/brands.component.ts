import { Component, inject, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { BrandService } from '../../../services/brand.service';

import { type Brand } from '../../../types/brand';

@Component({
  selector: 'app-brands',
  imports: [
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
})
export class BrandsComponent {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Brand>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  brandService = inject(BrandService);

  constructor() {
    this.dataSource = new MatTableDataSource([] as any);
  }

  ngOnInit() {
    this.getServerData();
  }

  private getServerData() {
    this.brandService.getBrands().subscribe((result) => {
      this.dataSource.data = result;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDeleteBrands(id: string) {
    this.brandService.deleteBrand(id).subscribe((result: any) => {
      alert('Brand Deleted!');
      this.getServerData();
    });
  }
}
