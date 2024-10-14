import { Pipe, PipeTransform } from "@angular/core";


/**
 * Shows unit of distance in meters or kilometers
 * @param value distance in meters
 */
@Pipe({
    name:'distanceFormat',
    standalone:true
})
export class DistanceFormatPipe implements PipeTransform{
    transform(value: number|null|undefined):string {
        if(value == null || value<0){
            return "unkown distance";
        }
        if(value >=1000){
            return `${value/1000} km`;
        }else{
            return `${value} m`
        }
    }

}