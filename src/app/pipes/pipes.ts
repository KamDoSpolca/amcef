import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myfilter',
  pure: false
})
export class MyFilterPipe implements PipeTransform {
  transform(items: any[], filter: any): any {
    if (!items) {
      return items;
    }

    return filter === 'all' ? items : items.filter(item => item.finishedState === filter);
  }
}
