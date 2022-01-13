import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public.routing';
import { PublicComponent } from './public.component';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { SidebarComponent } from './components/usuario/sidebar/sidebar.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ImageModule } from '../pipes/image.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { CarritoComponent } from './components/carrito/carrito.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { DescuentoModule } from '../pipes/descuento.module';
import { ContactoComponent } from './components/contacto/contacto.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
import { RatingModule } from 'ng-starrating';
import { IndexReviewComponent } from './components/usuario/reviews/index-review/index-review.component';

@NgModule({
  declarations: [
    PublicComponent,
    NavComponent,
    FooterComponent,
    InicioComponent,
    LoginComponent,
    PerfilComponent,
    SidebarComponent,
    IndexProductoComponent,
    ShowProductoComponent,
    CarritoComponent,
    DireccionesComponent,
    ContactoComponent,
    IndexOrdenesComponent,
    DetalleOrdenComponent,
    IndexReviewComponent,
  ],
  exports: [
    PublicComponent,
    NavComponent,
    FooterComponent,
    InicioComponent,
    LoginComponent,
    PerfilComponent,
    SidebarComponent,
    IndexProductoComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbPaginationModule,
    ImageModule,
    DescuentoModule,
    RatingModule,
  ],
})
export class PublicModule {}
