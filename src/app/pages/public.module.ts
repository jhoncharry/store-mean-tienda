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

@NgModule({
  declarations: [
    PublicComponent,
    NavComponent,
    FooterComponent,
    InicioComponent,
    LoginComponent,
    PerfilComponent,
    SidebarComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
})
export class PublicModule {}
