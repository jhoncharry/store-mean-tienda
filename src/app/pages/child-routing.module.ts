import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { InicioComponent } from './components/inicio/inicio.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';

const routes: Routes = [
  {
    path: '',
    component: InicioComponent,
  },
  {
    path: 'cuenta/perfil',
    canActivate: [AuthGuard],
    component: PerfilComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChildRoutingModule {}
