import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, ReplaySubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url;

  // We need to have something which won't emit initial value rather wait till it has something.
  // Hence for that ReplaySubject. I have given to hold one user object and it will cache this as well
  private currentUserSource = new ReplaySubject<any>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) {
    this.url = environment.api;
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        token: this.token,
      },
    };
  }

  // Init to get currentUser when page reload o load for the first time
  loadCurrentUser(): Observable<any> {
    if (!this.token) {
      console.log('111111111');
      this.currentUserSource.next(null);
      return of(null);
    }
    console.log('33333333');
    return this.getInitCurrentUser();
  }

  // Check if there's a user logged in
  isLoggedIn(): Observable<any> {
    if (!this.token) {
      console.log('222222222222');
      this.currentUserSource.next(null);
      return of(false);
    }
    console.log('44444444444');
    return this.validateToken();
  }

  // Check if user session is valid, sending for new token.
  // Base del auth.guard
  validateToken(): Observable<boolean> {
    return this.http
      .get(this.url + 'client/login/renew', {
        headers: {
          token: this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          if (resp.data) {
            const user = resp.data;
            this.currentUserSource.next(user);
            return true;
          }
          this.logout();
          this.currentUserSource.next(null);
          return false;
        }),
        catchError((error) => {
          this.logout();
          this.currentUserSource.next(null);
          return of(false);
        })
      );
  }

  // Method to get the current user when page reload or it's loaded for the first time
  getInitCurrentUser() {
    return this.http
      .get(this.url + 'client/login/renew', {
        headers: {
          token: this.token,
        },
      })
      .pipe(
        map((resp: any) => {
          if (resp.data) {
            const user = resp.data;
            this.currentUserSource.next(user);
            return user;
          }
          this.logout();
          this.currentUserSource.next(null);
          return null;
        }),
        catchError((error) => {
          this.logout();
          this.currentUserSource.next(null);
          return of(null);
        })
      );
  }

  // User login method
  login(formData: any) {
    return this.http.post(this.url + 'client/login', formData).pipe(
      tap((resp: any) => {
        if (resp.data) {
          const user = resp.data;
          this.currentUserSource.next(user);
          return user;
        }
        this.logout();
        this.currentUserSource.next(null);
        return null;
      }),
      catchError((error) => {
        this.logout();
        this.currentUserSource.next(null);
        return of(null);
      })
    );
  }

  // User logout method
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');

    this.currentUserSource.next(null);
  }
}
