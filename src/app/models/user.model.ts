import { MyNotification } from "./my-notification.model";

export default interface User{
    id:string;
    name:string;
    avatarUrl:string;
    notifications:MyNotification[];
}