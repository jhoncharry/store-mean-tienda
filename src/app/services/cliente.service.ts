import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
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

  createClient(formData: any) {
    return this.http.post(this.url + '/client', formData, this.headers);
  }

  updateClient(id: any, formData: any) {
    return this.http.put(this.url + `/client/${id}`, formData, this.headers);
  }

  // Configuraciones
  getPublicConfig() {
    return this.http.get(this.url + `/client/config`);
  }

  // Direcciones

  createDireccion(formData: any) {
    return this.http.post(
      this.url + '/client/direccion',
      formData,
      this.headers
    );
  }

  getRegiones() {
    return this.http.get('./assets/regiones.json');
  }

  getProvincias() {
    return this.http.get('./assets/provincias.json');
  }

  getDistritos() {
    return this.http.get('./assets/distritos.json');
  }

  getEnvios() {
    return this.http.get('./assets/envios.json');
  }

  getDirecciones(id: any) {
    return this.http.get(this.url + `/client/direccion/${id}`, this.headers);
  }

  getDireccionPrincipal(id: any) {
    return this.http.get(
      this.url + `/client/direccion/principal/${id}`,
      this.headers
    );
  }

  updateDireccionPrincipal(id: any, clientId: any) {
    return this.http.put(
      this.url + `/client/direccion/${id}/${clientId}`,
      { data: true },
      this.headers
    );
  }

  getValidateCupon(cupon: any) {
    return this.http.get(this.url + `/cupon/${cupon}`, this.headers);
  }

  getPromacionesActivas() {
    return this.http.get(this.url + `/client/activa/promociones`, this.headers);
  }

  // Contact
  createContact(formData: any) {
    return this.http.post(this.url + '/client/contact', formData, this.headers);
  }

  // Ordenes
  getOrdenesClient(id: any) {
    return this.http.get(this.url + `/client/ordenes/${id}`, this.headers);
  }

  getDetalleOrden(id: any) {
    return this.http.get(
      this.url + `/client/orden-detalle/${id}`,
      this.headers
    );
  }

  // Review
  createReview(formData: any) {
    return this.http.post(this.url + '/client/review', formData, this.headers);
  }

  getReviewsProduct(id: any) {
    return this.http.get(
      this.url + `/client/reviews/product/${id}`,
      this.headers
    );
  }

  getReviewsClient(id: any) {
    return this.http.get(
      this.url + `/client/reviews/products/client/${id}`,
      this.headers
    );
  }
}
