import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  showPassword = false;
  errorMessage: string | null = null;

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  onLogin() {
    if (this.loginForm.invalid) return;

    let value = this.loginForm.value;

    this.authService.loginUser(value.email!, value.password!).subscribe({
      next: (result: any) => {
        localStorage.setItem('accessToken', result.accessToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        console.error('Login error:', err);

        this.errorMessage =
          err.error?.error || 'Invalid email or password. Please try again.';
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
