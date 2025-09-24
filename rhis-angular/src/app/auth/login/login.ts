import { Component, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule, NgIf } from '@angular/common';
import { LoginRequest } from '../../model/login-request';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MatIconModule, FormsModule, NgIf, CommonModule, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = signal('');
  password = signal('');
  errorMessage = signal('');

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const payload: LoginRequest = {
      username: this.username(),
      password: this.password()
    };

    // Use responseType 'text' because your backend returns plain text
    this.http.post('http://localhost:8080/api/auth/signin', payload, { responseType: 'text' })
      .pipe(
        catchError(err => {
          console.error(err);
          this.errorMessage.set('Server error');
          return of('Login failed');
        })
      )
      .subscribe(res => {
        if (res === 'Login successful') {
          // Save username for board / WebSocket usage
          localStorage.setItem('username', this.username());
          // Navigate to board
          this.router.navigate(['/board']);
        } else {
          this.errorMessage.set('Invalid credentials');
        }
      });
  }
}
