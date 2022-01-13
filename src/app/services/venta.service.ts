import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
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

  createVenta(formData: any) {
    return this.http.post(this.url + '/venta', formData, this.headers);
  }

  payByCard(formData: any) {
    return this.http.post(this.url + '/payment/card', formData, this.headers);
  }

  sendCompraEmail(id: any) {
    return this.http.get(
      this.url + `/send-email/compra/${id}`,

      this.headers
    );
  }
}
