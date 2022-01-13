import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DescuentoPipe } from './descuento.pipe';

@NgModule({
  declarations: [DescuentoPipe],
  exports: [DescuentoPipe],
  imports: [CommonModule],
})
export class DescuentoModule {}
