import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-index-ordenes',
  templateUrl: './index-ordenes.component.html',
  styleUrls: ['./index-ordenes.component.css'],
})
export class IndexOrdenesComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  ordenes: Array<any>;

  page = 1;
  pageSize = 10;

  private id: any;
  constructor(
    private clientService: ClienteService,
    private auth: AuthService,
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

    this.initialData();
  }

  ngOnInit(): void {}

  initialData() {
    this.load_data = true;

    this.clientService.getOrdenesClient(this.id).subscribe({
      next: (resp: any) => {
        if (resp.data) {
          this.ordenes = resp.data;

          /*      this.productos = this.productos.filter(
            (item) => item.categoria.toLowerCase() === this.route_categoria
          ); */
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
