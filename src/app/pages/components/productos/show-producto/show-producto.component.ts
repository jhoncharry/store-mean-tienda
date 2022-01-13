import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { first } from 'rxjs';
import { CarritoService } from 'src/app/services/carrito.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var tns: any;
declare var lightGallery: any;

declare var iziToast: any;

@Component({
  selector: 'app-show-producto',
  templateUrl: './show-producto.component.html',
  styleUrls: ['./show-producto.component.css'],
})
export class ShowProductoComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  btn_cart: boolean = false;

  slug: any;
  product: any = {};
  products_recommend: Array<any> = [];

  carrito_data: any = {
    variedad: null,
    cantidad: 1,
  };

  private id: any;

  descuento_activo: any;

  reviews: Array<any> = [];

  public page = 1;
  public pageSize = 15;

  public count_five_start = 0;
  public count_four_start = 0;
  public count_three_start = 0;
  public count_two_start = 0;
  public count_one_start = 0;

  public total_puntos = 0;
  public max_puntos = 0;
  public porcent_raiting = 0;
  public puntos_raiting = 0;

  public cinco_porcent = 0;
  public cuatro_porcent = 0;
  public tres_porcent = 0;
  public dos_porcent = 0;
  public uno_porcent = 0;

  constructor(
    private productService: ProductService,
    private auth: AuthService,
    private carritoService: CarritoService,
    private clientService: ClienteService,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute
  ) {
    this.auth.currentUser$.pipe(first()).subscribe({
      next: (resp: any) => {
        const { _id } = resp || null;

        this.id = _id;

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });

    this.route.params.subscribe((params) => {
      this.slug = params['slug'];

      if (this.slug) {
        this.productService.getProductBySlug(this.slug).subscribe({
          next: (resp: any) => {
            if (resp.data) {
              this.product = resp.data;

              this.productService
                .getReviewsProductPopulate(this.product._id)
                .subscribe({
                  next: async (resp: any) => {
                    if (resp.data) {
                      resp.data.forEach((element: any) => {
                        if (element.estrellas == 5) {
                          this.count_five_start = this.count_five_start + 1;
                        } else if (element.estrellas == 4) {
                          this.count_four_start = this.count_four_start + 1;
                        } else if (element.estrellas == 3) {
                          this.count_three_start = this.count_three_start + 1;
                        } else if (element.estrellas == 2) {
                          this.count_two_start = this.count_two_start + 1;
                        } else if (element.estrellas == 1) {
                          this.count_one_start = this.count_one_start + 1;
                        }

                        this.cinco_porcent =
                          (this.count_five_start * 100) / resp.data.length;
                        this.cuatro_porcent =
                          (this.count_four_start * 100) / resp.data.length;
                        this.tres_porcent =
                          (this.count_three_start * 100) / resp.data.length;
                        this.dos_porcent =
                          (this.count_two_start * 100) / resp.data.length;
                        this.uno_porcent =
                          (this.count_one_start * 100) / resp.data.length;

                        let puntos_cinco = 0;
                        let puntos_cuatro = 0;
                        let puntos_tres = 0;
                        let puntos_dos = 0;
                        let punto_uno = 0;

                        puntos_cinco = this.count_five_start * 5;
                        puntos_cuatro = this.count_four_start * 4;
                        puntos_tres = this.count_three_start * 3;
                        puntos_dos = this.count_two_start * 2;
                        punto_uno = this.count_one_start * 1;

                        this.total_puntos =
                          puntos_cinco +
                          puntos_cuatro +
                          puntos_tres +
                          puntos_dos +
                          punto_uno;
                        this.max_puntos = resp.data.length * 5;

                        this.porcent_raiting =
                          (this.total_puntos * 100) / this.max_puntos;
                        this.puntos_raiting = (this.porcent_raiting * 5) / 100;
                      });

                      this.reviews = resp.data;
                    }
                  },
                  error: (error: any) => {
                    console.log('error', error);
                  },
                });

              this.productService
                .getRecommendProducts(this.product.categoria)
                .subscribe({
                  next: (resp: any) => {
                    if (resp.data) {
                      this.products_recommend = resp.data;
                    }

                    this.load_data = false;
                  },
                  error: (error) => {
                    console.log('error', error);
                    this.load_data = false;
                  },
                });
            }

            this.load_data = false;
          },
          error: (error) => {
            console.log('error', error);
            this.load_data = false;
          },
        });
      }
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        navPosition: 'top',
        controlsPosition: 'top',
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        navContainer: '#cs-thumbnails',
        navAsThumbnails: true,
        gutter: 15,
      });

      var e = document.querySelectorAll('.cs-gallery');
      if (e.length) {
        for (var t = 0; t < e.length; t++) {
          lightGallery(e[t], {
            selector: '.cs-gallery-item',
            download: !1,
            videojs: !0,
            youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 },
            vimeoPlayerParams: { byline: 0, portrait: 0 },
          });
        }
      }

      tns({
        container: '.cs-carousel-inner-two',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        navPosition: 'top',
        controlsPosition: 'top',
        mouseDrag: !0,
        speed: 600,
        autoplayHoverPause: !0,
        autoplayButtonOutput: !1,
        nav: false,
        controlsContainer: '#custom-controls-related',
        responsive: {
          0: {
            items: 1,
            gutter: 20,
          },
          480: {
            items: 2,
            gutter: 24,
          },
          700: {
            items: 3,
            gutter: 24,
          },
          1100: {
            items: 4,
            gutter: 30,
          },
        },
      });
    }, 500);

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

  getBigCaption(indice: any) {
    return `<h6 class="text-light">Gallery image caption #${indice + 1}</h6>`;
  }

  addProduct() {
    if (this.product.variedades.length >= 1 && !this.carrito_data.variedad) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Selecione una variedad del producto',
      });
      return;
    }

    if (this.carrito_data.cantidad > this.product.stock) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay suficientes productos',
      });
      return;
    }

    let data = {
      product: this.product._id,
      client: this.id,
      cantidad: this.carrito_data.cantidad,
      variedad: this.carrito_data.variedad,
    };

    this.btn_cart = true;

    this.carritoService.createCarrito(data).subscribe({
      next: (resp: any) => {
        this.webSocketService.emit('add-carrito-add', { data: true });

        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se agregó el producto al carrito',
        });

        this.btn_cart = false;
        /*     if (resp.data) {
          
        }
 */
        this.load_data = false;
      },
      error: (error) => {
        this.btn_cart = false;
        console.log('error', error);
        this.load_data = false;
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          color: '#FFF',
          class: 'text-danger',
          position: 'topRight',
          message: error.error.message,
        });
      },
    });
  }
}
