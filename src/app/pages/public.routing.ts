import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoggedGuard } from '../guards/logged.guard';
// import { LoggedGuard } from '../guards/logged.guard';
import { LoginComponent } from './components/login/login.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./child-routing.module').then((m) => m.ChildRoutingModule),
      },
      {
        path: 'login',
        canActivate: [LoggedGuard],
        component: LoginComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule {}
