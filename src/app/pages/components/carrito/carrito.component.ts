import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, lastValueFrom, pipe } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { VentaService } from 'src/app/services/venta.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';

declare var iziToast: any;

declare var StickySidebar: any;

declare var paypal: any;

declare global {
  interface Window {
    Stripe?: any;
  }
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css'],
})
export class CarritoComponent implements OnInit {
  @ViewChild('paypalButton', { static: true }) paypalElement: ElementRef;

  private readonly STRIPE!: any;
  private elementStripe!: any;

  cardNumber: any;
  cardCvv: any;
  cardExp: any;

  id: string;
  orderData: any;

  submitted = false;

  load_btn = false;
  load_data = true;

  currentUser: any;
  userLabel: string;

  carrito_array: Array<any> = [];

  subtotal = 0;
  total_pagar = 0;

  direccion_principal: any = undefined;
  envios: Array<any> = [];

  envio_precio = '0';

  descuento = 0;
  error_cupon = '';

  venta: any = {};
  detalle_venta: Array<any> = [];

  descuento_activo: any;

  form = this.fb.group({
    cardNumber: [false, [Validators.required, Validators.requiredTrue]], //TODO true | false
    cardCvv: [false, [Validators.required, Validators.requiredTrue]], //TODO true | false
    cardExp: [false, [Validators.required, Validators.requiredTrue]], //TODO true | false
  });

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private carritoService: CarritoService,
    private clientService: ClienteService,
    private ventaService: VentaService,
    private webSocketService: WebSocketService,
    private router: Router
  ) {
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

    this.auth.currentUser$.pipe(first()).subscribe((x: any) => {
      this.currentUser = x;
      this.userLabel = `${this.currentUser?.name} ${this.currentUser?.lastname}`;

      this.venta.client = this.currentUser._id;

      this.getCarrito();
    });

    this.clientService.getEnvios().subscribe((resp: any) => {
      this.envios = resp;
    });

    this.STRIPE = window.Stripe(environment.stripe_pk);
  }

  ngOnInit(): void {
    this.webSocketService.listen('new-carrito').subscribe((data) => {
      this.getCarrito();
    });

    setTimeout(() => {
      var sidebar = new StickySidebar('.sidebar-sticky', { topSpacing: 20 });
    });

    paypal
      .Buttons({
        style: {
          layout: 'horizontal',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: 'Nombre del pago',
                amount: {
                  currency_code: 'USD',
                  value: 15,
                },
              },
            ],
          });
        },
        onApprove: async (data: any, actions: any) => {
          const order = await actions.order.capture();

          this.venta.transaccion =
            order.purchase_units[0].payments.captures[0].id;

          this.venta.detalles = this.detalle_venta;

          this.ventaService.createVenta(this.venta).subscribe({
            next: (resp: any) => {
              this.ventaService
                .sendCompraEmail(resp.ventaSaved._id)
                .subscribe((resp) => {
                  iziToast.show({
                    title: 'SUCCESS',
                    titleColor: '#1DC74C',
                    color: '#FFF',
                    class: 'text-success',
                    position: 'topRight',
                    message:
                      'Compra realizada con exito, por favor revise su email',
                  });

                  this.router.navigateByUrl('/');
                });

              this.load_data = false;
            },
            error: (error) => {
              this.load_data = false;
              iziToast.show({
                title: 'ERROR',
                titleColor: '#FF0000',
                color: '#FFF',
                class: 'text-danger',
                position: 'topRight',
                message:
                  'Por favor verifique su metodo de pago o los campos requiridos(Cliente, Direccion...)',
              });
              this.router.navigateByUrl('/');
            },
          });
        },
        onError: (err: any) => {},
        onCancel: function (data: any, actions: any) {},
      })
      .render(this.paypalElement.nativeElement);

    this.getDireccionPrincipal();
    this.createStripeElement();
  }

  private createStripeElement = () => {
    const style = {
      base: {
        color: '#000000',
        fontWeight: 400,
        fontFamily: "'Poppins', sans-serif",
        fontSize: '20px',
        '::placeholder': {
          color: '#E3E2EC',
        },
      },
      invalid: {
        color: '#dc3545',
      },
    };

    //TODO: SDK de Stripe inicia la generacion de elementos
    this.elementStripe = this.STRIPE.elements({
      fonts: [
        {
          cssSrc:
            'https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400&display=swap',
        },
      ],
    });

    //TODO: SDK Construimos los inputs de tarjeta, cvc, fecha con estilos
    const cardNumber = this.elementStripe.create('cardNumber', {
      placeholder: '4242 4242 4242 4242',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });
    const cardExp = this.elementStripe.create('cardExpiry', {
      placeholder: 'MM/AA',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });
    const cardCvc = this.elementStripe.create('cardCvc', {
      placeholder: '000',
      style,
      classes: {
        base: 'input-stripe-custom',
      },
    });

    //TODO: SDK Montamos los elementos en nuestros DIV identificados on el #id
    cardNumber.mount('#card');
    cardExp.mount('#exp');
    cardCvc.mount('#cvc');

    this.cardNumber = cardNumber;
    this.cardExp = cardExp;
    this.cardCvv = cardCvc;

    //TODO: Escuchamos los eventos del SDK
    this.cardNumber.addEventListener('change', this.onChangeCard.bind(this));
    this.cardExp.addEventListener('change', this.onChangeExp.bind(this));
    this.cardCvv.addEventListener('change', this.onChangeCvv.bind(this));
  };

  async initPay(): Promise<any> {
    try {
      this.form.disable();

      if (this.carrito_array.length >= 1) {
        //TODO: SDK de Stripe genera un TOKEN para la intencion de pago!
        const { token } = await this.STRIPE.createToken(this.cardNumber);

        this.venta.detalles = this.detalle_venta;

        this.ventaService.createVenta(this.venta).subscribe({
          next: (resp: any) => {
            this.load_data = false;

            if (resp.ventaSaved) {
              let id_venta = resp.ventaSaved._id;
              let data = {
                token: token.id,
                ventaId: resp.ventaSaved._id,
              };

              this.ventaService.payByCard(data).subscribe({
                next: (resp: any) => {
                  this.ventaService
                    .sendCompraEmail(id_venta)
                    .subscribe((resp) => {
                      iziToast.show({
                        title: 'SUCCESS',
                        titleColor: '#1DC74C',
                        color: '#FFF',
                        class: 'text-success',
                        position: 'topRight',
                        message:
                          'Compra realizada con exito, por favor revise su email',
                      });

                      this.router.navigateByUrl('/');
                    });

                  this.load_data = false;
                },
                error: (error) => {
                  this.load_data = false;
                },
              });
            }
          },
          error: (error) => {
            this.load_data = false;
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FF0000',
              color: '#FFF',
              class: 'text-danger',
              position: 'topRight',
              message:
                'Por favor verifique su metodo de pago o los campos requiridos(Cliente, Direccion...)',
            });
            this.router.navigateByUrl('/');
          },
        });
      } else {
      }
    } catch (e) {
      console.log(e);
    }
  }

  //TODO: Manejadores de validacion de input de stripe

  onChangeCard({ error }: any) {
    this.form.patchValue({ cardNumber: !error });
  }

  onChangeCvv({ error }: any) {
    this.form.patchValue({ cardCvv: !error });
  }

  onChangeExp({ error }: any) {
    this.form.patchValue({ cardExp: !error });
  }

  getDireccionPrincipal() {
    this.clientService.getDireccionPrincipal(this.currentUser._id).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.direccion_principal = resp.data;
          this.venta.direccion = this.direccion_principal._id;
        }

        this.load_data = false;
        /* 
            this.updateForm.reset();
            this.router.navigateByUrl('/panel/clientes'); */
      },
      error: (error) => {
        this.load_data = false;
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

  async getCarrito() {
    this.carritoService
      .getCarrito(this.currentUser._id)
      .subscribe(async (res: any) => {
        this.carrito_array = res.data;

        this.carrito_array.forEach((element) => {
          this.detalle_venta.push({
            product: element.product._id,
            subtotal: element.product.price,
            variedad: element.variedad,
            cantidad: element.cantidad,
            client: this.currentUser._id,
          });
        });

        await this.getPromociones();
        this.calculateCarrito();
        this.calculateTotal('Envio gratis');
      });
  }

  async getPromociones() {
    try {
      const resp: any = await lastValueFrom(
        this.clientService.getPromacionesActivas()
      );
      this.descuento_activo = resp.data[0];
    } catch (error) {
      console.log(error);
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

    this.total_pagar = this.subtotal;
  }

  calculateTotal(envio_titulo: any) {
    this.total_pagar = this.subtotal + parseInt(this.envio_precio);

    this.venta.subtotal = this.total_pagar;
    this.venta.envio_precio = parseInt(this.envio_precio);
    this.venta.envio_titulo = envio_titulo;
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

        this.getCarrito();

        this.load_data = false;
      },
      error: (error) => {
        this.load_data = false;
      },
    });
  }

  validarCupon() {
    this.error_cupon = '';

    if (this.venta.cupon) {
      if (this.venta.cupon.toString().length <= 25) {
        this.clientService
          .getValidateCupon(this.venta.cupon)
          .subscribe((resp: any) => {
            if (resp.data) {
              this.error_cupon = '';

              if (resp.data.tipo == 'valor-fijo') {
                this.descuento = resp.data.valor;
                this.total_pagar = this.total_pagar - this.descuento;
                this.venta.subtotal = this.total_pagar;
              } else if (resp.data.tipo == 'porcentaje') {
                this.descuento = Math.round(
                  (this.total_pagar * resp.data.valor) / 100
                );
                this.total_pagar = this.total_pagar - this.descuento;
                this.venta.subtotal = this.total_pagar;
              }
            } else {
              this.error_cupon = 'El cupon no se pudo canjear';
            }
          });
      } else {
        //NO ES VALIDO
        this.error_cupon = 'El  cupon debe ser menos de 25 caracteres';
      }
    } else {
      this.error_cupon = 'El  cupon no es valido';
    }
  }
}
