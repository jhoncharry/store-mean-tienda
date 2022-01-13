import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { CarritoComponent } from './components/carrito/carrito.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { IndexProductoComponent } from './components/productos/index-producto/index-producto.component';
import { ShowProductoComponent } from './components/productos/show-producto/show-producto.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { DetalleOrdenComponent } from './components/usuario/ordenes/detalle-orden/detalle-orden.component';
import { IndexOrdenesComponent } from './components/usuario/ordenes/index-ordenes/index-ordenes.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { IndexReviewComponent } from './components/usuario/reviews/index-review/index-review.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
  },
  {
    path: 'productos',
    component: IndexProductoComponent,
  },
  {
    path: 'productos/categoria/:categoria',
    component: IndexProductoComponent,
  },
  {
    path: 'productos/:slug',
    component: ShowProductoComponent,
  },
  {
    path: 'contacto',
    component: ContactoComponent,
  },
  {
    path: 'cuenta/perfil',
    canActivate: [AuthGuard],
    component: PerfilComponent,
  },
  {
    path: 'cuenta/direcciones',
    canActivate: [AuthGuard],
    component: DireccionesComponent,
  },
  {
    path: 'cuenta/ordenes',
    canActivate: [AuthGuard],
    component: IndexOrdenesComponent,
  },
  {
    path: 'cuenta/ordenes/:id',
    canActivate: [AuthGuard],
    component: DetalleOrdenComponent,
  },
  {
    path: 'cuenta/reviews',
    canActivate: [AuthGuard],
    component: IndexReviewComponent,
  },
  {
    path: 'carrito',
    canActivate: [AuthGuard],
    component: CarritoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutingModule {}
