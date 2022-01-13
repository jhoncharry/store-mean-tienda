import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StarRatingComponent } from 'ng-starrating';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var $: any;

declare var iziToast: any;

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html',
  styleUrls: ['./detalle-orden.component.css'],
})
export class DetalleOrdenComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  id: any;
  orden: any;
  detalles: Array<any>;

  totalstar: any = 5;
  review: any = {};

  private client_id: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clientService: ClienteService,
    private auth: AuthService
  ) {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.auth.currentUser$.pipe(first()).subscribe({
      next: (resp: any) => {
        const { _id } = resp || null;

        this.client_id = _id;

        this.load_data = false;
      },
      error: (error) => {
        console.log('error', error);
        this.load_data = false;
      },
    });

    this.initialData();
  }

  ngOnInit(): void {}

  initialData() {
    this.clientService.getDetalleOrden(this.id).subscribe({
      next: async (resp: any) => {
        this.orden = resp.venta;

        resp.detalle_venta.forEach((element: any) => {
          this.clientService.getReviewsProduct(element.product._id).subscribe({
            next: async (resp: any) => {
              let emitido = false;

              resp.data.forEach((element: any) => {
                if (element.client === this.client_id) {
                  emitido = true;
                }
              });

              element.estado = emitido;
            },
            error: (error: any) => {
              console.log('error', error);
            },
          });
        });

        this.detalles = resp.detalle_venta;

        /*        this.imgSelect = this.imagePipe.transform(
          this.product.portada,
          'productos'
        ); */

        this.load_data = false;
        /*
        this.updateForm.reset();
        this.router.navigateByUrl('/panel/clientes'); */
      },
      error: (error: any) => {
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

  openModal(item: any) {
    this.review = {};

    this.review.product = item.product._id;
    this.review.client = item.client;
    this.review.venta = this.id;

    this.review.estrellas = this.totalstar;
  }

  onRate($event: {
    oldValue: number;
    newValue: number;
    starRating: StarRatingComponent;
  }) {
    this.review.estrellas = $event.newValue;
  }

  emitir(id: any) {
    if (!this.review.review) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un mensaje de la reseña',
      });
      return;
    }
    if (!this.totalstar || this.totalstar < 0) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un mensaje de la reseña',
      });
      return;
    }
    if (!this.review.review) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Seleccione el numero de estrellas',
      });
      return;
    }

    this.clientService.createReview(this.review).subscribe({
      next: async (resp: any) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se emitio correctamente la reseña.',
        });

        $('#review-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.initialData();
      },
      error: (error: any) => {
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
