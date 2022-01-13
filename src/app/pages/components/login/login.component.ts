import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var jQuery: any;
declare var $: any;

declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  submitted = false;
  loading = false;

  load_btn = false;

  public loginForm = this.fb.group({
    email: [
      'test1@gmail.com',
      [
        Validators.required,
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ],
    ],
    password: ['123456', [Validators.required, Validators.minLength(3)]],
  });

  public registerForm = this.fb.group({
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
    password: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private clientService: ClienteService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  //Add user form actions
  get getControl() {
    return this.loginForm.controls;
  }

  login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son validos',
      });
      return;
    }

    // Realizar el posteo
    this.authService.login(this.loginForm.value).subscribe({
      next: (resp: any) => {
        this.router.navigateByUrl('/');
      },
      error: (error) => {
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

  //Add user form actions
  get getControlRegister() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.load_btn = true;

    this.clientService.createClient(this.registerForm.value).subscribe({
      next: (resp: any) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'User successfully registered',
        });

        this.load_btn = false;
        this.registerForm.reset();
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
