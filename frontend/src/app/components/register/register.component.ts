import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, NgClass, MatInputModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formBuilder = inject(FormBuilder);

  registerForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  router = inject(Router);
  authService = inject(AuthService);

  onRegister() {
    let value = this.registerForm.value;

    this.authService
      .registerUser(value.name!, value.email!, value.password!)
      .subscribe({
        next: (result) => {
          alert('User Registered!');
          this.router.navigateByUrl('/login');
        },
      });
  }
}
