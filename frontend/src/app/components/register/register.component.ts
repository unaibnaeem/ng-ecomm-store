import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  showPassword = false;

  formBuilder = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  onRegister() {
    let value = this.registerForm.value;

    this.authService
      .registerUser(value.name!, value.email!, value.password!)
      .subscribe({
        next: () => {
          alert('User Registered!');
          this.router.navigateByUrl('/login');
        },
      });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
