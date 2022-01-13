import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.api;

@Pipe({
  name: 'imagen',
})
export class ImagePipe implements PipeTransform {
  transform(
    img: string,
    tipo:
      | 'productos'
      | 'clientes'
      | 'configuraciones'
      | 'promocion'
      | 'productos-galeria'
  ): string {
    if (!img) {
      return `${base_url}/admin/upload/clientes/no-image`;
    } else if (img.includes('https')) {
      return img;
    } else if (img) {
      return `${base_url}/admin/upload/${tipo}/${img}`;
    } else {
      return `${base_url}/admin/upload/usuarios/no-image`;
    }
  }
}
