import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast: any;

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css'],
})
export class DireccionesComponent implements OnInit {
  submitted = false;

  load_btn = false;
  load_data = true;

  public registerForm = this.fb.group({
    destinatario: ['', [Validators.required, Validators.minLength(3)]],
    dni: ['', [Validators.required, Validators.minLength(3)]],
    zip: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(3)]],
    pais: [null, [Validators.required]],
    region: [{ value: null, disabled: true }, [Validators.required]],
    provincia: [{ value: null, disabled: true }, [Validators.required]],
    distrito: [{ value: null, disabled: true }, [Validators.required]],
    principal: [false, [Validators.required]],
  });

  regiones: Array<any> = [];
  provincias: Array<any> = [];
  distritos: Array<any> = [];

  regiones_array: Array<any> = [];
  provincias_array: Array<any> = [];
  distritos_array: Array<any> = [];

  private id: any;

  direcciones: Array<any> = [];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private clientService: ClienteService,
    private router: Router
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

    this.clientService.getRegiones().subscribe((res: any) => {
      this.regiones_array = res;
    });
    this.clientService.getProvincias().subscribe((res: any) => {
      this.provincias_array = res;
    });
    this.clientService.getDistritos().subscribe((res: any) => {
      this.distritos_array = res;
    });
  }

  ngOnInit(): void {
    this.getDirecciones();
  }

  //Add user form actions
  get getControl() {
    return this.registerForm.controls;
  }

  changeCountry($event: any) {
    this.getControl['pais'].setValue($event.target.value);

    if (this.getControl['pais'].value === 'Peru') {
      this.getControl['region'].enable();
      this.clientService.getRegiones().subscribe((res: any) => {
        res.forEach((element: any) => {
          this.regiones.push({
            id: element.id,
            name: element.name,
          });
        });
      });
    } else {
      this.getControl['region'].disable();
      this.getControl['region'].setValue(null);
      this.regiones = [];

      this.getControl['provincia'].disable();
      this.getControl['provincia'].setValue(null);
      this.provincias = [];

      this.getControl['distrito'].disable();
      this.getControl['distrito'].setValue(null);
      this.provincias = [];
    }
    // this.getControl['country'].setValue($event.target.value);
  }

  changeRegion($event: any) {
    this.getControl['region'].setValue($event.target.value);

    this.getControl['provincia'].enable();
    this.getControl['provincia'].setValue(null);
    this.provincias = [];

    this.getControl['distrito'].disable();
    this.getControl['distrito'].setValue(null);
    this.distritos = [];

    this.clientService.getProvincias().subscribe((res: any) => {
      res.forEach((element: any) => {
        if (element.department_id === this.getControl['region'].value) {
          this.provincias.push(element);
        }
      });
    });
  }

  changeProvincia($event: any) {
    this.getControl['provincia'].setValue($event.target.value);

    this.getControl['distrito'].enable();
    this.getControl['distrito'].setValue(null);
    this.distritos = [];

    this.clientService.getDistritos().subscribe((res: any) => {
      res.forEach((element: any) => {
        if (element.province_id === this.getControl['provincia'].value) {
          this.distritos.push(element);
        }
      });
    });
  }
  changeDistrito($event: any) {
    this.getControl['distrito'].setValue($event.target.value);
  }

  register() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        color: '#FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Datos del formulario invalidos',
      });
      return;
    }

    this.regiones_array.forEach((element) => {
      if (parseInt(element.id) === parseInt(this.getControl['region'].value)) {
        this.getControl['region'].setValue(element.name);
      }
    });

    this.provincias_array.forEach((element) => {
      if (
        parseInt(element.id) === parseInt(this.getControl['provincia'].value)
      ) {
        this.getControl['provincia'].setValue(element.name);
      }
    });

    this.distritos_array.forEach((element) => {
      if (
        parseInt(element.id) === parseInt(this.getControl['distrito'].value)
      ) {
        this.getControl['distrito'].setValue(element.name);
      }
    });

    let data = {
      client: this.id,
      ...this.registerForm.value,
    };

    this.load_btn = true;

    this.clientService.createDireccion(data).subscribe({
      next: (resp: any) => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Direccion successfully updated',
        });

        this.load_btn = false;
        this.registerForm.reset();
        this.router.navigateByUrl('/cuenta/perfil');
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

  getDirecciones() {
    this.load_data = true;
    this.clientService.getDirecciones(this.id).subscribe((resp: any) => {
      this.direcciones = resp.data;
      this.load_data = false;
    });
  }

  updateDireccionPrincipal(idDireccion: any) {
    this.clientService
      .updateDireccionPrincipal(idDireccion, this.id)
      .subscribe({
        next: (resp: any) => {
          iziToast.show({
            title: 'SUCCESS',
            titleColor: '#1DC74C',
            color: '#FFF',
            class: 'text-success',
            position: 'topRight',
            message: 'Direccion principal successfully updated',
          });

          this.load_btn = false;
          this.router.navigateByUrl('/cuenta/perfil');
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
