import { Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'filter'})

//Pipe filters array by the value of the filed indicated.
//Setting filterOut parameter to true, filters out objects with passed value at passed field. 
export class FilterPipe implements PipeTransform {
    transform(items: any[], field : string, value : string, filterOut: boolean): any {
        if (!items || !field) {
            return items;
        }

        if(filterOut){
            return items.filter(item => item[field] != value);
        } else {
            return items.filter(item => item[field] == value);
        }
    }
}