import { MyNotification } from "./my-notification.model";

export interface Visitor{
    id:string;
    name:string;
    avatarUrl:string;
    notifications:MyNotification[];
}
export interface User extends Visitor{
    email:string;
    password:string;
}