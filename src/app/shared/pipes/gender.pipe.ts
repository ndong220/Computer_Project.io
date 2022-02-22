import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderPipe',
})
export class GenderPipe implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value === '1') {
      return 'Nam';
    }
    return 'Nữ';
  }
}
