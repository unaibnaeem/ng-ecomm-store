import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-error-handler',
  imports: [],
  templateUrl: './error-handler.component.html',
  styleUrl: './error-handler.component.scss',
})
export class ErrorHandlerComponent {
  router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    this.redirectUser();
  }

  redirectUser() {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
