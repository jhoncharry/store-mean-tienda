import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private url;

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

  createCarrito(formData: any) {
    return this.http.post(this.url + '/carrito', formData, this.headers);
  }

  getCarrito(id: any) {
    return this.http.get(this.url + `/carrito/${id}`, this.headers);
  }

  deleteCarrito(id: any) {
    return this.http.delete(this.url + `/carrito/${id}`, this.headers);
  }
}
