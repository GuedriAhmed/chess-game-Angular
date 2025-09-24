import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, MatIconModule, HttpClientModule, NgIf, CommonModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    const payload = {
      username: this.username,
      password: this.password
    };

    // Use responseType 'text' because backend returns plain text
    this.http.post('http://localhost:8080/api/auth/register', payload, { responseType: 'text' })
      .pipe(
        catchError(err => {
          console.error(err);
          this.errorMessage.set('Server error');
          return of('Registration failed');
        })
      )
      .subscribe(res => {
        if (res === 'User registered successfully') {
          this.successMessage.set('Registration successful! Redirecting to login...');
          console.log("Registration successful! Redirecting to login...")
          setTimeout(() => this.router.navigate(['/auth/login']), 200);
        } else {
          this.errorMessage.set('Registration failed: ' + res);
        }
      });
  }
}
