import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name:'distanceFormat',
    standalone:true
})
export class DistanceFormatPipe implements PipeTransform{
    transform(value: number):string {
        if(value >1000){
            return `${value/1000} km`;
        }else{
            return `${value} meters`
        }
    }

}