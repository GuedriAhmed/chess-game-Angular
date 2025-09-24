import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string; // e.g., "Login successful" or "failed"
  token?: string;  // optional JWT if your backend sends one
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    const payload: LoginRequest = { username, password };
    return this.http.post<LoginResponse>(`${this.apiUrl}/signin`, payload);
  }
}
