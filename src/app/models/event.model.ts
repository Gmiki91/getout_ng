import { Komment } from "./komment.model";
import User from "./user.model";
export type LatLng={
    lat:number,
    lng:number
}
export type Event={
    id:string,
    title:string,
    location:string,
    latLng:LatLng,
    distance:number,
    time:string,
    participants:User[];
    min:number;
    max:number;
    info:string;
    ownerId:string;
    komments:Komment[];
}

export type NewEventData={
    title:string,
    location:string,
    latLng:{lat:number,lng:number},
    time:string,
    min:number;
    max:number;
    info?:string;
    ownerId?:string
}