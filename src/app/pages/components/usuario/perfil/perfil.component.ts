import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css'],
})
export class PerfilComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  private id: any;
  client: any;

  public updateForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    lastname: ['', [Validators.required, Validators.minLength(3)]],
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    phone: [''],
    birthday: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/),
      ],
    ],
    dni: [''],
    genre: [null, [Validators.required]],
    country: [null, [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private clientService: ClienteService
  ) {}

  ngOnInit(): void {
    this.auth.loadCurrentUser().pipe(first()).subscribe({
      next: (resp: any) => {
        console.log('VALORRRRR', resp);

        // this.currentUser = x;
        // this.userLabel = `${this.currentUser?.name} ${this.currentUser?.lastname}`;
        this.client = resp;

        console.log(resp);

        this.updateForm.setValue({
          name: this.client.name || '',
          lastname: this.client.lastname || '',
          email: this.client.email || '',
          phone: this.client.phone || '',
          birthday: this.client.birthday || '',
          dni: this.client.dni || '',
          genre: this.client.genre || null,
          country: this.client.country || null,
          /*   phone: this.client.phone || '',
          birthday: this.client.birthday || '',
          dni: this.client.dni || '',
          genre: this.client.genre || null, */
        });

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

  //Add user form actions
  get getControl() {
    return this.updateForm.controls;
  }

  changeGenre($event: any) {
    this.getControl['genre'].setValue($event.target.value);
  }

  changeCountry($event: any) {
    this.getControl['country'].setValue($event.target.value);
  }

  update() {
    this.submitted = true;
    console.log('eeeeee', this.getControl);
    if (this.updateForm.invalid) {
      console.log('333333', this.getControl);
      return;
    }

    console.log('OKAAA', this.updateForm.value);

    this.load_btn = true;

    this.clientService
      .updateClient(this.client._id, this.updateForm.value)
      .subscribe({
        next: (resp: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'User successfully updated',
          });

          this.load_btn = false;
          this.updateForm.reset();
          this.router.navigateByUrl('/');
        },
        error: (error) => {
          console.log('error', error);
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
