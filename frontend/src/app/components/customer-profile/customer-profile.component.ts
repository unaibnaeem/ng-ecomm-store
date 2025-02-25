import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-profile',
  imports: [],
  templateUrl: './customer-profile.component.html',
  styleUrl: './customer-profile.component.scss',
})
export class CustomerProfileComponent {
  router = inject(Router);
  authService = inject(AuthService);

  onLogout() {
    this.authService.logoutUser();
    this.router.navigateByUrl('/login');
  }
}
