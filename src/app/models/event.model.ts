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
    time:string,
    participants:User[];
    min:number;
    max:number;
    info:string;
    ownerId:string;
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