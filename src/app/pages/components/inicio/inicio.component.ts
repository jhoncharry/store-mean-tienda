import { Component, OnInit } from '@angular/core';
import { ImagePipe } from 'src/app/pipes/image.pipe';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductService } from 'src/app/services/product.service';

declare var tns: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers: [ImagePipe],
})
export class InicioComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  descuento_activo: any;
  imgBanner: any;

  new_products: Array<any>;
  products_mas_vendidos: Array<any>;

  config_categorias: Array<any> = [];

  constructor(
    private clientService: ClienteService,
    private productService: ProductService,
    private imagePipe: ImagePipe
  ) {
    this.clientService.getPublicConfig().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          resp.data.categorias.forEach((element: any) => {
            if (element.titulo == 'Smartphones') {
              this.config_categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/04.jpg',
              });
            } else if (element.titulo == 'Headphones') {
              this.config_categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/05.jpg',
              });
            } else if (element.titulo == 'Oficina') {
              this.config_categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/07.jpg',
              });
            } else if (element.titulo == 'Moda') {
              this.config_categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/09.jpg',
              });
            } else if (element.titulo == 'Alimentos') {
              this.config_categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/08.jpg',
              });
            } else if (element.titulo == 'Hogar') {
              this.config_categorias.push({
                titulo: element.titulo,
                portada: 'assets/img/ecommerce/home/categories/03.jpg',
              });
            }
          });
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

  ngOnInit(): void {
    this.productService.getNewProducts().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.new_products = resp.data;
        }

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });

    this.productService.getProductsMasVendidos().subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.products_mas_vendidos = resp.data;
        }

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });

    setTimeout(() => {
      tns({
        container: '.cs-carousel-inner',
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true },
        },
      });

      tns({
        container: '.cs-carousel-inner-two',
        controls: false,
        responsive: {
          0: {
            gutter: 20,
          },
          400: {
            items: 2,
            gutter: 20,
          },
          520: {
            gutter: 30,
          },
          768: {
            items: 3,
            gutter: 30,
          },
        },
      });

      tns({
        container: '.cs-carousel-inner-three',
        controls: false,
        mouseDrag: !0,
        responsive: {
          0: {
            items: 1,
            gutter: 20,
          },
          420: {
            items: 2,
            gutter: 20,
          },
          600: {
            items: 3,
            gutter: 20,
          },
          700: {
            items: 3,
            gutter: 30,
          },
          900: {
            items: 4,
            gutter: 30,
          },
          1200: {
            items: 5,
            gutter: 30,
          },
          1400: {
            items: 6,
            gutter: 30,
          },
        },
      });

      tns({
        container: '.cs-carousel-inner-four',
        nav: false,
        controlsText: [
          '<i class="cxi-arrow-left"></i>',
          '<i class="cxi-arrow-right"></i>',
        ],
        controlsContainer: '#custom-controls-trending',
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

      tns({
        container: '.cs-carousel-inner-five',
        controls: false,
        gutter: 30,
        responsive: {
          0: { items: 1 },
          380: { items: 2 },
          550: { items: 3 },
          750: { items: 4 },
          1000: { items: 5 },
          1250: { items: 6 },
        },
      });

      tns({
        container: '.cs-carousel-inner-six',
        controls: false,
        gutter: 15,
        responsive: {
          0: { items: 2 },
          500: { items: 3 },
          1200: { items: 3 },
        },
      });
    }, 1300);
  }
}
