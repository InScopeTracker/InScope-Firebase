import { Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filter'})

export class FilterPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any {
        if (!items || !field) {
            return items;
        }
        return items.filter(item => item[field] == value);
    }
}