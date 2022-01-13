import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { CarritoService } from 'src/app/services/carrito.service';

import { WebSocketService } from 'src/app/services/web-socket.service';

declare var jQuery: any;
declare var $: any;

declare var iziToast: any;

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  currentUser: any;
  userLabel: string;

  currentUser$: Observable<any>;

  config_categorias: any;

  cart_modal: boolean = false;

  carrito_array: Array<any> = [];

  subtotal = 0;

  descuento_activo: any;

  constructor(
    private auth: AuthService,
    private clientService: ClienteService,
    private carritoService: CarritoService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {
    this.clientService.getPublicConfig().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.config_categorias = resp.data;
        }

        this.load_data = false;
        /* 
          this.updateForm.reset();
          this.router.navigateByUrl('/panel/clientes'); */
      },
      error: (error) => {
        this.load_data = false;
        console.log('error', error);
        /*         iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: error.error.message,
          }); */
      },
    });

    this.clientService.getPromacionesActivas().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.descuento_activo = resp.data[0];
        }

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });
  }

  ngOnInit(): void {
    this.webSocketService.listen('new-carrito').subscribe((data) => {
      console.log('FROMM WEBSOCKET SERVICE', data);
      this.getCarrito();
    });

    this.webSocketService.listen('new-carrito-add').subscribe((data) => {
      console.log('FROMM WEBSOCKET SERVICE new-carrito-add', data);
      this.getCarrito();
    });

    this.auth.currentUser$.subscribe((x: any) => {
      this.currentUser = x;
      this.userLabel = `${this.currentUser?.name} ${this.currentUser?.lastname}`;

      this.getCarrito();
    });
  }

  logout() {
    this.auth.logout();
  }

  getCarrito() {
    this.carritoService
      .getCarrito(this.currentUser._id)
      .subscribe((res: any) => {
        this.carrito_array = res.data;
        this.calculateCarrito();
      });
  }

  openModalCart() {
    if (!this.cart_modal) {
      this.cart_modal = true;
      $('#cart').addClass('show');
    } else {
      this.cart_modal = false;
      $('#cart').removeClass('show');
    }
  }

  calculateCarrito() {
    this.subtotal = 0;

    if (!this.descuento_activo) {
      this.carrito_array.forEach((element) => {
        this.subtotal =
          this.subtotal + parseInt(element.product.price) * element.cantidad;
      });
    } else if (this.descuento_activo) {
      this.carrito_array.forEach((element) => {
        let new_precio = Math.round(
          parseInt(element.product.price) -
            (parseInt(element.product.price) *
              this.descuento_activo.descuento) /
              100
        );
        this.subtotal = this.subtotal + new_precio * element.cantidad;
      });
    }
  }

  deleteItem(id: any) {
    this.carritoService.deleteCarrito(id).subscribe({
      next: (resp: any) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto del carrito',
        });

        this.webSocketService.emit('delete-carrito', { data: resp.data });

        this.load_data = false;
        /* 
          this.updateForm.reset();
          this.router.navigateByUrl('/panel/clientes'); */
      },
      error: (error) => {
        this.load_data = false;
        console.log('error', error);
        /*         iziToast.show({
            title: 'ERROR',
            titleColor: '#FF0000',
            color: '#FFF',
            class: 'text-danger',
            position: 'topRight',
            message: error.error.message,
          }); */
      },
    });
  }
}
