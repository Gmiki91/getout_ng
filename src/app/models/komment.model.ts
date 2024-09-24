import { Event } from "./event.model";
import User from "./user.model";

export type Komment={
    id:string;
    text:string;
    timestamp:string;
    user:User;
    event:Event
}
export type NewKommentData={
    text:string;
    timestamp:string;
    userId:string;
    eventId:string
}