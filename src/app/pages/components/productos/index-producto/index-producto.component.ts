import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { ImagePipe } from 'src/app/pipes/image.pipe';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductService } from 'src/app/services/product.service';

import { WebSocketService } from 'src/app/services/web-socket.service';

declare var jQuery: any;
declare var $: any;

declare var iziToast: any;

declare var noUiSlider: any;

@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css'],
  providers: [ImagePipe],
})
export class IndexProductoComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  config_categorias: any;

  productos: Array<any> = [];

  filter_categoria: string = '';
  filter_producto: string = '';
  filter_categoria_productos = 'todos';

  route_categoria: any;

  page = 1;
  pageSize = 12;

  sort_by: string = 'default';

  carrito_data: any = {
    variedad: null,
    cantidad: 1,
  };

  private id: any;

  btn_cart: boolean = false;

  descuento_activo: any;
  imgBanner: any;

  constructor(
    private clientService: ClienteService,
    private carritoService: CarritoService,
    private auth: AuthService,
    private productService: ProductService,
    private webSocketService: WebSocketService,
    private route: ActivatedRoute,
    private imagePipe: ImagePipe
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
      this.route_categoria = params['categoria'];

      if (this.route_categoria) {
        console.log('asaaa');
        this.productService.getProducts(null).subscribe({
          next: (resp: any) => {
            if (resp.data) {
              this.productos = resp.data;

              this.productos = this.productos.filter(
                (item) => item.categoria.toLowerCase() === this.route_categoria
              );
            }

            this.load_data = false;
          },
          error: (error) => {
            console.log('error', error);
            this.load_data = false;
          },
        });
      } else {
        this.initialData();
      }
    });

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
  }

  ngOnInit(): void {
    var slider: any = document.getElementById('slider');
    noUiSlider.create(slider, {
      start: [0, 1000],
      connect: true,
      range: {
        min: 0,
        max: 1000,
      },
      tooltips: [true, true],
      pips: {
        mode: 'count',
        values: 5,
      },
    });

    slider.noUiSlider.on('update', function (values: any) {
      $('.cs-range-slider-value-min').val(values[0]);
      $('.cs-range-slider-value-max').val(values[1]);
    });
    $('.noUi-tooltip').css('font-size', '11px');

    this.clientService.getPromacionesActivas().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.descuento_activo = resp.data[0];

          this.imgBanner = this.imagePipe.transform(
            this.descuento_activo.banner,
            'promocion'
          );
        }

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });
  }

  initialData() {
    this.productService.getProducts(null).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.productos = resp.data;
        }

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });
  }

  buscarCategoria() {
    let search = new RegExp(this.filter_categoria, 'i');

    if (this.filter_categoria) {
      this.config_categorias.categorias =
        this.config_categorias.categorias.filter((item: any) =>
          search.test(item.titulo)
        );
    } else {
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
    }
  }

  buscarProducto() {
    this.load_data = true;

    let filtro;

    if (this.filter_producto) {
      filtro = this.filter_producto;
      this.productService.getProducts(filtro).subscribe({
        next: (resp: any) => {
          this.productos = resp.data;
          this.load_data = false;
        },
        error: (error) => {
          this.load_data = false;
        },
      });
    } else {
      this.initialData();
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar',
      });
      this.load_data = false;
    }
  }

  buscarCategoriaProducto() {
    if (this.filter_categoria_productos === 'todos') {
      this.initialData();
    } else {
      this.productService.getProducts(null).subscribe({
        next: (resp: any) => {
          if (resp.data) {
            this.productos = resp.data;

            this.productos = this.productos.filter(
              (item) => item.categoria === this.filter_categoria_productos
            );
          }

          this.load_data = false;
        },
        error: (error) => {
          console.log('error', error);
          this.load_data = false;
        },
      });
    }
  }

  buscarPrice() {
    this.productService.getProducts(null).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.productos = resp.data;

          let min = parseInt($('.cs-range-slider-value-min').val());
          let max = parseInt($('.cs-range-slider-value-max').val());

          this.productos = this.productos.filter((item) => {
            return item.price >= min && item.price <= max;
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

  resetProducts() {
    this.filter_producto = '';
    this.initialData();
  }

  orderBy() {
    const defaultProdcts = () => {
      this.initialData();
    };

    const populatiry = () => {
      this.productos.sort(function (a, b) {
        if (a.numero_ventas < b.numero_ventas) {
          return 1;
        }
        if (a.numero_ventas > b.numero_ventas) {
          return -1;
        }

        return 0;
      });
    };

    const hightolow = () => {
      this.productos.sort(function (a, b) {
        if (a.price < b.price) {
          return 1;
        }
        if (a.price > b.price) {
          return -1;
        }

        return 0;
      });
    };

    const lowtohigh = () => {
      this.productos.sort(function (a, b) {
        if (a.price > b.price) {
          return 1;
        }
        if (a.price < b.price) {
          return -1;
        }

        return 0;
      });
    };

    const aztitle = () => {
      this.productos.sort(function (a, b) {
        if (a.title > b.title) {
          return 1;
        }
        if (a.title < b.title) {
          return -1;
        }

        return 0;
      });
    };

    const zatitle = () => {
      this.productos.sort(function (a, b) {
        if (a.title < b.title) {
          return 1;
        }
        if (a.title > b.title) {
          return -1;
        }

        return 0;
      });
    };

    const handlers: any = {
      default: defaultProdcts,
      popularity: populatiry,
      hightolow: hightolow,
      lowtohigh: lowtohigh,
      aztitle: aztitle,
      zatitle: zatitle,
    };

    const handler = handlers[this.sort_by];
    if (!handler) throw Error('Sort by not recognized');

    return handler();
  }

  addProduct(product: any) {
    let data = {
      product: product._id,
      client: this.id,
      cantidad: 1,
      variedad: product.variedades[0]?.titulo || undefined,
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
