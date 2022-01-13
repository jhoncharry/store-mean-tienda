import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
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

  getProducts(filtro: any) {
    return this.http.get(this.url + `/products/${filtro}`, this.headers);
  }

  getProductBySlug(slug: any) {
    return this.http.get(this.url + `/product/${slug}`, this.headers);
  }

  getRecommendProducts(categoria: any) {
    return this.http.get(
      this.url + `/products/recommend/${categoria}`,
      this.headers
    );
  }

  getNewProducts() {
    return this.http.get(this.url + `/new/products`, this.headers);
  }

  getProductsMasVendidos() {
    return this.http.get(this.url + `/ventas/products`, this.headers);
  }

  getReviewsProductPopulate(id: any) {
    return this.http.get(
      this.url + `/client/reviews/product/populate/${id}`,
      this.headers
    );
  }
}
