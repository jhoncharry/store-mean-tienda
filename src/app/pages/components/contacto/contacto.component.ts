import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css'],
})
export class ContactoComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  public registerForm = this.fb.group({
    cliente: ['', [Validators.required, Validators.minLength(3)]],
    correo: [
      'test1@gmail.com',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    telefono: [''],
    asunto: ['', [Validators.required]],
    mensaje: ['', [Validators.required]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private clientService: ClienteService
  ) {}

  ngOnInit(): void {}

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.load_btn = true;

    this.clientService.createContact(this.registerForm.value).subscribe({
      next: (resp: any) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Contact successfully registered',
        });

        this.load_btn = false;
        this.registerForm.reset();
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        this.load_btn = false;
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

    /*     this.user.register(this.registerForm.value).subscribe(
      ({ data: { register }, errors }) => {
        if (register) {
          Swal.fire('Register', 'Successful register', 'success');
          this.router.navigateByUrl('/login');
          return;
        }
        Swal.fire('Register', errors[0].message, 'error');
      },
      () => {
        Swal.fire('Error', 'Something went wrong... Networking!', 'error');
      }
    ); */
  }
}
