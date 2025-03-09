import {
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter, pairwise, Subscription } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { StateService } from '../../services/state.service';

import { type Category } from '../../types/category';

@Component({
  selector: 'app-header',
  imports: [RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  categoryList: Category[] = [];
  searchTerm!: string;
  isMobileMenuOpen: boolean = false;
  private routeSubscription!: Subscription;

  @ViewChild('categoryListContainer', { static: false })
  categoryListContainer!: ElementRef;

  router = inject(Router);
  authService = inject(AuthService);
  customerService = inject(CustomerService);
  stateService = inject(StateService);

  ngOnInit() {
    if (this.authService.isLoggedIn) {
      this.fetchCategories();
    }

    this.authService.accessToken$.subscribe({
      next: (token) => {
        if (token) {
          this.fetchCategories();
        }
      },
    });

    this.routeSubscription = this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        pairwise(),
      )
      .subscribe(([previousRoute, currentRoute]) => {
        this.isMobileMenuOpen = false;

        const isLeavingSearchPage =
          previousRoute.url.includes('/products') &&
          !currentRoute.url.includes('/products');

        if (isLeavingSearchPage) {
          this.searchTerm = '';
        }
      });
  }

  get shouldShowSearchBar(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return !hiddenRoutes.includes(this.router.url);
  }

  fetchCategories() {
    this.customerService.getCategories().subscribe({
      next: (result: any) => {
        this.categoryList = result;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  onLogoClick() {
    this.router.navigate(['/']).then(() => {
      this.stateService.triggerHomeReset();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth >= 1024) {
      this.isMobileMenuOpen = false;
    }
  }

  scrollCategories(distance: number) {
    if (this.categoryListContainer) {
      this.categoryListContainer.nativeElement.scrollBy({
        left: distance,
        behavior: 'smooth',
      });
    }
  }

  onSearch(event: any) {
    if (event.target.value) {
      this.router.navigateByUrl('products?search=' + event.target.value);
    }
  }

  onSelectCategory(category: Category) {
    this.searchTerm = '';
    this.stateService.resetPage();
    this.router.navigateByUrl('products?categoryId=' + category._id);
  }

  onLogout() {
    this.authService.logoutUser();
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }
}
