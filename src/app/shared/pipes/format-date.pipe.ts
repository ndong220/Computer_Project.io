import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  transform(date: Date, ...args: any[]): any {
    if (date) {
      const ngay = date.getDate();
      const thang = date.getMonth() + 1;
      const nam = date.getFullYear();
      return `${ngay} / ${thang} / ${nam}`;
    }
  }
}
